const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [carAssets, estateAssets] = await Promise.all([
      CarAsset.find(),
      EstateAsset.find(),
    ]);

    const combinedAssets = [...carAssets, ...estateAssets];

    const popularAssets = combinedAssets
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    res.json(popularAssets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch popular assets" });
  }
});

module.exports = router;
