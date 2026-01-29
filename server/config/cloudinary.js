// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage Settings
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'otulia_assets', // The folder name in your Cloudinary console
    resource_type: 'auto',   // Allows uploading images, pdfs, and docs
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'docs', 'docx'],
  },
});

// 3. Initialize Multer
const upload = multer({ storage });

module.exports = { upload, cloudinary };