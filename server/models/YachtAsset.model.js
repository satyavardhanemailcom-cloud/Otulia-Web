const mongoose = require("mongoose");

const yachtAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    location: { type: String, required: true },

    images: [{ type: String }],

    brand: { type: String },
    brand_logo: { type: String },
    builder: { type: String },
    highlights: [{ type: String }],
    videoUrl: { type: String },

    keySpecifications: {
      length: String,
      beam: String,
      draft: String,
      cruisingSpeed: String,
      guestCapacity: String,
      crewCapacity: String,
      engineType: String
    },

    specification: {
      yearOfConstruction: String,
      builder: String,
      model: String,
      length: String,
      beam: String,
      draft: String,
      engineType: String,
      cruisingSpeed: String,
      guestCapacity: String,
      crewCapacity: String,
      yachtLocation: String,
      fuelType: String,
      hullMaterial: String,
      condition: String,
    },

    agent: {
      id: String,
      name: String,
      photo: String,
      phone: String,
      email: String,
      company: String,
      companyLogo: String,
      joined: { type: Number },
    },

    documents: [{ type: String }],
    status: { type: String, enum: ['Active', 'Sold', 'Rented', 'Draft'], default: 'Active' },
    category: { type: String, default: 'yachts' },
    type: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },

    isTrending: { type: Boolean, default: false },

    popularity: { type: Number, min: 1, max: 10 },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    keywords: [{ type: String }],

  },
  { timestamps: true }
);

module.exports = mongoose.model("YachtAsset", yachtAssetSchema);