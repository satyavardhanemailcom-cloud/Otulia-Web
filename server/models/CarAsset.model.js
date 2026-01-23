const mongoose = require("mongoose");

const vehicleAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    location: { type: String, required: true },

    images: [{ type: String }],

    brand: { type: String },

    keySpecifications: {
      power: String,
      mileage: String,
      cylinderCapacity: String // Power | Mileage | Cylinder_capacity
    },

    specification: {
      yearOfConstruction: String,
      model: String,
      body: String,
      series: String,
      mileage: String,
      power: String,
      cylinderCapacity: String,
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
      countryOfFirstDelivery: String,
      numberOfOwners: Number,
      carLocation: String,
    },

    agent: {
      id: String,
      name: String,
      photo: String,
      phone: String,
      email: String,
      company: String,
      companyLogo: String,
    },

    isTrending: { type: Boolean, default: false },

    popularity: { type: Number, min: 1, max: 10 },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    keywords: [{ type: String }],

  },
  { timestamps: true }
);

module.exports = mongoose.model("CarAsset", vehicleAssetSchema);
