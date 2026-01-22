const mongoose = require('mongoose');

const socialPostSchema = new mongoose.Schema({
      // ===================================
      // POST OWNERSHIP
      // ===================================
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
      },

      // ===================================
      // CONTENT
      // ===================================
      content: {
            text: {
                  type: String,
                  required: [true, 'Post content is required'],
                  maxlength: [5000, 'Content cannot exceed 5000 characters']
            },
            hashtags: [{
                  type: String,
                  trim: true
            }],
            mentions: [{
                  type: String,
                  trim: true
            }],
            media: [{
                  type: {
                        type: String,
                        enum: ['image', 'video', 'gif'],
                        required: true
                  },
                  url: {
                        type: String,
                        required: true
                  },
                  alt: String,
                  thumbnail: String
            }]
      },

      // ===================================
      // PLATFORMS
      // ===================================
      platforms: [{
            type: String,
            enum: ['youtube', 'linkedin', 'twitter', 'instagram'],
            required: true
      }],

      // Platform-specific content variants
      platformVariants: {
            youtube: {
                  text: String,
                  hashtags: [String]
            },
            linkedin: {
                  text: String,
                  hashtags: [String]
            },
            twitter: {
                  text: String,
                  hashtags: [String]
            },
            instagram: {
                  text: String,
                  hashtags: [String]
            }
      },

      // ===================================
      // SCHEDULING
      // ===================================
      status: {
            type: String,
            enum: ['draft', 'scheduled', 'publishing', 'published', 'failed'],
            default: 'draft',
            index: true
      },
      scheduledFor: {
            type: Date,
            index: true
      },
      publishedAt: {
            type: Date
      },

      // ===================================
      // AI FEATURES
      // ===================================
      aiGenerated: {
            caption: { type: Boolean, default: false },
            hashtags: { type: Boolean, default: false },
            bestTime: { type: Boolean, default: false }
      },

      // A/B Testing
      abTesting: {
            enabled: { type: Boolean, default: false },
            variants: [{
                  name: String,
                  content: String,
                  hashtags: [String],
                  impressions: { type: Number, default: 0 },
                  engagements: { type: Number, default: 0 }
            }],
            winner: String
      },

      // Language
      language: {
            type: String,
            enum: ['en', 'hi', 'en-hi'],
            default: 'en'
      },

      // ===================================
      // ANALYTICS
      // ===================================
      analytics: {
            youtube: {
                  postId: String,
                  views: { type: Number, default: 0 },
                  likes: { type: Number, default: 0 },
                  comments: { type: Number, default: 0 },
                  shares: { type: Number, default: 0 }
            },
            linkedin: {
                  postId: String,
                  impressions: { type: Number, default: 0 },
                  clicks: { type: Number, default: 0 },
                  reactions: { type: Number, default: 0 },
                  comments: { type: Number, default: 0 },
                  shares: { type: Number, default: 0 }
            },
            twitter: {
                  tweetId: String,
                  impressions: { type: Number, default: 0 },
                  retweets: { type: Number, default: 0 },
                  likes: { type: Number, default: 0 },
                  replies: { type: Number, default: 0 }
            },
            instagram: {
                  postId: String,
                  impressions: { type: Number, default: 0 },
                  reach: { type: Number, default: 0 },
                  likes: { type: Number, default: 0 },
                  comments: { type: Number, default: 0 },
                  saves: { type: Number, default: 0 }
            }
      },

      // Aggregated metrics
      totalEngagement: {
            type: Number,
            default: 0
      },
      engagementRate: {
            type: Number,
            default: 0
      },

      // ===================================
      // METADATA
      // ===================================
      category: {
            type: String,
            trim: true
      },
      tags: [{
            type: String,
            trim: true
      }],
      notes: {
            type: String,
            maxlength: 1000
      }
}, {
      timestamps: true
});

// ===================================
// INDEXES
// ===================================
socialPostSchema.index({ userId: 1, status: 1 });
socialPostSchema.index({ scheduledFor: 1 });
socialPostSchema.index({ createdAt: -1 });

// ===================================
// METHODS
// ===================================
socialPostSchema.methods.calculateEngagement = function () {
      let total = 0;

      // Sum up all engagement metrics
      Object.values(this.analytics).forEach(platform => {
            if (platform.likes) total += platform.likes;
            if (platform.comments) total += platform.comments;
            if (platform.shares) total += platform.shares;
            if (platform.reactions) total += platform.reactions;
            if (platform.retweets) total += platform.retweets;
            if (platform.saves) total += platform.saves;
      });

      this.totalEngagement = total;
      return total;
};

socialPostSchema.methods.calculateEngagementRate = function () {
      const totalImpressions =
            (this.analytics.youtube?.views || 0) +
            (this.analytics.linkedin?.impressions || 0) +
            (this.analytics.twitter?.impressions || 0) +
            (this.analytics.instagram?.impressions || 0);

      if (totalImpressions > 0) {
            this.engagementRate = (this.totalEngagement / totalImpressions) * 100;
      }

      return this.engagementRate;
};

module.exports = mongoose.model('SocialPost', socialPostSchema);
