require("dotenv").config();
const mongoose = require("mongoose");
const EstateAsset = require("../models/EstateAsset.model");

const seedEstateAssets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingCount = await EstateAsset.countDocuments();

    if (existingCount >= 20) {
      // Estate assets already sufficient
      process.exit();
    }

    const estatesToAdd = [];

    for (let i = existingCount; i < 20; i++) {
      const isTrending = i < 5;

      estatesToAdd.push({
        title: `Luxury Estate ${i + 1}`,
        description: "Premium real estate property",
        price: 12000000 + i * 500000,
        location: i % 2 === 0 ? "Goa" : "Bangalore",
        images: ["https://dummyimage.com/600x400/222/fff"],
        isTrending,
        popularity: isTrending ? 7 + (i % 3) : 3 + (i % 3),
        likes: isTrending ? 80 + i * 8 : 10 + i * 2,
        views: isTrending ? 600 + i * 120 : 80 + i * 25,
        acquisition: 'buy',
      });
    }

    if (estatesToAdd.length > 0) {
      await EstateAsset.insertMany(estatesToAdd);
      // Estate assets extended to 20
    } else {
      // No estate assets added
    }

    process.exit();
  } catch (err) {
    console.error("❌ Estate seed error", err);
    process.exit(1);
  }
};

seedEstateAssets();
