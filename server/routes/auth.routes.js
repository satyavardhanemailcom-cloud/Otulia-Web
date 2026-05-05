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
const  { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');
const { getFolderPaths } = require('../config/cloudinaryFolders');
const { updateUserAssetsAgent } = require('../utils/assetUpdater');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

/**
 * Helper to extract public_id from Cloudinary URL
 */
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    try {
        const parts = url.split('/');
        const fileNameWithExtension = parts[parts.length - 1];
        const fileName = fileNameWithExtension.split('.')[0];
        
        // Find the index of 'verification' or 'users' to get the full path
        const folderIndex = parts.findIndex(p => p === 'verification' || p === 'users' || p === 'otulia_assets');
        if (folderIndex !== -1) {
            const folderPath = parts.slice(folderIndex, parts.length - 1).join('/');
            return `${folderPath}/${fileName}`;
        }
        return fileName;
    } catch (err) {
        console.error("Error parsing Cloudinary URL:", err);
        return null;
    }
};

/**
 * GOOGLE LOGIN
 */
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    console.log("[Google Login] Request received. idToken present:", !!idToken);

    if (!idToken) {
      console.warn("[Google Login] No idToken provided in request body.");
      return res.status(400).json({ error: "TOKEN_REQUIRED" });
    }

    console.log("[Google Login] Verifying idToken with Google. Client ID:", process.env.GOOGLE_CLIENT_ID);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log("[Google Login] Token verified successfully.");
    } catch (verifyErr) {
      console.error("[Google Login] Token verification FAILED:", verifyErr.message);
      console.error("[Google Login] Full verify error:", verifyErr);
      return res.status(401).json({ error: "INVALID_GOOGLE_TOKEN" });
    }

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    console.log(`[Google Login] Token payload — email: ${email}, googleId: ${googleId}`);

    let user = await User.findOne({
      $or: [{ email }, { googleId }]
    });

    if (!user) {
      console.log(`[Google Login] No existing user found for ${email}. Creating new user.`);
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
      });
      console.log(`[Google Login] New user created — id: ${user._id}, email: ${user.email}`);
    } else {
      console.log(`[Google Login] Existing user found — id: ${user._id}, email: ${user.email}, role: ${user.role}`);
      const wasLinked = !user.googleId;
      user.googleId = user.googleId || googleId;
      if (!user.profilePicture) {
        user.profilePicture = picture;
      }
      await user.save();
      if (wasLinked) {
        console.log(`[Google Login] Linked Google account to existing email user: ${email}`);
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`[Google Login] JWT issued for user: ${user.email} (role: ${user.role})`);
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
    console.error("[Google Login] Unexpected error:", err.message);
    console.error("[Google Login] Stack:", err.stack);
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
    console.log(`[Login] Attempt for email: ${email}`);

    if (!email || !password) {
      console.warn("[Login] Missing email or password in request body.");
      return res.status(400).json({
        error: "ALL_FIELDS_REQUIRED",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`[Login] No user found for email: ${email}`);
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
      });
    }

    console.log(`[Login] User found — id: ${user._id}, role: ${user.role}, hasPassword: ${!!user.password}, hasGoogleId: ${!!user.googleId}`);

    if (!user.password) {
      console.warn(`[Login] User ${email} has no password — account was created via Google OAuth. Cannot use email/password login.`);
      return res.status(401).json({
        error: "GOOGLE_ACCOUNT_NO_PASSWORD",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[Login] Password mismatch for user: ${email}`);
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`[Login] Success for user: ${email} (role: ${user.role})`);
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
    console.error(`[Login] Unexpected error:`, err.message);
    console.error(`[Login] Stack:`, err.stack);
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
        // Simplify category name (e.g., CarAsset -> Car)
        let simplifiedCategory = entry.itemModel;
        if (simplifiedCategory.endsWith('Asset')) {
          simplifiedCategory = simplifiedCategory.replace('Asset', '');
        }
        if (simplifiedCategory === 'Estate') simplifiedCategory = 'Estate'; // Already correct

        return {
          ...item,
          itemModel: entry.itemModel,
          category: simplifiedCategory
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
        let simplifiedCategory = entry.assetModel;
        if (simplifiedCategory.endsWith('Asset')) {
          simplifiedCategory = simplifiedCategory.replace('Asset', '');
        }

        return {
          ...item,
          assetModel: entry.assetModel,
          category: simplifiedCategory
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

    // Auto-verify Premium Basic users (Skipping manual verification process)
    const updateData = { plan, planExpiresAt: expiryDate };
    if (plan === 'Premium Basic') {
      updateData.isVerified = true;
      updateData.verificationStatus = 'Verified';
      // If user is a standard user, upgrade to agent role as verified
      // (This matches the admin approval logic)
    }

    /* Original non-auto-verify logic preserved for future revert
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { plan, planExpiresAt: expiryDate },
      { new: true }
    ).select("-password");
    */

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    // Also update role if they just became verified
    if (plan === 'Premium Basic' && user.role === 'user') {
      user.role = 'agent';
      await user.save();
    }

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
    const { name, phone, whatsapp, jobTitle, language, timezone, preferredContact, agentDescription, social, profilePicture, company } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (whatsapp) user.whatsapp = whatsapp;
    if (jobTitle) user.jobTitle = jobTitle;
    if (language) user.language = language;
    if (timezone) user.timezone = timezone;
    if (preferredContact) user.preferredContact = preferredContact;
    if (agentDescription) user.agentDescription = agentDescription;
    if (social) {
      user.social = {
        ...user.social,
        ...social
      };
    }
    if (profilePicture) user.profilePicture = profilePicture;
    if (req.body.leadEmailNotifications !== undefined) {
      user.leadEmailNotifications = !!req.body.leadEmailNotifications;
    }
    
    if (company) {
      user.company = {
        ...user.company,
        ...company,
        social: company.social ? { ...user.company?.social, ...company.social } : user.company?.social
      };
    }

    await user.save();

    // Update all assets with new agent info
    await updateUserAssetsAgent(user._id, {
      name: user.name,
      phone: user.phone,
      photo: user.profilePicture,
      company: user.company?.companyName,
      companyLogo: user.company?.companyLogo,
      companyDescription: user.company?.description,
      address: user.company?.address,
      website: user.company?.website,
      plan: user.plan
    });

    res.json({ message: "PROFILE_UPDATED_SUCCESSFULLY", user });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "UPDATE_FAILED" });
  }
});

/**
 * TOGGLE LEAD NOTIFICATIONS
 */
router.put("/toggle-lead-notifications", authMiddleware, async (req, res) => {
    try {
        const { enabled } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { leadEmailNotifications: !!enabled },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

        res.json({ message: "NOTIFICATION_SETTING_UPDATED", user });
    } catch (err) {
        console.error("Notification Toggle Error:", err);
        res.status(500).json({ error: "UPDATE_FAILED" });
    }
});

/**
 * SUBMIT VERIFICATION DOCUMENTS
 */

const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folders = getFolderPaths(req.user.email);
    return {
      folder: folders.profile,
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

    // Update all assets with new profile picture
    await updateUserAssetsAgent(user._id, {
      photo: user.profilePicture
    });

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
    const folders = getFolderPaths(req.user.email);
    return {
      folder: folders.company,
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

    // Check if verified - lock update (Unless Premium)
    const isPremium = currentUser.plan === 'Premium Basic' || currentUser.plan === 'Business VIP';
    if (currentUser.isVerified && !isPremium) {
      return res.status(403).json({ error: "VERIFIED_USER_CANNOT_CHANGE_LOGO" });
    }

    // Delete old company logo if exists
    if (currentUser.company?.companyLogoPublicId) {
        await cloudinary.uploader.destroy(currentUser.company.companyLogoPublicId).catch(err =>
            console.error("Failed to delete old company logo from Cloudinary:", err)
        );
    } else if (currentUser.company?.companyLogo) {
        const oldPublicId = getPublicIdFromUrl(currentUser.company.companyLogo);
        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId).catch(err =>
                console.error("Failed to delete old company logo from Cloudinary:", err)
            );
        }
    }

    const logoUrl = req.file.path;
    const logoPublicId = req.file.filename;

    if (!currentUser.company) {
        currentUser.company = {};
    }
    currentUser.company.companyLogo = logoUrl;
    currentUser.company.companyLogoPublicId = logoPublicId;

    currentUser.markModified('company');
    await currentUser.save();

    // Update ALL assets created by this user
    await updateUserAssetsAgent(currentUser._id, {
      companyLogo: logoUrl
    });

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

/**
 * UPLOAD COVER PHOTO (USER)
 */
const coverPhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folders = getFolderPaths(req.user.email);
    return {
      folder: folders.profile,
      public_id: `cover_photo_${Date.now()}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});

const uploadCoverPhoto = multer({ storage: coverPhotoStorage });

router.post("/upload-cover-photo", authMiddleware, uploadCoverPhoto.single('coverPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE_UPLOADED" });
    }

    const currentUser = await User.findById(req.user.id);
    if (currentUser.coverPhotoPublicId) {
      await cloudinary.uploader.destroy(currentUser.coverPhotoPublicId).catch(e => console.error("Cloudinary delete failed:", e));
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        coverPhoto: req.file.path,
        coverPhotoPublicId: req.file.filename
      },
      { new: true }
    ).select("-password");

    res.json({ message: "COVER_PHOTO_UPDATED_SUCCESSFULLY", user });
  } catch (err) {
    console.error("Cover Photo Upload Error:", err);
    res.status(500).json({ error: "UPLOAD_FAILED" });
  }
});

