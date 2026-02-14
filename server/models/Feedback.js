const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'other'],
    required: true
  },
  content: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 5000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for rate limiting lookup
feedbackSchema.index({ ipAddress: 1, createdAt: -1 });
feedbackSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
