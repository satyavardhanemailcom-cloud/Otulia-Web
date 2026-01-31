const authMiddleware = require("../middleware/auth.middleware");

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { OAuth2Client } = require("google-auth-library");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

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
        // Optional profile picture logic can be added here if you want to store it
      });
    } else if (!user.googleId) {
      // Link googleId to existing email user
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
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
      { id: user._id, role: user.role },
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
      { id: user._id, role: user.role },
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
    const { name, phone, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, profilePicture },
      { new: true }
    ).select("-password");

    res.json({ message: "PROFILE_UPDATED_SUCCESSFULLY", user });
  } catch (err) {
    res.status(500).json({ error: "UPDATE_FAILED" });
  }
});

/**
 * SUBMIT VERIFICATION DOCUMENTS
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), 'uploads/verification');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.post("/submit-verification", authMiddleware, upload.any(), async (req, res) => {
  try {
    console.log("Received verification submission:", req.files, req.body);
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "NO_FILES_UPLOADED" });
    }

    const verificationDocuments = {};

    files.forEach(file => {
      // Public URL assuming 'uploads' static serve
      const publicUrl = `/uploads/verification/${file.filename}`;
      verificationDocuments[file.fieldname] = publicUrl;
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        verificationStatus: "Pending",
        verificationDocuments: verificationDocuments
      },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Verification Submit Error:", err);
    res.status(500).json({ error: "SUBMISSION_FAILED" });
  }
});

module.exports = router;
