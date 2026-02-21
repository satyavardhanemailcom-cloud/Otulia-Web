const authMiddleware = require("../middleware/auth.middleware");

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const CarAsset = require("../models/CarAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const Listing = require("../models/Listing.model");
const { OAuth2Client } = require("google-auth-library");
const CloudinaryStorage = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

/**
 * GOOGLE LOGIN
 */
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "TOKEN_REQUIRED" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({
      $or: [{ email }, { googleId }]
    });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
      });
    } else {
      // Link googleId to existing email user and update profile picture only if not already set
      user.googleId = user.googleId || googleId;
      if (!user.profilePicture) {
        user.profilePicture = picture;
      }
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({
      error: "GOOGLE_LOGIN_FAILED",
    });
  }
});

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "ALL_FIELDS_REQUIRED",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "EMAIL_ALREADY_EXISTS",
      });
    }

    // 'Salt' adds random characters to the password before hashing to prevent hacking
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "REGISTER_FAILED",
    });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "ALL_FIELDS_REQUIRED",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        profilePicture: user.profilePicture
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "LOGIN_FAILED",
    });
  }
});

/**
 * GET CURRENT USER
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("rentedHistory.item")
      .populate("boughtHistory.item");

    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "FETCH_USER_FAILED",
    });
  }
});

/**
 * TOGGLE FAVORITE
 */
router.post("/toggle-favorite", authMiddleware, async (req, res) => {
  try {
    const { assetId, assetModel } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const existingIndex = user.favorites.findIndex(
      (fav) => fav.assetId && fav.assetId.toString() === assetId
    );

    let action;
    if (existingIndex > -1) {
      // Remove
      user.favorites.splice(existingIndex, 1);
      action = 'removed';
    } else {
      // Add
      user.favorites.push({ assetId, assetModel });
      action = 'added';
    }

    await user.save();
    res.json({ action, favorites: user.favorites });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    res.status(500).json({ error: "TOGGLE_FAILED" });
  }
});

/**
 * GET MY LISTINGS
 */
router.get("/my-listings", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("myListings.item");
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Transform to flat array of items
    const listings = user.myListings
      .filter(entry => entry.item) // Filter out nulls if any
      .map(entry => {
        const item = entry.item.toObject();
        return {
          ...item,
          category: entry.itemModel // Ensure category is available for UI logic if needed
        };
      });

    res.json(listings);
  } catch (err) {
    console.error("Fetch My Listings Error:", err);
    res.status(500).json({ error: "FETCH_LISTINGS_FAILED" });
  }
});

/**
 * GET FAVORITES
 */
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites.assetId");
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    const favorites = user.favorites
      .filter(entry => entry.assetId) // Filter out nulls
      .map(entry => {
        const item = entry.assetId.toObject();
        return {
          ...item,
          category: entry.assetModel // Ensure category is available
        };
      });

    res.json(favorites);
  } catch (err) {
    console.error("Fetch Favorites Error:", err);
    res.status(500).json({ error: "FETCH_FAVORITES_FAILED" });
  }
});

/**
 * UPGRADE PLAN
 */
router.post("/upgrade-plan", authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ["Freemium", "Premium Basic", "Business VIP"];

    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: "INVALID_PLAN" });
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { plan, planExpiresAt: expiryDate },
      { new: true }
    ).select("-password");

    res.json({ message: "PLAN_UPGRADED_SUCCESSFULLY", user });
  } catch (err) {
    res.status(500).json({ error: "UPGRADE_FAILED" });
  }
});

/**
 * UPDATE PROFILE
 */
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, profilePicture, company } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

    // Lock certain fields if verified
    if (user.isVerified) {
      if (name && name !== user.name) return res.status(403).json({ error: "VERIFIED_NAME_LOCKED" });
      if (phone && phone !== user.phone) return res.status(403).json({ error: "VERIFIED_PHONE_LOCKED" });
      
      if (company) {
        if (company.companyName && company.companyName !== user.company?.companyName) 
          return res.status(403).json({ error: "VERIFIED_COMPANY_NAME_LOCKED" });
        if (company.address && company.address !== user.company?.address) 
          return res.status(403).json({ error: "VERIFIED_ADDRESS_LOCKED" });
      }
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;
    
    if (company) {
      user.company = {
        ...user.company,
        ...company
      };
    }

    await user.save();

    res.json({ message: "PROFILE_UPDATED_SUCCESSFULLY", user });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "UPDATE_FAILED" });
  }
});

/**
 * SUBMIT VERIFICATION DOCUMENTS
 */

const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: `users/${req.user.email}`,
      public_id: `profile_pic_${Date.now()}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const uploadProfilePic = multer({ storage: profilePicStorage });

router.post("/upload-profile-picture", authMiddleware, uploadProfilePic.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE_UPLOADED" });
    }

    // Delete old profile picture from Cloudinary
    const currentUser = await User.findById(req.user.id);
    if (currentUser.profilePicturePublicId) {
      cloudinary.uploader.destroy(currentUser.profilePicturePublicId, (error, result) => {
        if (error) {
          console.error("Failed to delete old profile picture from Cloudinary:", error);
        }
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        profilePicture: req.file.path,
        profilePicturePublicId: req.file.filename 
      },
      { new: true }
    ).select("-password");

    res.json({ message: "PROFILE_PICTURE_UPDATED_SUCCESSFULLY", user });
  } catch (err) {
    console.error("Profile Picture Upload Error:", err);
    res.status(500).json({ error: "UPLOAD_FAILED" });
  }
});

/**
 * UPLOAD COMPANY LOGO
 */
const companyLogoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: `users/${req.user.email}`,
      public_id: `company_logo_${Date.now()}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg'],
    };
  },
});

