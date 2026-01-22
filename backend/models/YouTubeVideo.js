const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
      // ===================================
      // OWNERSHIP
      // ===================================
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
      },

      // ===================================
      // VIDEO WORKFLOW STAGES
      // ===================================
      stage: {
            type: String,
            enum: ['idea', 'script', 'recording', 'editing', 'optimizing', 'publishing', 'published'],
            default: 'idea',
            index: true
      },

      // ===================================
      // IDEA PHASE
      // ===================================
      idea: {
            title: {
                  type: String,
                  required: [true, 'Video title is required'],
                  trim: true,
                  maxlength: [200, 'Title cannot exceed 200 characters']
            },
            description: {
                  type: String,
                  maxlength: [2000, 'Description cannot exceed 2000 characters']
            },
            category: {
                  type: String,
                  trim: true
            },
            tags: [{
                  type: String,
                  trim: true
            }],
            priority: {
                  type: String,
                  enum: ['low', 'medium', 'high', 'urgent'],
                  default: 'medium'
            },
            targetDate: Date,
            aiSuggested: {
                  type: Boolean,
                  default: false
            },
            trendScore: {
                  type: Number,
                  min: 0,
                  max: 100
            }
      },

      // ===================================
      // SCRIPT PHASE
      // ===================================
      script: {
            fullScript: {
                  type: String,
                  maxlength: [50000, 'Script cannot exceed 50000 characters']
            },
            hook: {
                  type: String,
                  maxlength: [500, 'Hook cannot exceed 500 characters']
            },
            chapters: [{
                  timestamp: String,
                  title: String,
                  content: String
            }],
            callToAction: {
                  type: String,
                  maxlength: [500, 'CTA cannot exceed 500 characters']
            },
            wordCount: Number,
            estimatedDuration: Number, // in minutes
            aiGenerated: {
                  type: Boolean,
                  default: false
            }
      },

      // ===================================
      // SEO & OPTIMIZATION
      // ===================================
      seo: {
            optimizedTitle: {
                  type: String,
                  maxlength: [100, 'Optimized title cannot exceed 100 characters']
            },
            description: {
                  type: String,
                  maxlength: [5000, 'Description cannot exceed 5000 characters']
            },
            tags: [{
                  type: String,
                  trim: true
            }],
            keywords: [{
                  type: String,
                  trim: true
            }],
            seoScore: {
                  type: Number,
                  min: 0,
                  max: 100
            }
      },

      // ===================================
      // THUMBNAIL
      // ===================================
      thumbnail: {
            concepts: [{
                  description: String,
                  imageUrl: String,
                  selected: { type: Boolean, default: false }
            }],
            checklist: {
                  highContrast: { type: Boolean, default: false },
                  clearText: { type: Boolean, default: false },
                  emotionalExpression: { type: Boolean, default: false },
                  brandColors: { type: Boolean, default: false },
                  testMultipleVersions: { type: Boolean, default: false }
            }
      },

      // ===================================
      // PUBLISHING
      // ===================================
      publishing: {
            scheduledFor: Date,
            visibility: {
                  type: String,
                  enum: ['public', 'unlisted', 'private'],
                  default: 'public'
            },
            madeForKids: {
                  type: Boolean,
                  default: false
            },
            ageRestriction: {
                  type: Boolean,
                  default: false
            },
            monetization: {
                  enabled: { type: Boolean, default: true },
                  adTypes: [String]
            }
      },

      // ===================================
      // YOUTUBE DATA
      // ===================================
      youtube: {
            videoId: String,
            url: String,
            uploadedAt: Date
      },

      // ===================================
      // ANALYTICS
      // ===================================
      analytics: {
            views: {
                  type: Number,
                  default: 0
            },
            watchTimeHours: {
                  type: Number,
                  default: 0
            },
            averageViewDuration: {
                  type: Number,
                  default: 0
            },
            ctr: {
                  type: Number,
                  default: 0
            },
            impressions: {
                  type: Number,
                  default: 0
            },
            likes: {
                  type: Number,
                  default: 0
            },
            dislikes: {
                  type: Number,
                  default: 0
            },
            comments: {
                  type: Number,
                  default: 0
            },
            shares: {
                  type: Number,
                  default: 0
            },
            subscribersGained: {
                  type: Number,
                  default: 0
            },
            subscribersLost: {
                  type: Number,
                  default: 0
            },
            retentionCurve: [{
                  time: Number,
                  percentage: Number
            }],
            revenue: {
                  estimated: { type: Number, default: 0 },
                  currency: { type: String, default: 'USD' }
            }
      },

      // Performance predictions
      predictions: {
            estimatedViews: Number,
            estimatedCtr: Number,
            estimatedRevenue: Number,
            confidenceScore: Number
      },

      // ===================================
      // METADATA
      // ===================================
      notes: {
            type: String,
            maxlength: [2000, 'Notes cannot exceed 2000 characters']
      },
      status: {
            type: String,
            enum: ['active', 'archived', 'deleted'],
            default: 'active'
      }
}, {
      timestamps: true
});

// ===================================
// INDEXES
// ===================================
youtubeVideoSchema.index({ userId: 1, stage: 1 });
youtubeVideoSchema.index({ 'idea.priority': 1 });
youtubeVideoSchema.index({ createdAt: -1 });
youtubeVideoSchema.index({ 'youtube.videoId': 1 });

// ===================================
// METHODS
// ===================================
youtubeVideoSchema.methods.calculateSEOScore = function () {
      let score = 0;

      // Title optimization (0-25 points)
      if (this.seo.optimizedTitle) {
            const titleLength = this.seo.optimizedTitle.length;
            if (titleLength >= 40 && titleLength <= 70) score += 25;
            else if (titleLength >= 30 && titleLength <= 80) score += 15;
            else score += 5;
      }

      // Description optimization (0-25 points)
      if (this.seo.description) {
            const descLength = this.seo.description.length;
            if (descLength >= 200) score += 25;
            else if (descLength >= 100) score += 15;
            else score += 5;
      }

      // Tags (0-25 points)
      if (this.seo.tags && this.seo.tags.length > 0) {
            if (this.seo.tags.length >= 15) score += 25;
            else if (this.seo.tags.length >= 10) score += 15;
            else score += 10;
      }

      // Keywords (0-25 points)
      if (this.seo.keywords && this.seo.keywords.length > 0) {
            if (this.seo.keywords.length >= 5) score += 25;
            else if (this.seo.keywords.length >= 3) score += 15;
            else score += 10;
      }

      this.seo.seoScore = Math.min(score, 100);
      return this.seo.seoScore;
};

youtubeVideoSchema.methods.estimatePerformance = function () {
      // Simple performance estimation based on historical data
      // In production, this would use ML models
      const baseViews = 1000;
      const priorityMultiplier = {
            'low': 0.5,
            'medium': 1,
            'high': 1.5,
            'urgent': 2
      };

      const trendMultiplier = (this.idea.trendScore || 50) / 50;
      const seoMultiplier = (this.seo.seoScore || 50) / 50;

      this.predictions.estimatedViews = Math.round(
            baseViews *
            priorityMultiplier[this.idea.priority] *
            trendMultiplier *
            seoMultiplier
      );

      this.predictions.estimatedCtr = 5 + (this.seo.seoScore || 50) / 20;
      this.predictions.estimatedRevenue = this.predictions.estimatedViews * 0.002; // $2 CPM
      this.predictions.confidenceScore = 60;

      return this.predictions;
};

module.exports = mongoose.model('YouTubeVideo', youtubeVideoSchema);
