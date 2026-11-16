const mongoose = require("mongoose");

const estateAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    listingReference: { type: String, unique: true, sparse: true, index: true },

    price: { type: Number, required: true },
    isPriceOnRequest: { type: Boolean, default: false },
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
      garageCapacity: String,
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
      garageCapacity: Number,
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
      companyDescription: String,
      address: String,
      website: String,
      plan: String,
      joined: { type: Number },
    },

    documents: [{ type: String }],
    status: { type: String, enum: ['Active', 'Sold', 'Rented', 'Draft'], default: 'Active', index: true },
    category: { type: String, default: 'estates', index: true },
    type: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },
    acquisition: {
      type: String,
      enum: ['rent', 'buy', 'rent/buy'],
      required: true,
      index: true
    },

    isTrending: { type: Boolean, default: false, index: true },
    directlyFromDeveloper: { type: Boolean, default: false },
    has3PercentPriceDeduction: { type: Boolean },

    popularity: { type: Number, default: 0, index: true },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    keywords: [{ type: String }],

    priceHistory: [
      {
        year: { type: Number },
        price: { type: Number },
        currency: { type: String, default: 'USD $' }
      }
    ],
    priceHistoryOptions: {
      graphType: { type: String, default: 'Bar Graph' },
      currency: { type: String, default: 'USD $' },
      useInflationAdjusted: { type: Boolean, default: false },
      allowAIEstimate: { type: Boolean, default: false }
    },

  },
  { timestamps: true }
);

// Compound index for status and price for category filtering
estateAssetSchema.index({ status: 1, price: 1 });
// Compound index for trending assets on homepage
estateAssetSchema.index({ status: 1, isTrending: 1 });

module.exports = mongoose.model("EstateAsset", estateAssetSchema);
