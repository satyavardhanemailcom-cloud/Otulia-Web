require("dotenv").config();
const mongoose = require("mongoose");
const VehicleAsset = require("../models/VehicleAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const carImages = [
  "https://images.unsplash.com/photo-1549924231-f129b911e442",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
];

const estateImages = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  "https://images.unsplash.com/photo-1572120360610-d971b9b78825",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const vehicleResult = await VehicleAsset.updateMany(
      {
        $or: [
          { images: { $size: 0 } },
          { images: ["https://dummyimage.com/600x400/000/fff"] }
        ]
      },
      { $set: { images: carImages } }
    );

    const estateResult = await EstateAsset.updateMany(
      {
        $or: [
          { images: { $size: 0 } },
          { images: ["https://dummyimage.com/600x400/222/fff"] }
        ]
      },
      { $set: { images: estateImages } }
    );

    console.log("✅ Vehicle images updated:", vehicleResult.modifiedCount);
    console.log("✅ Estate images updated:", estateResult.modifiedCount);

    process.exit();
  } catch (err) {
    console.error("❌ Image update error", err);
    process.exit(1);
  }
};

run();
