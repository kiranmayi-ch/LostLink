import User from '../models/User.js';
import ItemReport from '../models/ItemReport.js';
import Claim from '../models/Claim.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [
    totalLost,
    totalFound,
    activeReports,
    returnedItems,
    pendingClaimsCount,
    receivedPendingClaimsCount,
    recentReports,
    recentClaims,
  ] = await Promise.all([
    ItemReport.countDocuments({ reporterId: userId, reportType: 'lost', status: { $ne: 'archived' } }),
    ItemReport.countDocuments({ reporterId: userId, reportType: 'found', status: { $ne: 'archived' } }),
    ItemReport.countDocuments({ reporterId: userId, status: { $in: ['active', 'under_claim'] } }),
    ItemReport.countDocuments({ reporterId: userId, status: 'returned' }),
    Claim.countDocuments({ claimantId: userId, status: { $in: ['pending', 'under_review'] } }),
    Claim.countDocuments({ finderId: userId, status: { $in: ['pending', 'under_review'] } }),
    ItemReport.find({ reporterId: userId, status: { $ne: 'archived' } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Claim.find({ claimantId: userId })
      .populate('reportId', 'title category reportType status')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalLost,
      totalFound,
      activeReports,
      returnedItems,
      pendingClaimsCount,
      receivedPendingClaimsCount,
    },
    recentReports,
    recentClaims,
  });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalLostReports,
    totalFoundReports,
    activeReports,
    returnedReports,
    pendingClaims,
    approvedClaims,
    flaggedReports,
    recentAuditLogs,
  ] = await Promise.all([
    User.countDocuments(),
    ItemReport.countDocuments({ reportType: 'lost', status: { $ne: 'archived' } }),
    ItemReport.countDocuments({ reportType: 'found', status: { $ne: 'archived' } }),
    ItemReport.countDocuments({ status: { $in: ['active', 'under_claim'] } }),
    ItemReport.countDocuments({ status: 'returned' }),
    Claim.countDocuments({ status: { $in: ['pending', 'under_review'] } }),
    Claim.countDocuments({ status: 'approved' }),
    ItemReport.countDocuments({ moderationStatus: 'flagged' }),
    AuditLog.find()
      .populate('actorId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(8)
      .lean(),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalLostReports,
      totalFoundReports,
      activeReports,
      returnedReports,
      pendingClaims,
      approvedClaims,
      flaggedReports,
    },
    recentAuditLogs,
  });
});
