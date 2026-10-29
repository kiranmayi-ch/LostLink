import Claim from '../models/Claim.js';
import ItemReport from '../models/ItemReport.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

export const createClaim = asyncHandler(async (req, res) => {
  const { reportId, claimMessage, privateVerificationDetails } = req.body;

  const report = await ItemReport.findById(reportId);
  if (!report) {
    throw new ApiError(404, 'Item report not found.');
  }

  if (report.status === 'returned') {
    throw new ApiError(400, 'This item has already been returned to its owner and cannot receive new claims.');
  }

  if (report.status === 'archived' || report.status === 'hidden') {
    throw new ApiError(400, 'This report is no longer active.');
  }

  // Prevent users from claiming items they reported
  if (report.reporterId.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot submit an ownership claim for an item you reported yourself.');
  }

  // Prevent duplicate active claims
  const existingActiveClaim = await Claim.findOne({
    reportId,
    claimantId: req.user._id,
    status: { $in: ['pending', 'under_review', 'approved'] },
  });

  if (existingActiveClaim) {
    throw new ApiError(
      400,
      `You already have an active claim (${existingActiveClaim.status}) for this item.`
    );
  }

  const claim = await Claim.create({
    reportId,
    claimantId: req.user._id,
    finderId: report.reporterId,
    claimMessage: claimMessage.trim(),
    privateVerificationDetails: privateVerificationDetails ? privateVerificationDetails.trim() : '',
    status: 'pending',
    handoverStatus: 'none',
  });

  // Update report status to under_claim if currently active
  if (report.status === 'active') {
    report.status = 'under_claim';
    await report.save();
  }

  // Notify the finder/reporter
  await createNotification({
    recipientId: report.reporterId,
    type: 'claim_received',
    title: 'New Ownership Claim Received',
    message: `${req.user.name} submitted an ownership claim for your report: "${report.title}". Please review their verification details.`,
    relatedReportId: report._id,
    relatedClaimId: claim._id,
  });

  res.status(201).json({
    success: true,
    message: 'Your claim has been submitted successfully. The finder has been notified to review your evidence.',
    claim,
  });
});

export const getMyClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ claimantId: req.user._id })
    .populate('reportId', 'title category reportType approximateLocation imageUrl status')
    .populate('finderId', 'name institution')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    total: claims.length,
    claims,
  });
});

export const getReceivedClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ finderId: req.user._id })
    .populate('reportId', 'title category reportType status approximateLocation')
    .populate('claimantId', 'name email phone institution')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    total: claims.length,
    claims,
  });
});

export const getClaimById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const claim = await Claim.findById(id)
    .populate('reportId', 'title category reportType approximateLocation imageUrl status dateOccurred')
    .populate('claimantId', 'name email phone institution')
    .populate('finderId', 'name email phone institution');

  if (!claim) {
    throw new ApiError(404, 'Claim not found.');
  }

  const isClaimant = claim.claimantId._id.toString() === req.user._id.toString();
  const isFinder = claim.finderId._id.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'moderator'].includes(req.user.role);

  if (!isClaimant && !isFinder && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to view this claim.');
  }

  res.status(200).json({
    success: true,
    claim,
    permissions: {
      canApproveOrReject: isFinder || isAdmin,
      canUpdateHandover: isFinder || isClaimant || isAdmin,
    },
  });
});

