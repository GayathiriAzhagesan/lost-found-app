const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'staff'],
      default: 'student',
    },
    department: {
      type: String,
      default: 'General Studies',
      trim: true,
    },
    phone: {
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

// Pre-save hook to trim fields
userSchema.pre('save', function (next) {
  if (this.name) this.name = this.name.trim();
  if (this.email) this.email = this.email.trim().toLowerCase();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
