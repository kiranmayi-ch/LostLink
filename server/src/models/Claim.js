import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemReport',
      required: [true, 'Report ID is required'],
    },
    claimantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Claimant ID is required'],
    },
    finderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Finder ID is required'],
    },
    claimMessage: {
      type: String,
      required: [true, 'Please explain why you believe this item belongs to you'],
      trim: true,
      minlength: [10, 'Claim explanation must be at least 10 characters'],
      maxlength: [1500, 'Claim explanation cannot exceed 1500 characters'],
    },
    privateVerificationDetails: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1500, 'Verification details cannot exceed 1500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'under_review', 'approved', 'rejected', 'cancelled'],
        message: 'Invalid claim status',
      },
      default: 'pending',
    },
    reviewNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Review notes cannot exceed 1000 characters'],
    },
    handoverStatus: {
      type: String,
      enum: {
        values: ['none', 'scheduled', 'completed'],
        message: 'Invalid handover status',
      },
      default: 'none',
    },
    handoverDetails: {
      location: { type: String, trim: true, default: '' },
      scheduledDate: { type: Date, default: null },
      notes: { type: String, trim: true, default: '' },
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
claimSchema.index({ reportId: 1, claimantId: 1 });
claimSchema.index({ finderId: 1, status: 1 });
claimSchema.index({ claimantId: 1, status: 1 });
claimSchema.index({ status: 1 });
claimSchema.index({ createdAt: -1 });

const Claim = mongoose.models.Claim || mongoose.model('Claim', claimSchema);

export default Claim;
