const authMiddleware = require("../middleware/auth.middleware");
const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const YachtAsset = require("../models/YachtAsset.model");
const BikeAsset = require("../models/BikeAsset.model");

const router = express.Router();

/**
 * SINGULAR ASSET LISTS (NEW ENDPOINTS)
 */
router.get("/yacht", async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const data = await YachtAsset.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all yacht assets" });
  }
});

router.get("/bike", async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const data = await BikeAsset.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all bike assets" });
  }
});

router.get("/car", async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const data = await CarAsset.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all car assets" });
  }
});

router.get("/estate", async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const data = await EstateAsset.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all estate assets" });
  }
});

/**
 * LEGACY/OTHER ASSETS
 */
router.get("/vehicles", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12 } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const data = await CarAsset.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vehicle assets" });
  }
});

router.get("/estates", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12 } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const data = await EstateAsset.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch estate assets" });
  }
});

/**
 * SINGLE ASSET BY ID
 */
router.get("/car/:id", async (req, res) => {
  try {
    const asset = await CarAsset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Car asset not found" });
    asset.views += 1;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch car asset" });
  }
});

router.get("/estate/:id", async (req, res) => {
  try {
    const asset = await EstateAsset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Estate asset not found" });
    asset.views += 1;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch estate asset" });
  }
});

router.get("/yacht/:id", async (req, res) => {
  try {
    const asset = await YachtAsset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Yacht asset not found" });
    asset.views += 1;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch yacht asset" });
  }
});

router.get("/bike/:id", async (req, res) => {
  try {
    const asset = await BikeAsset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Bike asset not found" });
    asset.views += 1;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bike asset" });
  }
});

/**
 * GENERIC ASSET DETAIL (/:type/:id)
 */
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    let asset;
    if (type === "vehicles" || type === "car") asset = await CarAsset.findById(id);
    else if (type === "estates" || type === "estate") asset = await EstateAsset.findById(id);
    else if (type === "yachts" || type === "yacht") asset = await YachtAsset.findById(id);
    else if (type === "bikes" || type === "bike") asset = await BikeAsset.findById(id);
    else return res.status(400).json({ message: "Invalid asset type" });

    if (!asset) return res.status(404).json({ message: "Asset not found" });
    asset.views += 1;
    await asset.save();
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch asset detail" });
  }
});

/**
 * LIKE
 */
router.post("/:type/:id/like", authMiddleware, async (req, res) => {
  try {
    const { type, id } = req.params;
    let asset;
    if (type === "vehicles" || type === "car") asset = await CarAsset.findById(id);
    else if (type === "estates" || type === "estate") asset = await EstateAsset.findById(id);
    else if (type === "yachts" || type === "yacht") asset = await YachtAsset.findById(id);
    else if (type === "bikes" || type === "bike") asset = await BikeAsset.findById(id);
    else return res.status(400).json({ message: "Invalid asset type" });

    if (!asset) return res.status(404).json({ message: "Asset not found" });
    asset.likes += 1;
    await asset.save();
    res.json({ message: "Liked successfully", likes: asset.likes });
  } catch (error) {
    res.status(500).json({ message: "Failed to like asset" });
  }
});

module.exports = router;
