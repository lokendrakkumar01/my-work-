const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/'),
      filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
});

const upload = multer({
      storage,
      limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mov|avi/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);
            if (mimetype && extname) return cb(null, true);
            cb(new Error('Invalid file type'));
      }
});

router.post('/upload', auth, upload.single('file'), (req, res) => {
      try {
            if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

            res.json({
                  success: true,
                  data: {
                        filename: req.file.filename,
                        originalName: req.file.originalname,
                        size: req.file.size,
                        url: `/uploads/${req.file.filename}`
                  }
            });
      } catch (error) {
            res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
