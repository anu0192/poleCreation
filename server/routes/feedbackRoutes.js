const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { feedbackLimiter } = require('../middleware/rateLimiter');
const { inputValidationMiddleware } = require('../middleware/validation');

// Rate limiting middleware applied to feedback routes
router.use(inputValidationMiddleware);

// Get all feedback and stats
router.get('/', feedbackController.getFeedback);
router.get('/stats', feedbackController.getFeedbackStats);

// Submit new feedback with rate limiting
router.post('/', feedbackLimiter, feedbackController.submitFeedback);

module.exports = router;
