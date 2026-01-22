const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate users
 */
const auth = async (req, res, next) => {
      try {
            // Get token from header
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                  return res.status(401).json({
                        success: false,
                        message: 'No authentication token provided'
                  });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user
            const user = await User.findOne({
                  _id: decoded.userId,
                  isActive: true
            });

            if (!user) {
                  return res.status(401).json({
                        success: false,
                        message: 'User not found or inactive'
                  });
            }

            // Attach user to request
            req.user = user;
            req.userId = user._id;
            req.token = token;

            next();
      } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                  return res.status(401).json({
                        success: false,
                        message: 'Invalid token'
                  });
            }

            if (error.name === 'TokenExpiredError') {
                  return res.status(401).json({
                        success: false,
                        message: 'Token expired'
                  });
            }

            res.status(500).json({
                  success: false,
                  message: 'Authentication failed'
            });
      }
};

/**
 * Role-based access control middleware
 */
const authorize = (...roles) => {
      return (req, res, next) => {
            if (!req.user) {
                  return res.status(401).json({
                        success: false,
                        message: 'Unauthorized'
                  });
            }

            if (!roles.includes(req.user.role)) {
                  return res.status(403).json({
                        success: false,
                        message: 'Forbidden - Insufficient permissions'
                  });
            }

            next();
      };
};

/**
 * Optional auth - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
      try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (token) {
                  const decoded = jwt.verify(token, process.env.JWT_SECRET);
                  const user = await User.findById(decoded.userId);

                  if (user) {
                        req.user = user;
                        req.userId = user._id;
                  }
            }

            next();
      } catch (error) {
            // Continue without auth
            next();
      }
};

module.exports = {
      auth,
      authorize,
      optionalAuth
};
