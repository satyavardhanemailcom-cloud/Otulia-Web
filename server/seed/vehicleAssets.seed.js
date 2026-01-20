require("dotenv").config();
const mongoose = require("mongoose");
const VehicleAsset = require("../models/VehicleAsset.model");

const seedVehicleAssets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingCount = await VehicleAsset.countDocuments();

    if (existingCount >= 20) {
      console.log("ℹ️ Vehicle assets already sufficient:", existingCount);
      process.exit();
    }

    const vehiclesToAdd = [];

    for (let i = existingCount; i < 20; i++) {
      const isTrending = i < 6;

      vehiclesToAdd.push({
        title: `Luxury Car ${i + 1}`,
        description: "High-end luxury vehicle",
        price: 4000000 + i * 150000,
        location: i % 2 === 0 ? "Mumbai" : "Delhi",
        images: ["https://dummyimage.com/600x400/000/fff"],
        brand: i % 2 === 0 ? "BMW" : "Mercedes",
        isTrending,
        popularity: isTrending ? 8 + (i % 3) : 4 + (i % 3),
        likes: isTrending ? 100 + i * 10 : 15 + i * 2,
        views: isTrending ? 800 + i * 100 : 100 + i * 20,
      });
    }

    if (vehiclesToAdd.length > 0) {
      await VehicleAsset.insertMany(vehiclesToAdd);
      console.log("✅ Vehicle assets extended to 20");
    } else {
      console.log("ℹ️ No vehicle assets added");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Vehicle seed error", err);
    process.exit(1);
  }
};

seedVehicleAssets();
