import ItemReport from '../models/ItemReport.js';
import Claim from '../models/Claim.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { findMatchesForReport } from '../services/matchingService.js';
import { createNotification } from '../services/notificationService.js';

export const createReport = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    reportType,
    dateOccurred,
    approximateLocation,
    imageUrl,
    identifyingDetails,
  } = req.body;

  const report = await ItemReport.create({
    title: title.trim(),
    description: description.trim(),
    category,
    reportType,
    dateOccurred: dateOccurred ? new Date(dateOccurred) : new Date(),
    approximateLocation: approximateLocation.trim(),
    imageUrl: imageUrl ? imageUrl.trim() : '',
    identifyingDetails: identifyingDetails ? identifyingDetails.trim() : '',
    reporterId: req.user._id,
    status: 'active',
    moderationStatus: 'approved',
  });

  // Check potential matches in background and notify if strong match exists
  findMatchesForReport(report._id, 3)
    .then(async (matches) => {
      const topMatch = matches[0];
      if (topMatch && topMatch.matchScore >= 65) {
        await createNotification({
          recipientId: req.user._id,
          type: 'match_found',
          title: 'Potential Match Discovered',
          message: `We found a ${topMatch.matchScore}% potential match for your report "${report.title}": "${topMatch.report.title}".`,
          relatedReportId: topMatch.report._id,
        });
      }
    })
    .catch((err) => console.error('[Matching Background Error]:', err.message));

  res.status(201).json({
    success: true,
    message: `${reportType === 'lost' ? 'Lost' : 'Found'} item reported successfully.`,
    report,
  });
});

export const getReports = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    reportType,
    status,
    location,
    startDate,
    endDate,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const query = {
    moderationStatus: 'approved',
  };

  // Status filtering (default to active, under_claim, returned; exclude archived and hidden)
  if (status && status !== 'all') {
    query.status = status;
  } else {
    query.status = { $in: ['active', 'under_claim', 'returned'] };
  }

  // Report type filtering (lost / found)
  if (reportType && ['lost', 'found'].includes(reportType)) {
    query.reportType = reportType;
  }

  // Category filtering
  if (category && category !== 'all') {
    query.category = category;
  }

  // Location filtering
  if (location && location.trim()) {
    query.approximateLocation = { $regex: location.trim(), $options: 'i' };
  }

  // Date range filtering
  if (startDate || endDate) {
    query.dateOccurred = {};
    if (startDate) query.dateOccurred.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.dateOccurred.$lte = end;
    }
  }

  // Search by text (title or description)
  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: 'i' } },
      { description: { $regex: s, $options: 'i' } },
      { approximateLocation: { $regex: s, $options: 'i' } },
    ];
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'date') {
    sortOption = { dateOccurred: -1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [reports, total] = await Promise.all([
    ItemReport.find(query)
      .select('-identifyingDetails') // Privacy: keep confidential identifying details private in public list
      .populate('reporterId', 'name institution')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    ItemReport.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    limit: limitNum,
    reports,
  });
});

export const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await ItemReport.findById(id).populate('reporterId', 'name institution email phone');
  if (!report) {
    throw new ApiError(404, 'Item report not found.');
  }

  // Check if report is hidden or archived
  const isReporter = req.user && req.user._id.toString() === report.reporterId._id.toString();
  const isAdmin = req.user && ['admin', 'moderator'].includes(req.user.role);

  if ((report.status === 'hidden' || report.moderationStatus === 'hidden') && !isAdmin && !isReporter) {
    throw new ApiError(404, 'Item report is not available.');
  }

  // Check if current user has an active claim on this report
  let userClaim = null;
  if (req.user && !isReporter) {
    userClaim = await Claim.findOne({
      reportId: report._id,
      claimantId: req.user._id,
    }).lean();
  }

  // Sanitize reporter contact info for public visitors to protect privacy
  const sanitizedReport = report.toObject();
  if (!isAdmin && !isReporter) {
    delete sanitizedReport.reporterId.email;
    delete sanitizedReport.reporterId.phone;
    // Don't expose sensitive identifyingDetails to general public
    sanitizedReport.identifyingDetails = '';
  }

  res.status(200).json({
    success: true,
    report: sanitizedReport,
    isOwner: !!isReporter,
    userClaim: userClaim
      ? {
          id: userClaim._id,
          status: userClaim.status,
          handoverStatus: userClaim.handoverStatus,
          createdAt: userClaim.createdAt,
        }
      : null,
  });
});

export const getMyReports = asyncHandler(async (req, res) => {
  const { reportType, status, page = 1, limit = 10 } = req.query;

  const query = { reporterId: req.user._id };

  if (reportType && ['lost', 'found'].includes(reportType)) {
    query.reportType = reportType;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [reports, total] = await Promise.all([
    ItemReport.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ItemReport.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    limit: limitNum,
    reports,
  });
});

export const updateReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    dateOccurred,
    approximateLocation,
    imageUrl,
    identifyingDetails,
  } = req.body;

  const report = await ItemReport.findById(id);
  if (!report) {
    throw new ApiError(404, 'Item report not found.');
  }

  const isOwner = report.reporterId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to update this report.');
  }

  if (report.status === 'returned') {
    throw new ApiError(400, 'Cannot edit an item report that has already been returned.');
  }

  if (report.status === 'archived') {
    throw new ApiError(400, 'Cannot edit an archived report.');
  }

  if (title) report.title = title.trim();
  if (description) report.description = description.trim();
  if (category) report.category = category;
  if (dateOccurred) report.dateOccurred = new Date(dateOccurred);
  if (approximateLocation) report.approximateLocation = approximateLocation.trim();
  if (imageUrl !== undefined) report.imageUrl = imageUrl.trim();
  if (identifyingDetails !== undefined) report.identifyingDetails = identifyingDetails.trim();

  await report.save();

  res.status(200).json({
    success: true,
    message: 'Report updated successfully.',
    report,
  });
});

export const deleteReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await ItemReport.findById(id);
  if (!report) {
    throw new ApiError(404, 'Item report not found.');
  }

  const isOwner = report.reporterId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not authorized to withdraw this report.');
  }

  // Safe archival instead of breaking relational references to claims
  report.status = 'archived';
  report.archivedAt = new Date();
  await report.save();

  res.status(200).json({
    success: true,
    message: 'Report has been safely withdrawn and archived.',
  });
});

export const getReportMatches = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const report = await ItemReport.findById(id);
  if (!report) {
    throw new ApiError(404, 'Item report not found.');
  }

  const matches = await findMatchesForReport(id, 6);

  res.status(200).json({
    success: true,
    targetReport: {
      id: report._id,
      title: report.title,
      category: report.category,
      reportType: report.reportType,
      approximateLocation: report.approximateLocation,
      dateOccurred: report.dateOccurred,
    },
    matches,
  });
});
