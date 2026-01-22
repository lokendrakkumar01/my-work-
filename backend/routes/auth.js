const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, sendWelcomeEmail } = require('../services/email.service');
const { registerValidation, loginValidation, otpValidation } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

/**
 * Generate OTP
 */
const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
      return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', registerValidation, async (req, res) => {
      try {
            const { email, password, fullName } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                  return res.status(400).json({
                        success: false,
                        message: 'Email already registered'
                  });
            }

            // Create user
            const user = new User({
                  email,
                  password,
                  'profile.fullName': fullName || ''
            });

            await user.save();

            // Send welcome email
            await sendWelcomeEmail(email, fullName || 'Creator');

            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                  success: true,
                  message: 'Registration successful',
                  data: {
                        user: user.toJSON(),
                        token
                  }
            });
      } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Registration failed',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post('/login', loginValidation, async (req, res) => {
      try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                  });
            }

            // Check if account is locked
            if (user.isLocked()) {
                  return res.status(423).json({
                        success: false,
                        message: 'Account is locked. Please try again later.'
                  });
            }

            // Verify password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                  await user.incLoginAttempts();
                  return res.status(401).json({
                        success: false,
                        message: 'Invalid credentials'
                  });
            }

            // Reset login attempts
            await user.resetLoginAttempts();

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Generate token
            const token = generateToken(user._id);

            res.json({
                  success: true,
                  message: 'Login successful',
                  data: {
                        user: user.toJSON(),
                        token
                  }
            });
      } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Login failed',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email
 * @access  Public
 */
router.post('/send-otp', async (req, res) => {
      try {
            const { email } = req.body;

            if (!email) {
                  return res.status(400).json({
                        success: false,
                        message: 'Email is required'
                  });
            }

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: 'User not found'
                  });
            }

            // Generate OTP
            const otp = generateOTP();

            // Save OTP to user
            user.otp = {
                  code: otp,
                  expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
                  verified: false
            };
            await user.save();

            // Send OTP email
            await sendOTP(email, otp, user.profile.fullName || 'User');

            res.json({
                  success: true,
                  message: 'OTP sent successfully to your email'
            });
      } catch (error) {
            console.error('Send OTP error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to send OTP',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login
 * @access  Public
 */
router.post('/verify-otp', otpValidation, async (req, res) => {
      try {
            const { email, otp } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: 'User not found'
                  });
            }

            // Check if OTP exists
            if (!user.otp || !user.otp.code) {
                  return res.status(400).json({
                        success: false,
                        message: 'No OTP found. Please request a new one.'
                  });
            }

            // Check if OTP is expired
            if (user.otp.expiresAt < new Date()) {
                  return res.status(400).json({
                        success: false,
                        message: 'OTP has expired. Please request a new one.'
                  });
            }

            // Verify OTP
            if (user.otp.code !== otp) {
                  return res.status(401).json({
                        success: false,
                        message: 'Invalid OTP'
                  });
            }

            // Mark OTP as verified
            user.otp.verified = true;
            user.isVerified = true;
            user.lastLogin = new Date();
            await user.save();

            // Generate token
            const token = generateToken(user._id);

            res.json({
                  success: true,
                  message: 'OTP verified successfully',
                  data: {
                        user: user.toJSON(),
                        token
                  }
            });
      } catch (error) {
            console.error('Verify OTP error:', error);
            res.status(500).json({
                  success: false,
                  message: 'OTP verification failed',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password', async (req, res) => {
      try {
            const { email, otp, newPassword } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                  return res.status(404).json({
                        success: false,
                        message: 'User not found'
                  });
            }

            // Verify OTP
            if (!user.otp || user.otp.code !== otp || user.otp.expiresAt < new Date()) {
                  return res.status(401).json({
                        success: false,
                        message: 'Invalid or expired OTP'
                  });
            }

            // Update password
            user.password = newPassword;
            user.otp = undefined;
            await user.save();

            res.json({
                  success: true,
                  message: 'Password reset successful'
            });
      } catch (error) {
            console.error('Password reset error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Password reset failed',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', auth, async (req, res) => {
      try {
            // In a production app with token blacklisting, add token to blacklist here
            res.json({
                  success: true,
                  message: 'Logout successful'
            });
      } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Logout failed',
                  error: error.message
            });
      }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
      try {
            res.json({
                  success: true,
                  data: {
                        user: req.user.toJSON()
                  }
            });
      } catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to get user',
                  error: error.message
            });
      }
});

module.exports = router;
