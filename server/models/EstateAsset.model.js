const mongoose = require("mongoose");

const estateAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    location: { type: String, required: true },

    images: [{ type: String }],

    keySpecifications: {
      type: String, // Land area | bathrooms | bedrooms | floors | garage_capacity
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
      ceilingHeight: String,
      parkingCapacity: Number,
      furnitureStatus: String,
      ownershipType: String,
      view: String,
      configuration: String,
      interiorMaterial: String,
      interiorColorTheme: String,
      exteriorFinish: String,
      outdoorSpaces: String,
      climateControl: String,
      smartHomeSystem: String,
      security: String,
      condition: String,
      usageStatus: String,
      country: String,
    },

    agent: {
      name: String,
      phone: String,
      email: String,
      company: String,
      companyLogo: String,
    },

    isTrending: { type: Boolean, default: false },

    popularity: { type: Number, min: 1, max: 10 },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EstateAsset", estateAssetSchema);
