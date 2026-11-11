const mongoose = require("mongoose");

const carAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    listingReference: { type: String, unique: true, sparse: true, index: true },

    price: { type: Number, required: true },
    isPriceOnRequest: { type: Boolean, default: false },
    location: { type: String, required: true },

    images: [{ type: String }],

    brand: { type: String },
    brand_logo: { type: String },
    variant: { type: String },
    highlights: [{ type: String }],
    videoUrl: { type: String },
    tag: { type: String, default: '' }, // Card badge: Exclusive, Rare, Limited Edition, Track Spec, Trending, Featured

    keySpecifications: {
      power: String,
      topSpeed: String,
      engineType: String
    },

    specification: {
      yearOfConstruction: String,
      model: String,
      variant: String,
      body: String,
      series: String,
      mileage: String,
      power: String,
      engine: String,
      cylinderCapacity: String,
      topSpeed: String,
      engineType: String,
      torque: String, // e.g. "1000 Nm"
      acceleration: String, // 0-100 km/h, e.g. "3.2 s"
      co2Emission: String,
      consumption: String,
      steering: String,
      transmission: String,
      drive: String,
      fuel: String,
      configuration: String,
      interiorMaterial: String,
      interiorColor: String,
      exteriorColor: String,
      manufacturerColorCode: String,
      matchingNumbers: String,
      condition: String,
      usageStatus: String, // used / unused
      accidentFree: String,
      accidentHistory: String,
      countryOfFirstDelivery: String,
      numberOfOwners: Number,
      carLocation: String,
      latitude: String,
      longitude: String,
      soulOfTheCar: String,
      idealBuyer: String,
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
    category: { type: String, default: 'vehicles', index: true },
    type: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },
    acquisition: {
      type: String,
      enum: ['rent', 'buy', 'rent/buy'],
      required: true,
      index: true
    },

    isTrending: { type: Boolean, default: false, index: true },

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
carAssetSchema.index({ status: 1, price: 1 });
// Compound index for trending assets on homepage
carAssetSchema.index({ status: 1, isTrending: 1 });

module.exports = mongoose.model("CarAsset", carAssetSchema);
