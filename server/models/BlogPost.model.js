const mongoose = require("mongoose");

// One document = one Journal article. Mirrors the structure of the
// hand-written stories (eyebrow, hero, TOC sections, FAQs, specs, CTA).
const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, trim: true, default: "" },
    body: { type: String, default: "" }, // paragraphs separated by a blank line
    quote: { type: String, trim: true, default: "" },
    quoteAttribution: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    imageCaption: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const blogPostSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    status: { type: String, enum: ["draft", "published"], default: "draft" },

    title: { type: String, required: true, trim: true },
    tag: { type: String, trim: true, default: "" }, // eyebrow, e.g. "Road Test"
    category: { type: String, trim: true, default: "Cars" }, // Cars | Real Estate | Yachts | Watches | Guides
    excerpt: { type: String, trim: true, default: "" }, // subtitle + SEO description
    heroImage: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "Otulia Editorial Team" },
    readTime: { type: String, trim: true, default: "" }, // minutes, e.g. "8"
    publishedAt: { type: Date, default: Date.now },

    sections: { type: [sectionSchema], default: [] },
    faqs: {
      type: [{ q: String, a: String, _id: false }],
      default: [],
    },
    specs: {
      type: [{ label: String, value: String, _id: false }],
      default: [],
    },
    cta: {
      text: { type: String, trim: true, default: "" },
      buttonLabel: { type: String, trim: true, default: "" },
      url: { type: String, trim: true, default: "" },
    },

    // Audit trail: which admin created / last edited the article (set by the server, not the form)
    createdBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      email: { type: String, trim: true },
    },
    updatedBy: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      email: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model("BlogPost", blogPostSchema);
