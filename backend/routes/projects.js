const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Project = require('../models/Project');

router.get('/', auth, async (req, res) => {
      try {
            const { status } = req.query;
            const query = { userId: req.userId };
            if (status) query.status = status;

            const projects = await Project.find(query).sort({ createdAt: -1 });
            res.json({ success: true, data: { projects } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.post('/', auth, async (req, res) => {
      try {
            const project = new Project({ ...req.body, userId: req.userId });
            await project.save();
            res.status(201).json({ success: true, data: { project } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.get('/:id', auth, async (req, res) => {
      try {
            const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
            if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
            res.json({ success: true, data: { project } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.put('/:id', auth, async (req, res) => {
      try {
            const project = await Project.findOneAndUpdate(
                  { _id: req.params.id, userId: req.userId },
                  { $set: req.body },
                  { new: true }
            );
            if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
            res.json({ success: true, data: { project } });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

router.delete('/:id', auth, async (req, res) => {
      try {
            const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
            if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
            res.json({ success: true, message: 'Project deleted successfully' });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
