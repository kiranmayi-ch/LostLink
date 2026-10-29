import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from '../services/notificationService.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await getUserNotifications(req.user._id, parseInt(page, 10), parseInt(limit, 10));

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await markAsRead(id, req.user._id);

  res.status(200).json({
    success: true,
    notification,
  });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await markAllAsRead(req.user._id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read.',
  });
});