/**
 * UPLOAD COMPANY COVER PHOTO
 */
const companyCoverStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folders = getFolderPaths(req.user.email);
    return {
      folder: folders.company,
      public_id: `company_cover_${Date.now()}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});

const uploadCompanyCover = multer({ storage: companyCoverStorage });

router.post("/upload-company-cover", authMiddleware, uploadCompanyCover.single('coverPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "NO_FILE_UPLOADED" });
    }

    const currentUser = await User.findById(req.user.id);
    if (currentUser.company?.coverPhotoPublicId) {
      await cloudinary.uploader.destroy(currentUser.company.coverPhotoPublicId).catch(e => console.error("Cloudinary delete failed:", e));
    }

    if (!currentUser.company) currentUser.company = {};
    currentUser.company.coverPhoto = req.file.path;
    currentUser.company.coverPhotoPublicId = req.file.filename;

    currentUser.markModified('company');
    await currentUser.save();

    res.json({ message: "COMPANY_COVER_UPDATED_SUCCESSFULLY", user: currentUser });
  } catch (err) {
    console.error("Company Cover Upload Error:", err);
    res.status(500).json({ error: "UPLOAD_FAILED" });
  }
});
const verificationDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/temp');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `verify-${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  }
});

const uploadVerification = multer({ 
  storage: verificationDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post("/submit-verification", authMiddleware, uploadVerification.any(), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      console.log("No files received in request body");
      return res.status(400).json({ error: "NO_FILES_UPLOADED" });
    }

    // Fetch user from DB to ensure email is from the persistent session (DB)
    const sessionUser = await User.findById(req.user.id);
    if (!sessionUser || !sessionUser.email) {
      return res.status(401).json({ error: "USER_SESSION_INVALID" });
    }

    const folders = getFolderPaths(sessionUser.email);
    const folder = folders.verification;

    // --- CLEANUP: Delete old verification documents if they exist ---
    if (sessionUser.verificationDocuments) {
        const docMap = sessionUser.verificationDocuments instanceof Map 
            ? Object.fromEntries(sessionUser.verificationDocuments) 
            : sessionUser.verificationDocuments;

        for (const [key, url] of Object.entries(docMap)) {
            const publicId = getPublicIdFromUrl(url);
            if (publicId) {
                console.log(`Deleting old verification doc: ${publicId}`);
                await cloudinary.uploader.destroy(publicId).catch(err => 
                    console.error(`Failed to delete ${publicId}:`, err)
                );
            }
        }
    }

    console.log(`Received ${files.length} files for verification from ${sessionUser.email}`);

    const verificationDocuments = {};

    // Upload files to Cloudinary manually
    for (const file of files) {
      try {
        const absolutePath = path.resolve(file.path);
        console.log(`Uploading ${file.fieldname} from ${absolutePath} to folder: ${folder}...`);
        
        const result = await cloudinary.uploader.upload(absolutePath, {
          folder: folder,
          public_id: `${file.fieldname}-${Date.now()}`,
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
          type: 'upload',
          access_mode: 'public',
          invalidate: true,
          overwrite: true
        });
        
        console.log(`Upload successful for ${file.fieldname}. Cloudinary folder: ${result.folder}`);
        
        verificationDocuments[file.fieldname] = result.secure_url;
        
        // Remove local file
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      } catch (uploadErr) {
        console.error(`Failed to upload ${file.fieldname} to Cloudinary:`, uploadErr);
        // Clean up remaining files if one fails
        files.forEach(f => { if(fs.existsSync(f.path)) fs.unlinkSync(f.path); });
        
        const errorMsg = uploadErr.message || (typeof uploadErr === 'string' ? uploadErr : JSON.stringify(uploadErr));
        throw new Error(`Cloudinary upload failed for ${file.fieldname}: ${errorMsg}`);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        verificationStatus: "Pending",
        verificationDocuments: verificationDocuments
      },
      { new: true }
    ).select("-password");

    if (!user) {
        throw new Error("User not found during status update");
    }

    console.log(`Verification status updated to Pending for user ${user.email} with docs in ${folder}`);
    
    // Send response with debugging info
    res.json({
        ...user.toObject(),
        uploadFolder: folder
    });

    // Non-blocking notifications
    // ... rest of the code remains the same for notifications ...
    
    // 1. Notify User (In-app)
    User.findByIdAndUpdate(req.user.id, {
        $push: {
            notifications: {
                type: "VERIFICATION_PENDING",
                message: "Your verification documents have been received and are under review.",
                targetTab: "settings",
                createdAt: new Date()
            }
        }
    }).catch(err => console.error("In-app notification failed:", err));

    // 2. Notify User (Email)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || "smtp.gmail.com",
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: parseInt(process.env.EMAIL_PORT) === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verification Documents Received - Otulia",
            text: `Hi ${user.name},\n\nWe have received your dealer verification documents. Our team will review them within 24-48 hours.\n\nYou will receive another notification once the review is complete.\n\nBest regards,\nThe Otulia Team`,
        };

        transporter.sendMail(userMailOptions).catch(error => console.error("User email failed:", error));
    }

    // 3. Notify Admins
    User.find({ role: 'admin' }).then(admins => {
        User.updateMany(
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
        ).catch(err => console.error("Admin in-app notification failed:", err));

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const adminDashboardLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin`;
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || "smtp.gmail.com",
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: parseInt(process.env.EMAIL_PORT) === 465,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            admins.forEach(admin => {
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: admin.email,
                    subject: `New Verification Request: ${user.name}`,
                    text: `A new dealer verification request has been submitted by ${user.name} (${user.email}). Review it here: ${adminDashboardLink}`
                }).catch(err => console.error(`Admin email failed for ${admin.email}:`, err));
            });
        }
    }).catch(err => console.error("Admin lookup failed:", err));

  } catch (err) {
    console.error("Verification Submit Error:", err);
    if (!res.headersSent) {
        res.status(500).json({ error: "SUBMISSION_FAILED", details: err.message });
    }
  }
});

/**
 * GET PUBLIC PROFILE BY EMAIL
 */
router.get("/public-profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-password -notifications -favorites -myListings -boughtHistory -rentedHistory -verificationDocuments");
    
    if (!user) {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    // Fetch all active listings for this user
    const models = [CarAsset, BikeAsset, YachtAsset, EstateAsset, Listing];
    const listingPromises = models.map(Model => Model.find({ ownerEmail: email, status: 'Active' }));
    
    const results = await Promise.all(listingPromises);
    const allListings = results.flat();

    res.json({
      user,
      listings: allListings
    });
  } catch (err) {
    console.error("Public Profile Fetch Error:", err);
    res.status(500).json({ error: "FETCH_PROFILE_FAILED" });
  }
});

module.exports = router;
