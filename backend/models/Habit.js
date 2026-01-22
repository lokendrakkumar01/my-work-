const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
      },

      name: {
            type: String,
            required: [true, 'Habit name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters']
      },

      description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters']
      },

      frequency: {
            type: String,
            enum: ['daily', 'weekly', 'custom'],
            default: 'daily'
      },

      targetDays: [{ type: Number, min: 0, max: 6 }], // For weekly habits

      currentStreak: {
            type: Number,
            default: 0
      },

      longestStreak: {
            type: Number,
            default: 0
      },

      completions: [{
            date: { type: Date, required: true },
            note: String
      }],

      isActive: {
            type: Boolean,
            default: true
      }
}, {
      timestamps: true
});

habitSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Habit', habitSchema);
