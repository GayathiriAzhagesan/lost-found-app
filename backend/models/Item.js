const mongoose = require('mongoose');

const reporterSchema = new mongoose.Schema(
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

const itemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    type: {
      type: String,
      required: [true, 'Item type is required'],
      enum: ['lost', 'found'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Campus location is required'],
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    time: {
      type: String,
      default: '12:00',
    },
    status: {
      type: String,
      enum: ['open', 'claimed', 'recovered', 'closed'],
      default: 'open',
      index: true,
    },
    image: {
      type: String,
      default: null,
    },
    additionalDetails: {
      type: String,
      default: '',
      trim: true,
    },
    flags: {
      type: [String],
      default: [],
    },
    reporter: {
      type: reporterSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for search performance
itemSchema.index({ title: 'text', description: 'text', location: 'text', category: 'text' });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