export const updateClaimStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reviewNotes } = req.body;

  if (!['approved', 'rejected', 'under_review', 'cancelled'].includes(status)) {
    throw new ApiError(400, 'Invalid claim status requested.');
  }

  const claim = await Claim.findById(id).populate('reportId');
  if (!claim) {
    throw new ApiError(404, 'Claim not found.');
  }

  const isFinder = claim.finderId.toString() === req.user._id.toString();
  const isClaimant = claim.claimantId.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'moderator'].includes(req.user.role);

  // Claimant can only cancel their own claim
  if (status === 'cancelled') {
    if (!isClaimant && !isAdmin) {
      throw new ApiError(403, 'Only the claimant can withdraw this claim.');
    }
  } else {
    // Only finder or admin can approve/reject/put under review
    if (!isFinder && !isAdmin) {
      throw new ApiError(403, 'Only the item finder or campus administrator can review this claim.');
    }
  }

  claim.status = status;
  if (reviewNotes !== undefined) {
    claim.reviewNotes = reviewNotes.trim();
  }

  if (status === 'approved') {
    claim.handoverStatus = 'scheduled';
  }

  await claim.save();

  // Create notification for claimant
  await createNotification({
    recipientId: claim.claimantId,
    type: 'claim_status_updated',
    title: `Claim ${status.replace('_', ' ').toUpperCase()}`,
    message: `Your claim for "${claim.reportId.title}" has been updated to: ${status}.${
      reviewNotes ? ` Notes: "${reviewNotes}"` : ''
    }`,
    relatedReportId: claim.reportId._id,
    relatedClaimId: claim._id,
  });

  // If rejected or cancelled, check if there are other pending claims; if none, revert report status to active
  if (['rejected', 'cancelled'].includes(status)) {
    const remainingActiveClaims = await Claim.countDocuments({
      reportId: claim.reportId._id,
      status: { $in: ['pending', 'under_review', 'approved'] },
    });
    if (remainingActiveClaims === 0 && claim.reportId.status === 'under_claim') {
      claim.reportId.status = 'active';
      await claim.reportId.save();
    }
  }

  // Audit log for admin actions
  if (isAdmin) {
    await AuditLog.create({
      actorId: req.user._id,
      action: 'CLAIM_STATUS_UPDATED',
      resourceType: 'Claim',
      resourceId: claim._id.toString(),
      metadata: { status, reviewNotes },
    });
  }

  res.status(200).json({
    success: true,
    message: `Claim status successfully updated to ${status}.`,
    claim,
  });
});

export const updateHandover = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { handoverStatus, location, scheduledDate, notes } = req.body;

  if (!['none', 'scheduled', 'completed'].includes(handoverStatus)) {
    throw new ApiError(400, 'Invalid handover status requested.');
  }

  const claim = await Claim.findById(id).populate('reportId');
  if (!claim) {
    throw new ApiError(404, 'Claim not found.');
  }

  const isFinder = claim.finderId.toString() === req.user._id.toString();
  const isClaimant = claim.claimantId.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'moderator'].includes(req.user.role);

  if (!isFinder && !isClaimant && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to update handover information for this claim.');
  }

  claim.handoverStatus = handoverStatus;

  if (location !== undefined) claim.handoverDetails.location = location.trim();
  if (scheduledDate !== undefined) claim.handoverDetails.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
  if (notes !== undefined) claim.handoverDetails.notes = notes.trim();

  // If marked completed -> Successfully returned!
  if (handoverStatus === 'completed') {
    claim.status = 'approved';
    claim.resolvedAt = new Date();

    // Mark underlying report as returned!
    const report = await ItemReport.findById(claim.reportId._id);
    if (report) {
      report.status = 'returned';
      await report.save();
    }

    // Automatically resolve/cancel competing pending claims
    await Claim.updateMany(
      {
        reportId: claim.reportId._id,
        _id: { $ne: claim._id },
        status: { $in: ['pending', 'under_review'] },
      },
      {
        $set: {
          status: 'rejected',
          reviewNotes: 'Item was successfully verified and returned to another claimant.',
        },
      }
    );

    // Notify both claimant and finder
    await Promise.all([
      createNotification({
        recipientId: claim.claimantId,
        type: 'item_returned',
        title: 'Item Return Confirmed!',
        message: `Your item "${claim.reportId.title}" has been officially marked as returned. Thank you for using LostLink!`,
        relatedReportId: claim.reportId._id,
        relatedClaimId: claim._id,
      }),
      createNotification({
        recipientId: claim.finderId,
        type: 'item_returned',
        title: 'Item Return Completed',
        message: `Thank you for returning "${claim.reportId.title}" to its rightful owner! Your honesty strengthens our campus community.`,
        relatedReportId: claim.reportId._id,
        relatedClaimId: claim._id,
      }),
    ]);

    // Record audit log
    await AuditLog.create({
      actorId: req.user._id,
      action: 'ITEM_RETURN_COMPLETED',
      resourceType: 'ItemReport',
      resourceId: claim.reportId._id.toString(),
      metadata: { claimId: claim._id.toString(), returnedTo: claim.claimantId.toString() },
    });
  } else {
    // Notify counterparty about scheduled handover
    const counterpartyId = isFinder ? claim.claimantId : claim.finderId;
    await createNotification({
      recipientId: counterpartyId,
      type: 'handover_scheduled',
      title: 'Handover Details Updated',
      message: `Handover coordinates updated for "${claim.reportId.title}": ${location || 'Campus designated safe zone'}.`,
      relatedReportId: claim.reportId._id,
      relatedClaimId: claim._id,
    });
  }

  await claim.save();

  res.status(200).json({
    success: true,
    message: handoverStatus === 'completed' ? 'Item return successfully completed!' : 'Handover details updated.',
    claim,
  });
});
