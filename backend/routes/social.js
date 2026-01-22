const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const SocialPost = require('../models/SocialPost');
const { socialPostValidation } = require('../middleware/validation');

router.get('/', auth, async (req, res) => {
      try {
            const { status, platform, limit = 50 } = req.query;
            const query = { userId: req.userId };
            if (status) query.status = status;
            if (platform) query.platforms = platform;

            const posts = await SocialPost.find(query)
                  .sort({ createdAt: -1 })
                  .limit(parseInt(limit));

            res.json({ success: true, data: { posts, count: posts.length } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.post('/', auth, socialPostValidation, async (req, res) => {
      try {
            const post = new SocialPost({
                  ...req.body,
                  userId: req.userId
            });
            await post.save();

            res.status(201).json({
                  success: true,
                  message: 'Post created successfully',
                  data: { post }
            });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.put('/:id', auth, async (req, res) => {
      try {
            const post = await SocialPost.findOneAndUpdate(
                  { _id: req.params.id, userId: req.userId },
                  { $set: req.body },
                  { new: true, runValidators: true }
            );

            if (!post) {
                  return res.status(404).json({ success: false, message: 'Post not found' });
            }

            res.json({ success: true, data: { post } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.delete('/:id', auth, async (req, res) => {
      try {
            const post = await SocialPost.findOneAndDelete({
                  _id: req.params.id,
                  userId: req.userId
            });

            if (!post) {
                  return res.status(404).json({ success: false, message: 'Post not found' });
            }

            res.json({ success: true, message: 'Post deleted successfully' });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
