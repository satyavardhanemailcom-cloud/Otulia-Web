const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [carAssets, estateAssets] = await Promise.all([
      CarAsset.find({ isTrending: true }).limit(5),
      EstateAsset.find({ isTrending: true }).limit(5),
    ]);

    const combinedAssets = [...carAssets, ...estateAssets];

    res.json(combinedAssets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending assets" });
  }
});

module.exports = router;
