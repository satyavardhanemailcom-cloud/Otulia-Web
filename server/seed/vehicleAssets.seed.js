require("dotenv").config();
const mongoose = require("mongoose");
const VehicleAsset = require("../models/VehicleAsset.model");

const seedVehicleAssets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await VehicleAsset.deleteMany();

    await VehicleAsset.insertMany([
      {
        title: "BMW X5 2022",
        description: "Luxury SUV with premium features",
        price: 4500000,
        location: "Delhi",
        images: ["https://dummyimage.com/600x400/000/fff"],
        brand: "BMW",
        isTrending: true,
        popularity: 8,
        likes: 120,
      },
      {
        title: "Lamborghini Urus",
        description: "High performance luxury SUV",
        price: 12000000,
        location: "Mumbai",
        images: ["https://dummyimage.com/600x400/111/fff"],
        brand: "Lamborghini",
        popularity: 10,
        likes: 300,
      },
    ]);

    console.log("✅ Vehicle assets seeded");
    process.exit();
  } catch (err) {
    console.error("❌ Vehicle seed error", err);
    process.exit(1);
  }
};

seedVehicleAssets();
