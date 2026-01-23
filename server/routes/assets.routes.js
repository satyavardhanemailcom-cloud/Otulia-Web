const authMiddleware = require("../middleware/auth.middleware");

const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const router = express.Router();

/**
 * VEHICLE ASSETS
 * /api/assets/vehicles
 * Supports: ?search=&page=&limit=
 */
router.get("/vehicles", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12 } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const data = await CarAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vehicle assets" });
  }
});

/**
 * ESTATE ASSETS
 * /api/assets/estates
 * Supports: ?search=&page=&limit=
 */
router.get("/estates", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12 } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const data = await EstateAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch estate assets" });
  }
});

/**
 * ALL CAR ASSETS
 * /api/assets/all/cars
 */
router.get("/all/cars", async (req, res) => {
  try {
    const data = await CarAsset.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all car assets" });
  }
});

/**
 * ALL ESTATE ASSETS
 * /api/assets/all/estates
 */
router.get("/all/estates", async (req, res) => {
  try {
    const data = await EstateAsset.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all estate assets" });
  }
});

/**
 * ASSET DETAIL
 * /api/assets/:type/:id
 */
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    let asset;

    if (type === "vehicles") {
      asset = await CarAsset.findById(id);
    } else if (type === "estates") {
      asset = await EstateAsset.findById(id);
    } else {
      return res.status(400).json({ message: "Invalid asset type" });
    }

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // 👀 increment views
    asset.views += 1;
    await asset.save();

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch asset detail" });
  }
});

/**
 * LIKE ASSET
 * /api/assets/:type/:id/like
 */
router.post("/:type/:id/like", authMiddleware,  async (req, res) => {
  try {
    const { type, id } = req.params;

    let asset;

    if (type === "vehicles") {
      asset = await CarAsset.findById(id);
    } else if (type === "estates") {
      asset = await EstateAsset.findById(id);
    } else {
      return res.status(400).json({ message: "Invalid asset type" });
    }

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // ❤️ increment likes
    asset.likes += 1;

    // 🔥 optional popularity logic
    if (asset.likes % 10 === 0 && asset.popularity < 10) {
      asset.popularity += 1;
    }

    await asset.save();

    res.json({
      message: "Liked successfully",
      likes: asset.likes,
      popularity: asset.popularity,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to like asset" });
  }
});

/**
 * COMBINED ASSETS
 * /api/assets/combined
 * Supports: ?search=&page=&limit=
 */
router.get("/combined", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12 } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const [carAssets, estateAssets] = await Promise.all([
      CarAsset.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      EstateAsset.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
    ]);

    const combinedAssets = [...carAssets, ...estateAssets];

    // Optionally, sort the combined assets by createdAt if needed
    combinedAssets.sort((a, b) => b.createdAt - a.createdAt);


    res.json(combinedAssets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch combined assets" });
  }
});

/**
 * ALL CAR ASSETS (NEW ENDPOINT)
 * /api/assets/car
 */
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

/**
 * ALL ESTATE ASSETS (NEW ENDPOINT)
 * /api/assets/estate
 */
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

module.exports = router;
