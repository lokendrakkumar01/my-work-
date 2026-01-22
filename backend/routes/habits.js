const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Habit = require('../models/Habit');

router.get('/', auth, async (req, res) => {
      try {
            const habits = await Habit.find({ userId: req.userId, isActive: true });
            res.json({ success: true, data: { habits } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.post('/', auth, async (req, res) => {
      try {
            const habit = new Habit({ ...req.body, userId: req.userId });
            await habit.save();
            res.status(201).json({ success: true, data: { habit } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.post('/:id/complete', auth, async (req, res) => {
      try {
            const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
            if (!habit) return res.status(404).json({ success: false, message: 'Habit not found' });

            habit.completions.push({ date: new Date(), note: req.body.note });
            habit.currentStreak += 1;
            if (habit.currentStreak > habit.longestStreak) {
                  habit.longestStreak = habit.currentStreak;
            }
            await habit.save();

            res.json({ success: true, data: { habit } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.delete('/:id', auth, async (req, res) => {
      try {
            const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
            if (!habit) return res.status(404).json({ success: false, message: 'Habit not found' });
            res.json({ success: true, message: 'Habit deleted successfully' });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
