const mongoose = require("mongoose");

// Comments on Journal articles. Kept separate from the ranking `Comment`
// model so ranking discussions and journal discussions never mix.
// `postSlug` works for both CMS posts and the hand-written stories.
const blogCommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    postSlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogComment",
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogCommentSchema.index({ postSlug: 1, createdAt: -1 });

module.exports = mongoose.model("BlogComment", blogCommentSchema);
