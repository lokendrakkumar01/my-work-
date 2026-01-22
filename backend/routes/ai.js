const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const aiService = require('../services/ai.service');

/**
 * @route   POST /api/ai/generate-caption
 * @desc    Generate AI caption for social media
 * @access  Private
 */
router.post('/generate-caption', auth, async (req, res) => {
      try {
            const { context, platform, language = 'en', tone = 'professional' } = req.body;

            if (!context || !platform) {
                  return res.status(400).json({
                        success: false,
                        message: 'Context and platform are required'
                  });
            }

            const caption = await aiService.generateCaption(context, platform, language, tone);

            res.json({
                  success: true,
                  data: {
                        caption,
                        platform,
                        language
                  }
            });
      } catch (error) {
            console.error('Caption generation error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to generate caption',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/ai/generate-script
 * @desc    Generate YouTube script
 * @access  Private
 */
router.post('/generate-script', auth, async (req, res) => {
      try {
            const { topic, duration = 10, style = 'educational' } = req.body;

            if (!topic) {
                  return res.status(400).json({
                        success: false,
                        message: 'Topic is required'
                  });
            }

            const script = await aiService.generateYouTubeScript(topic, duration, style);

            res.json({
                  success: true,
                  data: {
                        script,
                        topic,
                        duration,
                        style
                  }
            });
      } catch (error) {
            console.error('Script generation error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to generate script',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/ai/content-ideas
 * @desc    Generate content ideas
 * @access  Private
 */
router.post('/content-ideas', auth, async (req, res) => {
      try {
            const { niche, platform, count = 10 } = req.body;

            if (!niche || !platform) {
                  return res.status(400).json({
                        success: false,
                        message: 'Niche and platform are required'
                  });
            }

            const ideas = await aiService.generateContentIdeas(niche, platform, count);

            res.json({
                  success: true,
                  data: {
                        ideas,
                        niche,
                        platform,
                        count
                  }
            });
      } catch (error) {
            console.error('Ideas generation error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to generate ideas',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/ai/hashtags
 * @desc    Generate hashtags
 * @access  Private
 */
router.post('/hashtags', auth, async (req, res) => {
      try {
            const { content, platform, count = 20 } = req.body;

            if (!content || !platform) {
                  return res.status(400).json({
                        success: false,
                        message: 'Content and platform are required'
                  });
            }

            const hashtags = await aiService.generateHashtags(content, platform, count);

            res.json({
                  success: true,
                  data: {
                        hashtags,
                        platform
                  }
            });
      } catch (error) {
            console.error('Hashtags generation error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to generate hashtags',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/ai/productivity-plan
 * @desc    Generate productivity plan
 * @access  Private
 */
router.post('/productivity-plan', auth, async (req, res) => {
      try {
            const { goals, timeframe = 'week' } = req.body;

            if (!goals) {
                  return res.status(400).json({
                        success: false,
                        message: 'Goals are required'
                  });
            }

            const plan = await aiService.generateProductivityPlan(goals, timeframe);

            res.json({
                  success: true,
                  data: {
                        plan,
                        timeframe
                  }
            });
      } catch (error) {
            console.error('Plan generation error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to generate plan',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/ai/analyze
 * @desc    Analyze performance data
 * @access  Private
 */
router.post('/analyze', auth, async (req, res) => {
      try {
            const { data } = req.body;

            if (!data) {
                  return res.status(400).json({
                        success: false,
                        message: 'Data is required'
                  });
            }

            const analysis = await aiService.analyzePerformance(data);

            res.json({
                  success: true,
                  data: {
                        analysis
                  }
            });
      } catch (error) {
            console.error('Analysis error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to analyze data',
                  error: error.message
            });
      }
});

/**
 * @route   POST /api/ai/learning-roadmap
 * @desc    Generate learning roadmap
 * @access  Private
 */
router.post('/learning-roadmap', auth, async (req, res) => {
      try {
            const { skill, currentLevel = 'beginner', duration = '3 months' } = req.body;

            if (!skill) {
                  return res.status(400).json({
                        success: false,
                        message: 'Skill is required'
                  });
            }

            const roadmap = await aiService.generateLearningRoadmap(skill, currentLevel, duration);

            res.json({
                  success: true,
                  data: {
                        roadmap,
                        skill,
                        currentLevel,
                        duration
                  }
            });
      } catch (error) {
            console.error('Roadmap generation error:', error);
            res.status(500).json({
                  success: false,
                  message: 'Failed to generate roadmap',
                  error: error.message
            });
      }
});

module.exports = router;
