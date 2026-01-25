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

    // Based on the 6 icons at the top of your Yacht image:
    // 1. Length (27 M)
    // 2. Bathrooms (6)
    // 3. Fuel Capacity (9,500 L)
    // 4. Power (3,800 HP)
    // 5. Bedrooms (7)
    // 6. Top Speed (28 knots)
    keySpecifications: {
      length: String,           // e.g. "27 M length"
      bathrooms: String,        // e.g. "6"
      fuelCapacity: String,     // e.g. "9,500 L fuel capacity"
      totalPower: String,       // e.g. "3,800 HP total"
      bedrooms: String,         // e.g. "7"
      topSpeed: String          // e.g. "28 knots"
    },

    // Detailed fields from the "General" and "Fuel" columns in the image
    specification: {
      // General Column
      yearOfConstruction: String,
      brandBuilder: String,      // e.g. "Azimut"
      model: String,             // e.g. "Grande 27 Metri"
      yachtType: String,         // e.g. "Motor Yacht"
      usageHours: String,        // e.g. "480 hrs"
      topSpeed: String,          // e.g. "28 knots" (Repeated here as per table)
      enginePower: String,       // e.g. "2 x 1,900 HP"
      cruisingSpeed: String,     // e.g. "24 knots"
      fuelConsumption: String,   // e.g. "480 L/hr (cruise)"
      transmission: String,      // e.g. "Shaft drive"
      hullMaterial: String,      // e.g. "GRP (Fiberglass)"

      // Fuel / Right Column
      fuelType: String,          // e.g. "Diesel"
      configuration: String,     // e.g. "Stabilizers, Bow Thruster..."
      interiorMaterial: String,  // e.g. "Premium Leather & Wood"
      interiorColor: String,     // e.g. "Beige / Walnut"
      exteriorColor: String,     // e.g. "White"
      manufacturerColorCode: String, // e.g. "Azimut Pearl White"
      matchingNumbers: String,   // e.g. "Yes"
      condition: String,         // e.g. "Accident-free"
      usageStatus: String,       // e.g. "Used yacht"
      countryOfFirstDelivery: String, // e.g. "Italy"

      // Note: The image label says "Number of owners" but shows a location flag ("Monaco")
      // Keeping type as String to accommodate text values like "Monaco" or numbers.
      numberOfOwners: String,
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