const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
      },

      title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
      },

      description: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters']
      },

      priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
            index: true
      },

      status: {
            type: String,
            enum: ['todo', 'in-progress', 'completed', 'cancelled'],
            default: 'todo',
            index: true
      },

      dueDate: {
            type: Date,
            index: true
      },

      reminderAt: Date,

      completedAt: Date,

      // Recurring task configuration
      recurring: {
            enabled: { type: Boolean, default: false },
            frequency: {
                  type: String,
                  enum: ['daily', 'weekly', 'monthly', 'yearly']
            },
            interval: { type: Number, default: 1 },
            daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0 = Sunday
            endDate: Date
      },

      // Project association
      projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
      },

      // Time tracking
      timeTracking: {
            estimated: { type: Number, default: 0 }, // in minutes
            actual: { type: Number, default: 0 },
            sessions: [{
                  startTime: Date,
                  endTime: Date,
                  duration: Number
            }]
      },

      // Categories and tags
      category: String,
      tags: [String],

      // Subtasks
      subtasks: [{
            title: String,
            completed: { type: Boolean, default: false }
      }]
}, {
      timestamps: true
});

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
