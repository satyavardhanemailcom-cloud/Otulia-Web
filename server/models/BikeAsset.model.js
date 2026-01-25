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

    // Based on the top 3 icons in your image: 
    // 1. Engine Icon (803 cc) 
    // 2. Speedometer Icon (18-20 km/l) 
    // 3. Fuel Pump Icon (13.5 liters)
    keySpecifications: {
      engineCapacity: String,   // e.g., "803 cc"
      mileage: String,          // e.g., "18-20 km/l"
      fuelTankCapacity: String  // e.g., "13.5 liters"
    },

    // Detailed fields from the table sections in the image
    specification: {
      // General
      yearOfConstruction: String,
      brand: String,            // e.g. "Ducati"
      model: String,            // e.g. "Scrambler Desert Sled"
      year: String,             // e.g. "2024"
      condition: String,        // e.g. "New / Pre-Owned"

      // Engine & Performance
      engineType: String,       // e.g. "L-Twin, air-cooled"
      engineCapacity: String,   // e.g. "803 cc"
      maxPower: String,         // e.g. "73 hp @ 8,250 rpm"
      maxTorque: String,        // e.g. "67 Nm @ 5,750 rpm"
      transmission: String,     // e.g. "6-Speed Manual"
      fuelSystem: String,       // e.g. "Electronic Fuel Injection"
      mileage: String,          // e.g. "18-20 km/l"
      fuelType: String,         // e.g. "Petrol"

      // Chassis & Suspension
      frame: String,            // e.g. "Steel Trellis Frame"
      frontSuspension: String,  // e.g. "Upside-Down Forks"
      frontBrake: String,       // e.g. "Dual Disc"
      rearBrake: String,        // e.g. "Single Disc"

      // Safety & Electronics
      abs: String,              // e.g. "Yes (Cornering ABS)"
      tractionControl: String,  // e.g. "Yes"
      rideModes: String,        // e.g. "Yes"
      immobilizer: String,      // e.g. "Yes"

      // Wheels & Tyres
      frontWheel: String,       // e.g. "19-inch Spoked"
      rearWheel: String,        // e.g. "17-inch Spoked"
      tyreType: String,         // e.g. "Dual-Purpose"
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
    status: { type: String, enum: ['Active', 'Sold', 'Rented'], default: 'Active' },
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