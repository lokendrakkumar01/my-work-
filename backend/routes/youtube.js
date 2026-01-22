const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const YouTubeVideo = require('../models/YouTubeVideo');

router.get('/', auth, async (req, res) => {
      try {
            const { stage, status } = req.query;
            const query = { userId: req.userId };
            if (stage) query.stage = stage;
            if (status) query.status = status;

            const videos = await YouTubeVideo.find(query).sort({ createdAt: -1 });
            res.json({ success: true, data: { videos, count: videos.length } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.post('/', auth, async (req, res) => {
      try {
            const video = new YouTubeVideo({ ...req.body, userId: req.userId });
            await video.save();

            res.status(201).json({
                  success: true,
                  message: 'Video idea created successfully',
                  data: { video }
            });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.put('/:id', auth, async (req, res) => {
      try {
            const video = await YouTubeVideo.findOneAndUpdate(
                  { _id: req.params.id, userId: req.userId },
                  { $set: req.body },
                  { new: true, runValidators: true }
            );

            if (!video) {
                  return res.status(404).json({ success: false, message: 'Video not found' });
            }

            res.json({ success: true, data: { video } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.delete('/:id', auth, async (req, res) => {
      try {
            const video = await YouTubeVideo.findOneAndDelete({
                  _id: req.params.id,
                  userId: req.userId
            });

            if (!video) {
                  return res.status(404).json({ success: false, message: 'Video not found' });
            }

            res.json({ success: true, message: 'Video deleted successfully' });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
