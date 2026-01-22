const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth, async (req, res) => {
      try {
            res.json({
                  success: true,
                  data: { user: req.user.toJSON() }
            });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, async (req, res) => {
      try {
            const updates = req.body;
            const user = await User.findByIdAndUpdate(
                  req.userId,
                  { $set: updates },
                  { new: true, runValidators: true }
            );

            res.json({
                  success: true,
                  message: 'Profile updated successfully',
                  data: { user: user.toJSON() }
            });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
