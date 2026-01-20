require("dotenv").config();
const mongoose = require("mongoose");
const EstateAsset = require("../models/EstateAsset.model");

const seedEstateAssets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await EstateAsset.deleteMany();

    await EstateAsset.insertMany([
      {
        title: "Luxury Beach Villa",
        description: "Premium villa with sea view",
        price: 25000000,
        location: "Goa",
        images: ["https://dummyimage.com/600x400/222/fff"],
        isTrending: true,
        popularity: 9,
        likes: 200,
      },
      {
        title: "Penthouse Apartment",
        description: "High-rise luxury penthouse",
        price: 18000000,
        location: "Bangalore",
        images: ["https://dummyimage.com/600x400/333/fff"],
        popularity: 7,
        likes: 140,
      },
    ]);

    console.log("✅ Estate assets seeded");
    process.exit();
  } catch (err) {
    console.error("❌ Estate seed error", err);
    process.exit(1);
  }
};

seedEstateAssets();