const uploadCompanyLogo = multer({ storage: companyLogoStorage });

router.post("/upload-company-logo", authMiddleware, uploadCompanyLogo.single('companyLogo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE_UPLOADED" });
    }

    const currentUser = await User.findById(req.user.id);
    
    // Check if verified - lock update
    if (currentUser.isVerified) {
      return res.status(403).json({ error: "VERIFIED_USER_CANNOT_CHANGE_LOGO" });
    }

    // Delete old company logo if exists
    if (currentUser.company && currentUser.company.companyLogo) {
      // We need to extract public_id if we don't store it explicitly for company logo
      // For now, let's assume we might need a publicId field or parse it from URL
      // If we don't have it, we'll just skip deletion for now to be safe or try to parse
      // But standard practice is storing it. 
      // Existing code for profile pic used 'profilePicturePublicId'.
      // Let's assume we'll just update the URL for now, or if you want I can add a field.
      // Given user instructions, I'll just focus on updating.
    }

    const logoUrl = req.file.path;

    // Update User Model
    currentUser.company = {
      ...currentUser.company,
      companyLogo: logoUrl
    };
    await currentUser.save();

    // Update ALL assets created by this user
    const agentId = currentUser._id.toString();
    const updateQuery = { "agent.id": agentId };
    const updateData = { $set: { "agent.companyLogo": logoUrl } };

    await Promise.all([
      CarAsset.updateMany(updateQuery, updateData),
      BikeAsset.updateMany(updateQuery, updateData),
      YachtAsset.updateMany(updateQuery, updateData),
      EstateAsset.updateMany(updateQuery, updateData),
      Listing.updateMany(updateQuery, updateData)
    ]);

    res.json({ 
      message: "COMPANY_LOGO_UPDATED_SUCCESSFULLY", 
      companyLogo: logoUrl,
      user: currentUser 
    });
  } catch (err) {
    console.error("Company Logo Upload Error:", err);
    res.status(500).json({ error: "UPLOAD_FAILED" });
  }
});

const verificationStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (!req.user || !req.user.email) {
      throw new Error('User authentication is required to upload verification documents.');
    }

    const fileExtension = path.extname(file.originalname).substring(1);
    
    return {
      folder: `verification/${req.user.email}`,
      public_id: `${file.fieldname}-${Date.now()}`,
      resource_type: 'auto', // Let cloudinary detect the resource type
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
      format: fileExtension, // Explicitly set the format as a hint
    };
  },
});

const uploadVerification = multer({ storage: verificationStorage });

const clearVerificationFolder = async (req, res, next) => {
  if (req.user && req.user.email) {
    const folder = `verification/${req.user.email}`;
    try {
      // We need to delete both image and raw files (for PDFs)
      await Promise.all([
        cloudinary.api.delete_resources_by_prefix(folder, { resource_type: 'image', invalidate: true }),
        cloudinary.api.delete_resources_by_prefix(folder, { resource_type: 'raw', invalidate: true })
      ]);
    } catch (error) {
      console.error(`Failed to clear Cloudinary folder ${folder}. This might leave orphaned files. Error:`, error);
      // We won't block the request, but this is a situation to monitor.
    }
  }
  next();
};
router.post("/submit-verification", authMiddleware, clearVerificationFolder, uploadVerification.any(), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "NO_FILES_UPLOADED" });
    }

    const verificationDocuments = {};
    files.forEach(file => {
      // For Cloudinary, 'file.filename' contains the public_id
      verificationDocuments[file.fieldname] = file.filename;
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        verificationStatus: "Pending",
        // Overwrite the documents with the new submission
        verificationDocuments: verificationDocuments
      },
      { new: true }
    ).select("-password");

    // 1. Notify User (In-app)
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                notifications: {
                    type: "VERIFICATION_PENDING",
                    message: "Your verification documents have been received and are under review.",
                    targetTab: "settings",
                    createdAt: new Date()
                }
            }
        });
    } catch (userNotifError) {
        console.error("Failed to notify user in-app:", userNotifError);
    }

    // 2. Notify User (Email)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verification Documents Received - Otulia",
            text: `Hi ${user.name},

We have received your dealer verification documents. Our team will review them within 24-48 hours. 

You will receive another notification once the review is complete.

Best regards,
The Otulia Team`,
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) console.error("User Verification Receipt Email Error:", error);
        });
    }

    // 3. Notify Admins
    try {
        const admins = await User.find({ role: 'admin' });
        
        // 1. In-app notifications
        await User.updateMany(
            { role: 'admin' },
            {
                $push: {
                    notifications: {
                        type: "VERIFICATION_SUBMITTED",
                        message: `New verification request from ${user.name}`,
                        targetTab: "partners",
                        createdAt: new Date()
                    }
                }
            }
        );

        // 2. Email notifications
        const adminDashboardLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            subject: `New Verification Request: ${user.name}`,
            text: `A new dealer verification request has been submitted.

User Details:
Name: ${user.name}
Email: ${user.email}

Review documents in the admin dashboard: ${adminDashboardLink}`,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            for (const admin of admins) {
                transporter.sendMail({ ...mailOptions, to: admin.email }, (error, info) => {
                    if (error) console.error(`Admin Notification Email Error (${admin.email}):`, error);
                });
            }
        }
    } catch (adminNotifError) {
        console.error("Failed to notify admins:", adminNotifError);
    }

    res.json(user);
  } catch (err) {
    console.error("Verification Submit Error:", err);
    res.status(500).json({ error: "SUBMISSION_FAILED", details: err.message });
  }
});

module.exports = router;
