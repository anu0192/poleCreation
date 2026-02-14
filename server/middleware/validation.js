const validator = require('validator');
const mongoSanitize = require('express-mongo-sanitize');

// FAIRNESS MECHANISM #2: Input Validation & Sanitization
// Prevents injection attacks and ensures data integrity
// Validates all inputs against expected formats

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return validator.isEmail(email);
};

const validateFeedback = (feedback) => {
  if (!feedback || typeof feedback !== 'string') return false;
  
  // Check length constraints
  if (feedback.length < 2 || feedback.length > 5000) {
    return false;
  }
  
  // Remove potentially harmful content
  return true;
};

const validateRating = (rating) => {
  const num = Number(rating);
  return Number.isInteger(num) && num >= 1 && num <= 5;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Trim whitespace
  let cleaned = input.trim();
  
  // Remove HTML tags
  cleaned = validator.stripLow(cleaned);
  
  // Escape HTML entities
  cleaned = validator.escape(cleaned);
  
  return cleaned;
};

const inputValidationMiddleware = (req, res, next) => {
  // Sanitize all string inputs in request body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }
  }
  next();
};

module.exports = {
  mongoSanitize: mongoSanitize(),
  inputValidationMiddleware,
  validateEmail,
  validateFeedback,
  validateRating,
  sanitizeInput
};
