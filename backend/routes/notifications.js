const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', auth, async (req, res) => {
      try {
            const { status = 'unread', limit = 50 } = req.query;
            const notifications = await Notification.find({
                  userId: req.userId,
                  ...(status !== 'all' && { status })
            })
                  .sort({ createdAt: -1 })
                  .limit(parseInt(limit));

            res.json({ success: true, data: { notifications } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.put('/:id/read', auth, async (req, res) => {
      try {
            const notification = await Notification.findOneAndUpdate(
                  { _id: req.params.id, userId: req.userId },
                  { status: 'read', readAt: new Date() },
                  { new: true }
            );
            res.json({ success: true, data: { notification } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
