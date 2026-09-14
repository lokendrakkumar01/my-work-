const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Task = require('../models/Task');

router.get('/', auth, async (req, res) => {
      try {
            const { status, priority } = req.query;
            const query = { userId: req.userId };
            if (status) query.status = status;
            if (priority) query.priority = priority;

            const tasks = await Task.find(query).sort({ dueDate: 1, priority: -1 });
            res.json({ success: true, data: { tasks, count: tasks.length } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.post('/', auth, async (req, res) => {
      try {
            const body = { ...req.body };
            if (body.status === 'pending') body.status = 'todo';
            if (!body.dueDate) delete body.dueDate;
            const task = new Task({ ...body, userId: req.userId });
            await task.save();
            res.status(201).json({ success: true, data: { task } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.put('/:id', auth, async (req, res) => {
      try {
            const body = { ...req.body };
            if (body.status === 'pending') body.status = 'todo';
            if (body.dueDate === '') delete body.dueDate;
            if (body.status === 'completed') {
                  body.completedAt = new Date();
            } else if (body.status && body.status !== 'completed') {
                  body.completedAt = null;
            }
            const task = await Task.findOneAndUpdate(
                  { _id: req.params.id, userId: req.userId },
                  { $set: body },
                  { new: true }
            );
            if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
            res.json({ success: true, data: { task } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.delete('/:id', auth, async (req, res) => {
      try {
            const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
            if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
            res.json({ success: true, message: 'Task deleted successfully' });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
