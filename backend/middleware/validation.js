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
      body('content').custom((val, { req }) => {
            if (typeof val === 'string' && val.trim().length > 0) {
                  req.body.content = { text: val.trim() };
                  return true;
            }
            if (val && typeof val === 'object' && typeof val.text === 'string' && val.text.trim().length > 0) {
                  return true;
            }
            throw new Error('Post content is required');
      }),
      body('platforms').custom((val, { req }) => {
            if (!val && req.body.platform) {
                  req.body.platforms = [req.body.platform];
                  return true;
            }
            if (Array.isArray(val) && val.length > 0) {
                  const validPlatforms = ['youtube', 'linkedin', 'twitter', 'instagram'];
                  const allValid = val.every(p => validPlatforms.includes(p));
                  if (!allValid) throw new Error('Invalid platform');
                  return true;
            }
            throw new Error('At least one platform is required');
      }),
      body('scheduledFor')
            .optional({ checkFalsy: true })
            .isISO8601()
            .withMessage('Invalid date format'),
      validate
];

/**
 * YouTube video validation
 */
const youtubeVideoValidation = [
      body('idea').custom((val, { req }) => {
            if (!val && req.body.title) {
                  req.body.idea = {
                        title: req.body.title,
                        description: req.body.description || ''
                  };
                  return true;
            }
            if (val && typeof val.title === 'string' && val.title.trim().length > 0) {
                  return true;
            }
            throw new Error('Video title is required');
      }),
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
