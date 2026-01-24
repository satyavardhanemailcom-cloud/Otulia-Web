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

        keySpecifications: {
            power: String,
            mileage: String, // Or top speed
            cylinderCapacity: String // engine capacity
        },

        specification: {
            yearOfConstruction: String,
            model: String,
            engine: String,
            power: String,
            torque: String,
            weight: String,
            topSpeed: String,
            transmission: String,
            fuelType: String,
            condition: String,
            usageStatus: String,
            numberOfOwners: Number,
            location: String,
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

        category: { type: String, default: "Bike" },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        popularity: { type: Number, default: 0 },
        keywords: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("BikeAsset", bikeAssetSchema);
