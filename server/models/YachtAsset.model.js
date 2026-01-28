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

    // Modified based on the 6 icons in the image header
    keySpecifications: {
      length: String,           // e.g. "27 M length"
      bathrooms: String,        // e.g. "6"
      fuelCapacity: String,     // e.g. "9,500 L fuel capacity"
      totalPower: String,       // e.g. "3,800 HP total"
      bedrooms: String,         // e.g. "7"
      topSpeed: String          // e.g. "28 knots"
    },

    // Detailed fields from the "General" and "Fuel" columns in the image table
    specification: {
      // General Column
      yearOfConstruction: String, //
      brandBuilder: String,       //
      model: String,              //
      yachtType: String,          //
      usageHours: String,         //
      topSpeed: String,           //
      enginePower: String,        //
      cruisingSpeed: String,      //
      fuelConsumption: String,    //
      transmission: String,       //
      hullMaterial: String,       //

      // Fuel / Right Column
      fuelType: String,           //
      configuration: String,      //
      interiorMaterial: String,   //
      interiorColor: String,      //
      exteriorColor: String,      //
      manufacturerColorCode: String, //
      matchingNumbers: String,    //
      condition: String,          //
      usageStatus: String,        // (New / Used)
      countryOfFirstDelivery: String, //
      numberOfOwners: String,     //
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
    acquisition: {
      type: String,
      enum: ['rent', 'buy', 'rent/buy'],
      required: true
    },

    isTrending: { type: Boolean, default: false },

    popularity: { type: Number, min: 1, max: 10 },

    views: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    keywords: [{ type: String }],

  },
  { timestamps: true }
);

module.exports = mongoose.model("YachtAsset", yachtAssetSchema);