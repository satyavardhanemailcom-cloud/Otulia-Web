const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const BlogPost = require("../models/BlogPost.model");
const BlogComment = require("../models/BlogComment.model");
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
    "commentsEnabled",
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

// ---------- Comments (public read, logged-in write) ----------

// Slugs of the hand-written stories (client/src/data/journalArticles.js).
// They have no CMS document, so comments are always on for them.
let staticSlugs = null;
const getStaticSlugs = () => {
  if (staticSlugs) return staticSlugs;
  try {
    const source = fs.readFileSync(
      path.join(__dirname, "../../client/src/data/journalArticles.js"),
      "utf8"
    );
    staticSlugs = new Set([...source.matchAll(/"([a-z0-9-]+)":\s*\{/g)].map((m) => m[1]));
  } catch {
    staticSlugs = new Set(); // source not shipped; fall back to CMS-only checks
  }
  return staticSlugs;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// -> { exists, enabled }
const resolveCommentTarget = async (rawSlug) => {
  const slug = String(rawSlug || "").toLowerCase();
  if (!SLUG_RE.test(slug)) return { exists: false, enabled: false, slug };
  const post = await BlogPost.findOne({ slug, status: "published" })
    .select("commentsEnabled")
    .lean();
  if (post) return { exists: true, enabled: post.commentsEnabled !== false, slug };
  const statics = getStaticSlugs();
  if (statics.has(slug)) return { exists: true, enabled: true, slug };
  return { exists: false, enabled: false, slug };
};

const mapComment = (c) => ({
  _id: c._id,
  text: c.text,
  parentCommentId: c.parentCommentId || null,
  likes: (c.likes || []).map((id) => id.toString()),
  edited: c.edited,
  createdAt: c.createdAt,
  user:
    c.userId && c.userId._id
      ? {
          _id: c.userId._id,
          name: c.userId.name,
          profilePicture: c.userId.profilePicture || "",
        }
      : { _id: null, name: "Unknown User", profilePicture: "" },
});

// Loads a comment and checks its article still accepts comments.
const loadWritableComment = async (req, res) => {
  const comment = await BlogComment.findById(req.params.id);
  if (!comment) {
    res.status(404).json({ error: "COMMENT_NOT_FOUND" });
    return null;
  }
  const target = await resolveCommentTarget(comment.postSlug);
  if (!target.enabled) {
    res.status(403).json({ error: "COMMENTS_DISABLED" });
    return null;
  }
  return comment;
};

// All comments for an article (oldest first; the client sorts for display)
router.get("/comments/:slug", async (req, res) => {
  try {
    const target = await resolveCommentTarget(req.params.slug);
    if (!target.exists) return res.status(404).json({ error: "NOT_FOUND" });
    if (!target.enabled) return res.json({ enabled: false, comments: [] });

    const comments = await BlogComment.find({ postSlug: target.slug })
      .sort({ createdAt: 1 })
      .populate("userId", "name profilePicture");
    res.json({ enabled: true, comments: comments.map(mapComment) });
  } catch (err) {
    console.error("GET blog comments error:", err);
    res.status(500).json({ error: "FETCH_COMMENTS_FAILED" });
  }
});

// Post a comment or reply
router.post("/comments", authMiddleware, async (req, res) => {
  try {
    const { slug, parentCommentId, text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "TEXT_REQUIRED" });
    }

    const target = await resolveCommentTarget(slug);
    if (!target.exists) return res.status(404).json({ error: "NOT_FOUND" });
    if (!target.enabled) return res.status(403).json({ error: "COMMENTS_DISABLED" });

    if (parentCommentId) {
      const parent = await BlogComment.findById(parentCommentId);
      if (!parent) return res.status(404).json({ error: "PARENT_COMMENT_NOT_FOUND" });
      if (parent.postSlug !== target.slug) {
        return res.status(400).json({ error: "PARENT_COMMENT_MISMATCH" });
      }
    }

    const comment = await BlogComment.create({
      userId: req.user.id,
      postSlug: target.slug,
      parentCommentId: parentCommentId || null,
      text: String(text).trim(),
    });
    const populated = await BlogComment.findById(comment._id).populate(
      "userId",
      "name profilePicture"
    );
    res.status(201).json({ comment: mapComment(populated) });
  } catch (err) {
    if (err?.name === "ValidationError") return res.status(400).json({ error: err.message });
    console.error("POST blog comment error:", err);
    res.status(500).json({ error: "POST_COMMENT_FAILED" });
  }
});

