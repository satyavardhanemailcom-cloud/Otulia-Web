const mongoose = require("mongoose");

const bikeAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    location: { type: String, required: true },

    images: [{ type: String }],

    brand: { type: String },
    brand_logo: { type: String },
    variant: { type: String },
    highlights: [{ type: String }],
    videoUrl: { type: String },

    keySpecifications: {
      engineCapacity: String,
      mileage: String,
      fuelType: String,
      transmission: String,
      color: String
    },

    specification: {
      yearOfConstruction: String,
      brand: String,
      model: String,
      variant: String,
      engineCapacityCC: Number,
      mileageKM: Number,
      fuelType: String,
      transmission: String,
      color: String,
      condition: String,
      ownershipCount: Number,
      accidentHistory: String,
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
    category: { type: String, default: 'bikes' },
    type: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },

    isTrending: { type: Boolean, default: false },

    popularity: { type: Number, min: 1, max: 10 },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    keywords: [{ type: String }],

  },
  { timestamps: true }
);

module.exports = mongoose.model("BikeAsset", bikeAssetSchema);