const mongoose = require("mongoose");

const estateAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    location: { type: String, required: true },

    images: [{ type: String }],
    propertyName: { type: String },
    highlights: [{ type: String }],
    videoUrl: { type: String },
    amenities: [{ type: String }],
    smartHomeSystems: [{ type: String }],
    viewTypes: [{ type: String }],

    keySpecifications: {
      bedrooms: String,
      bathrooms: String,
      floors: String,
      builtUpArea: String,
      landArea: String,
      propertyType: String
    },

    specification: {
      yearOfConstruction: String,
      propertyType: String,
      architectureStyle: String,
      builtUpArea: String,
      landArea: String,
      floors: Number,
      bedrooms: Number,
      bathrooms: Number,
      furnishingStatus: String,
      configuration: String,
      interiorMaterial: String,
      interiorColorTheme: String,
      exteriorFinish: String,
      climateControl: String,
      condition: String,
      usageStatus: String,
      country: String,
      city: String,
      address: String,
      areaNeighborhood: String,
      latitude: String,
      longitude: String,
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
    category: { type: String, default: 'estates' },
    type: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },

    isTrending: { type: Boolean, default: false },

    popularity: { type: Number, min: 1, max: 10 },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    keywords: [{ type: String }],

  },
  { timestamps: true }
);

module.exports = mongoose.model("EstateAsset", estateAssetSchema);