// Edit (owner only)
router.put("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "TEXT_REQUIRED" });
    }
    const comment = await loadWritableComment(req, res);
    if (!comment) return;
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "NOT_COMMENT_OWNER" });
    }

    comment.text = String(text).trim();
    comment.edited = true;
    await comment.save();
    const populated = await BlogComment.findById(comment._id).populate(
      "userId",
      "name profilePicture"
    );
    res.json({ comment: mapComment(populated) });
  } catch (err) {
    if (err?.name === "ValidationError") return res.status(400).json({ error: err.message });
    console.error("PUT blog comment error:", err);
    res.status(500).json({ error: "EDIT_COMMENT_FAILED" });
  }
});

// Delete with replies (owner or admin, so admins can moderate)
router.delete("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await BlogComment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "COMMENT_NOT_FOUND" });
    const isOwner = comment.userId.toString() === req.user.id;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "NOT_COMMENT_OWNER" });
    }

    const children = await BlogComment.find({ parentCommentId: comment._id }).select("_id");
    const childIds = children.map((c) => c._id);
    const grandChildren = childIds.length
      ? await BlogComment.find({ parentCommentId: { $in: childIds } }).select("_id")
      : [];
    const allIds = [comment._id, ...childIds, ...grandChildren.map((c) => c._id)];

    await BlogComment.deleteMany({ _id: { $in: allIds } });
    res.json({ success: true, deleted: allIds.length });
  } catch (err) {
    console.error("DELETE blog comment error:", err);
    res.status(500).json({ error: "DELETE_COMMENT_FAILED" });
  }
});

// Toggle like
router.post("/comments/:id/like", authMiddleware, async (req, res) => {
  try {
    const comment = await loadWritableComment(req, res);
    if (!comment) return;

    const userId = req.user.id;
    const existingIndex = comment.likes.findIndex((id) => id.toString() === userId);
    if (existingIndex >= 0) comment.likes.splice(existingIndex, 1);
    else comment.likes.push(userId);
    await comment.save();

    res.json({ liked: existingIndex < 0, likesCount: comment.likes.length });
  } catch (err) {
    console.error("POST blog comment like error:", err);
    res.status(500).json({ error: "LIKE_COMMENT_FAILED" });
  }
});

// Report
router.post("/comments/:id/report", authMiddleware, async (req, res) => {
  try {
    const comment = await BlogComment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "COMMENT_NOT_FOUND" });
    if (!comment.reportedBy.some((id) => id.toString() === req.user.id)) {
      comment.reportedBy.push(req.user.id);
      await comment.save();
    }
    res.json({ success: true });
  } catch (err) {
    console.error("POST blog comment report error:", err);
    res.status(500).json({ error: "REPORT_COMMENT_FAILED" });
  }
});

// ---------- CMS (admins only) ----------
// Every /admin/... route (list, read, create, edit, delete, upload) requires an admin login.
router.use("/admin", authMiddleware, requireAdmin);

router.get("/admin/all", async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .select("slug title status category commentsEnabled publishedAt updatedAt")
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
    const before = await BlogPost.findById(req.params.id).select("slug").lean();
    const post = await BlogPost.findByIdAndUpdate(req.params.id, { ...pickFields(req.body), updatedBy: actor(req) }, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!post) return res.status(404).json({ error: "NOT_FOUND" });
    // Keep the discussion attached when the slug is renamed
    if (before?.slug && before.slug !== post.slug) {
      await BlogComment.updateMany({ postSlug: before.slug }, { postSlug: post.slug });
    }
    res.json(post);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/admin/:id", async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    // Remove the article's discussion with it
    if (post?.slug) await BlogComment.deleteMany({ postSlug: post.slug });
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
