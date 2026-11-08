const express = require("express");
const router = express.Router();
const BlogPost = require("../models/BlogPost.model");
const { upload } = require("../config/cloudinary");
const authMiddleware = require("../middleware/auth.middleware");

// Only logged-in users with role "admin" may use the CMS routes below.
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "ACCESS_DENIED_ADMIN_ONLY" });
  }
  next();
};

// Who made a change, stored on the article for later review.
const actor = (req) => ({ id: req.user._id, email: req.user.email });

// Only these fields can be written from the CMS form
const pickFields = (body = {}) => {
  const fields = [
    "slug", "status", "title", "tag", "category", "excerpt", "heroImage",
    "author", "readTime", "publishedAt", "sections", "faqs", "specs", "cta",
  ];
  return fields.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});
};

const handleError = (res, err) => {
  if (err?.code === 11000) return res.status(409).json({ error: "SLUG_ALREADY_EXISTS" });
  if (err?.name === "ValidationError") return res.status(400).json({ error: err.message });
  console.error("Blog CMS error:", err);
  return res.status(500).json({ error: "BLOG_CMS_ERROR" });
};

// ---------- Public ----------

// List of published posts (card data only)
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: "published" })
      .select("slug title tag category excerpt heroImage author readTime publishedAt")
      .sort({ publishedAt: -1 })
      .lean();
    res.json(posts);
  } catch (err) {
    handleError(res, err);
  }
});

// Single published post
router.get("/post/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: String(req.params.slug).toLowerCase(),
      status: "published",
    }).lean();
    if (!post) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(post);
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- CMS (admins only) ----------
// Every /admin/... route (list, read, create, edit, delete, upload) requires an admin login.
router.use("/admin", authMiddleware, requireAdmin);

router.get("/admin/all", async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .select("slug title status category publishedAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();
    res.json(posts);
  } catch (err) {
    handleError(res, err);
  }
});

router.get("/admin/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(post);
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/admin", async (req, res) => {
  try {
    const post = await BlogPost.create({
      ...pickFields(req.body),
      createdBy: actor(req),
      updatedBy: actor(req),
    });
    res.status(201).json(post);
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/admin/:id", async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, { ...pickFields(req.body), updatedBy: actor(req) }, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!post) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(post);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/:id", async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    handleError(res, err);
  }
});

// Image upload for hero / section images (field name: "image")
router.post("/admin/upload", upload.single("image"), (req, res) => {
  const url = req.file?.path || req.file?.secure_url || req.file?.url || null;
  if (!url) return res.status(400).json({ error: "NO_FILE_UPLOADED" });
  res.json({ url });
});

module.exports = router;
