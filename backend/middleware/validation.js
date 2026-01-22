const { body, validationResult } = require('express-validator');

/**
 * Validation middleware
 */
const validate = (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
            return res.status(400).json({
                  success: false,
                  message: 'Validation failed',
                  errors: errors.array().map(err => ({
                        field: err.param,
                        message: err.msg
                  }))
            });
      }

      next();
};

/**
 * Registration validation
 */
const registerValidation = [
      body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
      body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain uppercase, lowercase, and number'),
      body('fullName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Full name must be between 2 and 100 characters'),
      validate
];

/**
 * Login validation
 */
const loginValidation = [
      body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
      body('password')
            .exists()
            .withMessage('Password is required'),
      validate
];

/**
 * OTP validation
 */
const otpValidation = [
      body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
      body('otp')
            .isLength({ min: 6, max: 6 })
            .isNumeric()
            .withMessage('OTP must be 6 digits'),
      validate
];

/**
 * Task validation
 */
const taskValidation = [
      body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 200 })
            .withMessage('Title cannot exceed 200 characters'),
      body('priority')
            .optional()
            .isIn(['low', 'medium', 'high', 'urgent'])
            .withMessage('Invalid priority'),
      body('dueDate')
            .optional()
            .isISO8601()
            .withMessage('Invalid date format'),
      validate
];

/**
 * Social post validation
 */
const socialPostValidation = [
      body('content.text')
            .trim()
            .notEmpty()
            .withMessage('Post content is required')
            .isLength({ max: 5000 })
            .withMessage('Content cannot exceed 5000 characters'),
      body('platforms')
            .isArray({ min: 1 })
            .withMessage('At least one platform is required'),
      body('platforms.*')
            .isIn(['youtube', 'linkedin', 'twitter', 'instagram'])
            .withMessage('Invalid platform'),
      body('scheduledFor')
            .optional()
            .isISO8601()
            .withMessage('Invalid date format'),
      validate
];

/**
 * YouTube video validation
 */
const youtubeVideoValidation = [
      body('idea.title')
            .trim()
            .notEmpty()
            .withMessage('Video title is required')
            .isLength({ max: 200 })
            .withMessage('Title cannot exceed 200 characters'),
      body('idea.priority')
            .optional()
            .isIn(['low', 'medium', 'high', 'urgent'])
            .withMessage('Invalid priority'),
      validate
];

module.exports = {
      validate,
      registerValidation,
      loginValidation,
      otpValidation,
      taskValidation,
      socialPostValidation,
      youtubeVideoValidation
};
