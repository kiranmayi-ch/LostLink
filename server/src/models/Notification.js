import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'match_found',
        'claim_received',
        'claim_status_updated',
        'handover_scheduled',
        'item_returned',
        'report_moderated',
        'system',
      ],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemReport',
      default: null,
    },
    relatedClaimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;
