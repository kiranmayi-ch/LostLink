import mongoose from 'mongoose';

export const CATEGORIES = [
  'Electronics',
  'ID Cards and Documents',
  'Bags and Backpacks',
  'Wallets and Purses',
  'Keys',
  'Books and Stationery',
  'Clothing',
  'Water Bottles',
  'Jewellery and Accessories',
  'Other',
];

const itemReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: 'Invalid category selected',
      },
    },
    reportType: {
      type: String,
      required: [true, 'Report type (lost or found) is required'],
      enum: {
        values: ['lost', 'found'],
        message: 'Report type must be either lost or found',
      },
    },
    dateOccurred: {
      type: Date,
      required: [true, 'Date occurred is required'],
      default: Date.now,
    },
    approximateLocation: {
      type: String,
      required: [true, 'Approximate location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    identifyingDetails: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Identifying details cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['active', 'under_claim', 'returned', 'archived', 'hidden'],
      default: 'active',
    },
    moderationStatus: {
      type: String,
      enum: ['approved', 'flagged', 'hidden'],
      default: 'approved',
    },
    moderationNotes: {
      type: String,
      trim: true,
      default: '',
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
itemReportSchema.index({ reportType: 1, status: 1 });
itemReportSchema.index({ category: 1 });
itemReportSchema.index({ reporterId: 1 });
itemReportSchema.index({ createdAt: -1 });
itemReportSchema.index({ moderationStatus: 1 });
itemReportSchema.index({
  title: 'text',
  description: 'text',
  approximateLocation: 'text',
});

const ItemReport = mongoose.models.ItemReport || mongoose.model('ItemReport', itemReportSchema);

export default ItemReport;
