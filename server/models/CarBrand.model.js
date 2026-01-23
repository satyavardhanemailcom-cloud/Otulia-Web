const mongoose = require("mongoose");

const carBrandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logoImage: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      trim: true,
    },
    yearFounded: {
      type: Number,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    popularity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarBrand", carBrandSchema);
