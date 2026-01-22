const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const SocialPost = require('../models/SocialPost');
const YouTubeVideo = require('../models/YouTubeVideo');
const Task = require('../models/Task');

router.get('/dashboard', auth, async (req, res) => {
      try {
            const [totalPosts, totalVideos, totalTasks, completedTasks] = await Promise.all([
                  SocialPost.countDocuments({ userId: req.userId }),
                  YouTubeVideo.countDocuments({ userId: req.userId }),
                  Task.countDocuments({ userId: req.userId }),
                  Task.countDocuments({ userId: req.userId, status: 'completed' })
            ]);

            const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            res.json({
                  success: true,
                  data: {
                        totalPosts,
                        totalVideos,
                        totalTasks,
                        completedTasks,
                        productivityScore
                  }
            });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
