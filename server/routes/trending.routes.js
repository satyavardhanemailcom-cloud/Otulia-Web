const express = require("express");
const VehicleAsset = require("../models/VehicleAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [vehicleAssets, estateAssets] = await Promise.all([
      VehicleAsset.find({ isTrending: true }).limit(5),
      EstateAsset.find({ isTrending: true }).limit(5),
    ]);

    const combinedAssets = [...vehicleAssets, ...estateAssets];

    res.json(combinedAssets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending assets" });
  }
});

module.exports = router;
