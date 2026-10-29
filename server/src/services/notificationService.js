import Notification from '../models/Notification.js';

export const createNotification = async ({
  recipientId,
  type,
  title,
  message,
  relatedReportId = null,
  relatedClaimId = null,
}) => {
  try {
    const notification = await Notification.create({
      recipientId,
      type,
      title,
      message,
      relatedReportId,
      relatedClaimId,
    });
    return notification;
  } catch (error) {
    console.error('[NotificationService] Failed to create notification:', error.message);
    return null;
  }
};

export const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipientId: userId })
      .populate('relatedReportId', 'title category reportType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ recipientId: userId }),
    Notification.countDocuments({ recipientId: userId, isRead: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

export const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipientId: userId },
    { isRead: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  return Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true });
};
