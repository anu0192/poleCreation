const Feedback = require('../models/Feedback');
const Analytics = require('../models/Analytics');
const { validateEmail, validateFeedback, validateRating } = require('../middleware/validation');

// Get all feedback (with pagination for fairness)
const getFeedback = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10); // Cap at 50 per page
    const skip = (page - 1) * limit;

    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Feedback.countDocuments();

    res.json({
      success: true,
      data: feedback,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving feedback',
      error: error.message
    });
  }
};

// Get feedback stats
const getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
      error: error.message
    });
  }
};

// Submit feedback with comprehensive validation
const submitFeedback = async (req, res) => {
  try {
    const { email, category, content, rating } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent') || 'unknown';

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate feedback content
    if (!validateFeedback(content)) {
      return res.status(400).json({
        success: false,
        message: 'Feedback must be between 2 and 5000 characters'
      });
    }

    // Validate category
    const validCategories = ['bug', 'feature', 'improvement', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected'
      });
    }

    // Validate rating
    if (!validateRating(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check for duplicate submissions (same email + content within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSimilar = await Feedback.findOne({
      email: email.toLowerCase(),
      content: content,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentSimilar) {
      return res.status(429).json({
        success: false,
        message: 'Duplicate feedback detected. Please wait before submitting similar feedback.'
      });
    }

    // Create new feedback record
    const feedback = new Feedback({
      email: email.toLowerCase(),
      category,
      content,
      rating,
      ipAddress,
      userAgent
    });

    await feedback.save();

    // Log analytics
    const analytics = new Analytics({
      ipAddress,
      endpoint: '/api/feedback',
      method: 'POST',
      statusCode: 201
    });
    await analytics.save();

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
  getFeedbackStats
};
