const express = require("express");
const YachtAsset = require("../models/YachtAsset.model");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const router = express.Router();
router.get("/", async (req, res) => {
    const data = await YachtAsset.find();
    res.json(data);
});

router.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const searchRegex = { $regex: `^${q}`, $options: "i" };

    const [carTitles, estateTitles, bikeTitles, yachtTitles, carBrands, bikeBrands, yachtBrands, categories] = await Promise.all([
      CarAsset.distinct("title", { title: searchRegex }),
      EstateAsset.distinct("title", { title: searchRegex }),
      BikeAsset.distinct("title", { title: searchRegex }),
      YachtAsset.distinct("title", { title: searchRegex }),
      CarAsset.distinct("brand", { brand: searchRegex }),
      BikeAsset.distinct("brand", { brand: searchRegex }),
      YachtAsset.distinct("brand", { brand: searchRegex }),
      CarAsset.distinct("category", { category: searchRegex }),
    ]);

    const suggestions = [
      ...carTitles,
      ...estateTitles,
      ...bikeTitles,
      ...yachtTitles,
      ...carBrands,
      ...bikeBrands,
      ...yachtBrands,
      ...categories,
    ];

    const uniqueSuggestions = [...new Set(suggestions)];

    res.json(uniqueSuggestions.slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});

module.exports = router;
