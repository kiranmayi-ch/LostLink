import User from '../models/User.js';
import ItemReport from '../models/ItemReport.js';
import Claim from '../models/Claim.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const { search, role, status, page = 1, limit = 15 } = req.query;

  const query = {};

  if (role && ['user', 'moderator', 'admin'].includes(role)) {
    query.role = role;
  }

  if (status && ['active', 'suspended'].includes(status)) {
    query.accountStatus = status;
  }

  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [{ name: { $regex: s, $options: 'i' } }, { email: { $regex: s, $options: 'i' } }];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    users,
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  if (!['active', 'suspended'].includes(status)) {
    throw new ApiError(400, 'Invalid account status. Must be active or suspended.');
  }

  // Prevent an admin from suspending their own account
  if (id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot suspend your own administrator account.');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const previousStatus = user.accountStatus;
  user.accountStatus = status;
  await user.save();

  // Record audit log
  await AuditLog.create({
    actorId: req.user._id,
    action: status === 'suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
    resourceType: 'User',
    resourceId: user._id.toString(),
    metadata: {
      targetUserEmail: user.email,
      previousStatus,
      newStatus: status,
      reason: reason || 'Administrative action',
    },
  });

  res.status(200).json({
    success: true,
    message: `User account has been ${status === 'suspended' ? 'suspended' : 'reactivated'}.`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      accountStatus: user.accountStatus,
    },
  });
});

export const getAdminReports = asyncHandler(async (req, res) => {
  const { search, category, reportType, status, moderationStatus, page = 1, limit = 15 } = req.query;

  const query = {};

  if (category && category !== 'all') query.category = category;
  if (reportType && ['lost', 'found'].includes(reportType)) query.reportType = reportType;
  if (status && status !== 'all') query.status = status;
  if (moderationStatus && ['approved', 'flagged', 'hidden'].includes(moderationStatus)) {
    query.moderationStatus = moderationStatus;
  }

  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: 'i' } },
      { description: { $regex: s, $options: 'i' } },
      { approximateLocation: { $regex: s, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (pageNum - 1) * limitNum;

  const [reports, total] = await Promise.all([
    ItemReport.find(query)
      .populate('reporterId', 'name email institution')
      .sort({ createdAt: -1 })
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
    reports,
  });
});

export const moderateReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { moderationStatus, status, notes } = req.body;

  const report = await ItemReport.findById(id);
  if (!report) {
    throw new ApiError(404, 'Report not found.');
  }

  const prevMod = report.moderationStatus;
  const prevStatus = report.status;

  if (moderationStatus && ['approved', 'flagged', 'hidden'].includes(moderationStatus)) {
    report.moderationStatus = moderationStatus;
  }

  if (status && ['active', 'archived', 'hidden'].includes(status)) {
    report.status = status;
    if (status === 'archived') {
      report.archivedAt = new Date();
    }
  }

  if (notes !== undefined) {
    report.moderationNotes = notes.trim();
  }

  await report.save();

  // Audit log
  await AuditLog.create({
    actorId: req.user._id,
    action: 'REPORT_MODERATED',
    resourceType: 'ItemReport',
    resourceId: report._id.toString(),
    metadata: {
      reportTitle: report.title,
      prevMod,
      newMod: report.moderationStatus,
      prevStatus,
      newStatus: report.status,
      notes,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Report moderation status updated successfully.',
    report,
  });
});

export const getAdminClaims = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 15 } = req.query;

  const query = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (pageNum - 1) * limitNum;

  const [claims, total] = await Promise.all([
    Claim.find(query)
      .populate('reportId', 'title category reportType status')
      .populate('claimantId', 'name email phone institution')
      .populate('finderId', 'name email phone institution')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Claim.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    claims,
  });
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    AuditLog.find()
      .populate('actorId', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    AuditLog.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    logs,
  });
});
