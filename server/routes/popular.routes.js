const express = require("express");
const VehicleAsset = require("../models/VehicleAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [vehicleAssets, estateAssets] = await Promise.all([
      VehicleAsset.find(),
      EstateAsset.find(),
    ]);

    const combinedAssets = [...vehicleAssets, ...estateAssets];

    const popularAssets = combinedAssets
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    res.json(popularAssets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch popular assets" });
  }
});

module.exports = router;
