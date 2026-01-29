// server/routes/upload.js
const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // Import from step 3

// 'file' is the key name you must use in your frontend form-data
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Cloudinary returns the URL in req.file.path
  res.json({
    url: req.file.path,
    public_id: req.file.filename,
    format: req.file.format
  });
});

module.exports = router;