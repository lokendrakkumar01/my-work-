const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
      },

      name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters']
      },

      description: {
            type: String,
            maxlength: [2000, 'Description cannot exceed 2000 characters']
      },

      status: {
            type: String,
            enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
            default: 'planning',
            index: true
      },

      techStack: [{
            name: String,
            version: String,
            category: String // frontend, backend, database, etc.
      }],

      architecture: {
            notes: String,
            diagrams: [String] // URLs to diagram images
      },

      milestones: [{
            title: String,
            description: String,
            dueDate: Date,
            completedAt: Date,
            status: {
                  type: String,
                  enum: ['pending', 'in-progress', 'completed'],
                  default: 'pending'
            }
      }],

      sprints: [{
            name: String,
            startDate: Date,
            endDate: Date,
            goals: [String],
            status: {
                  type: String,
                  enum: ['planning', 'active', 'completed'],
                  default: 'planning'
            }
      }],

      timeline: {
            startDate: Date,
            targetEndDate: Date,
            actualEndDate: Date
      },

      dependencies: [{
            type: String
      }],

      files: [{
            name: String,
            url: String,
            type: String,
            size: Number,
            uploadedAt: { type: Date, default: Date.now }
      }],

      documentation: {
            readme: String,
            apiDocs: String,
            setupGuide: String,
            deploymentGuide: String
      },

      progress: {
            percentage: { type: Number, default: 0, min: 0, max: 100 },
            tasksCompleted: { type: Number, default: 0 },
            tasksTotal: { type: Number, default: 0 }
      },

      links: {
            repository: String,
            liveDemo: String,
            documentation: String
      },

      tags: [String],
      category: String
}, {
      timestamps: true
});

projectSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
