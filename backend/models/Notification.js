const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
      },

      type: {
            type: String,
            enum: [
                  'task_reminder',
                  'task_overdue',
                  'social_post_scheduled',
                  'analytics_milestone',
                  'productivity_alert',
                  'burnout_warning',
                  'opportunity_alert',
                  'system'
            ],
            required: true,
            index: true
      },

      priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
      },

      title: {
            type: String,
            required: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
      },

      message: {
            type: String,
            required: true,
            maxlength: [1000, 'Message cannot exceed 1000 characters']
      },

      status: {
            type: String,
            enum: ['unread', 'read', 'archived'],
            default: 'unread',
            index: true
      },

      actionUrl: String,

      metadata: mongoose.Schema.Types.Mixed,

      readAt: Date
}, {
      timestamps: true
});

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
