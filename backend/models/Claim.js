const mongoose = require('mongoose');

const claimantSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const itemDetailsSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    type: { type: String, default: '' },
    category: { type: String, default: '' },
    location: { type: String, default: '' },
    image: { type: String, default: null },
  },
  { _id: false }
);

const claimSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    item: {
      type: String,
      required: [true, 'Target item ID is required'],
      index: true,
    },
    itemDetails: {
      type: itemDetailsSchema,
      default: () => ({}),
    },
    claimant: {
      type: claimantSchema,
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Claim message is required'],
      trim: true,
    },
    proofImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;
