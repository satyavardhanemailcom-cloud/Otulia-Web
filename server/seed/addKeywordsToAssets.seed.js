require("dotenv").config();
const mongoose = require("mongoose");
const VehicleAsset = require("../models/VehicleAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const normalize = (text = "") =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ");

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // ---------- VEHICLES ----------
    const vehicles = await VehicleAsset.find();

    for (const v of vehicles) {
      const keywords = new Set([
        "vehicle",
        "car",
        "luxury",
        ...normalize(v.title),
        ...normalize(v.brand),
        ...normalize(v.location),
      ]);

      v.keywords = Array.from(keywords);
      await v.save();
    }

    // ---------- ESTATES ----------
    const estates = await EstateAsset.find();

    for (const e of estates) {
      const keywords = new Set([
        "estate",
        "property",
        "luxury",
        ...normalize(e.title),
        ...normalize(e.location),
      ]);

      e.keywords = Array.from(keywords);
      await e.save();
    }

    console.log("✅ Keywords added to all assets");
    process.exit();
  } catch (err) {
    console.error("❌ Keyword migration error", err);
    process.exit(1);
  }
};

run();
