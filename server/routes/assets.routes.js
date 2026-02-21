const authMiddleware = require("../middleware/auth.middleware");
const mongoose = require("mongoose");
const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");
const Listing = require("../models/Listing.model");
const User = require("../models/User.model");

const axios = require("axios");
const router = express.Router();

/**
 * CAR ASSETS
 * /api/assets/cars
 */
router.get("/cars", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, model, category, country, sort, acquisition } = req.query;

    console.log("--- /api/assets/cars Request ---");
    console.log("req.query:", req.query);

    let query = { status: 'Active' };
    const andClauses = [];

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      andClauses.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { brand: searchRegex },
          { 'specification.model': searchRegex },
          { keywords: searchRegex },
          { location: searchRegex },
          { 'specification.body': searchRegex },
          { 'specification.fuel': searchRegex },
          { 'specification.transmission': searchRegex },
          { 'specification.exteriorColor': searchRegex },
          { 'specification.engineType': searchRegex },
        ]
      });
    }

    if (type) andClauses.push({ type: type });
    if (acquisition) {
      if (acquisition === 'buy') {
        andClauses.push({ acquisition: { $in: ['buy', 'rent/buy'] } });
      } else if (acquisition === 'rent') {
        andClauses.push({ acquisition: { $in: ['rent', 'rent/buy'] } });
      }
    }
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      if (locations.length > 0) {
        andClauses.push({
          $or: locations.map(loc => ({ location: { $regex: loc.trim(), $options: "i" } }))
        });
      }
    }
    if (brand) andClauses.push({ brand: brand });
    if (model) andClauses.push({ 'specification.model': { $regex: model, $options: "i" } });
    if (category) andClauses.push({ category: { $regex: category, $options: "i" } });

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      andClauses.push({ price: priceQuery });
    }

    if (andClauses.length > 0) {
      query.$and = andClauses;
    }

    console.log("andClauses:", JSON.stringify(andClauses, null, 2));
    console.log("Final Mongoose Query:", JSON.stringify(query, null, 2));

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const data = await CarAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    console.log("Results count:", data.length);
    res.json(data);
  } catch (err) {
    console.error("Error in /api/assets/cars:", err);
    res.status(500).json({ message: "Failed to fetch vehicle assets" });
  }
});

/**
 * ESTATE ASSETS
 * /api/assets/estates
 */
router.get("/estates", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12, type, minPrice, maxPrice, location, bedrooms, bathrooms, propertyType, sort, acquisition, country } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Filter only Active (Public) assets
    query.status = 'Active';

    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      if (locations.length > 0) {
        query.$or = locations.map(loc => ({ location: { $regex: loc.trim(), $options: "i" } }));
      }
    }

    if (propertyType) query['keySpecifications.propertyType'] = propertyType;
    if (bedrooms) {
      // Handle "3+" logic or exact match. For simplcity assume exact or gte if string contains +
      if (bedrooms.includes('+')) {
        query['specification.bedrooms'] = { $gte: Number(bedrooms.replace('+', '')) };
      } else if (bedrooms !== 'Any') {
        query['specification.bedrooms'] = Number(bedrooms);
      }
    }
    if (bathrooms) {
      if (bathrooms.includes('+')) {
        query['specification.bathrooms'] = { $gte: Number(bathrooms.replace('+', '')) };
      } else if (bathrooms !== 'Any') {
        query['specification.bathrooms'] = Number(bathrooms);
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const data = await EstateAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch estate assets" });
  }
});

/**
 * BIKE ASSETS
 * /api/assets/bikes
 */
router.get("/bikes", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, model, sort, acquisition, country } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Filter only Active (Public) assets
    query.status = 'Active';

    if (type) query.type = type;
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      if (locations.length > 0) {
        query.$or = locations.map(loc => ({ location: { $regex: loc.trim(), $options: "i" } }));
      }
    }
    if (brand) query.brand = brand;
    if (model) query['specification.model'] = { $regex: model, $options: "i" };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const data = await BikeAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bike assets" });
  }
});

/**
 * YACHT ASSETS
 * /api/assets/yachts
 */
router.get("/yachts", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, model, sort, acquisition, country } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Filter only Active (Public) assets
    query.status = 'Active';

    if (type) query.type = type;
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      if (locations.length > 0) {
        query.$or = locations.map(loc => ({ location: { $regex: loc.trim(), $options: "i" } }));
      }
    }
    if (brand) query.brand = brand;
    if (model) query['specification.model'] = { $regex: model, $options: "i" };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const data = await YachtAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch yacht assets" });
  }
});

/**
 * ALL CAR ASSETS
 * /api/assets/all/cars
 */
router.get("/all/cars", async (req, res) => {
  try {
    const data = await CarAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
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
    const data = await EstateAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all estate assets" });
  }
});

/**
 * ALL BIKE ASSETS
 * /api/assets/all/bikes
 */
router.get("/all/bikes", async (req, res) => {
  try {
    const data = await BikeAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all bike assets" });
  }
});

/**
 * ALL YACHT ASSETS (NEW ENDPOINT)
 * /api/assets/all/yachts
 */
router.get("/all/yachts", async (req, res) => {
  try {
    const data = await YachtAsset.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all yacht assets" });
  }
});

/**
 * FETCH SINGLE CAR ASSET BY ID
 * /api/assets/car/:id
 */
router.get("/car/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid car asset ID" });
    }

    const asset = await CarAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Car asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching car asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch car asset" });
  }
});

/**
 * FETCH SINGLE ESTATE ASSET BY ID
 * /api/assets/estate/:id
 */
router.get("/estate/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid estate asset ID" });
    }

    const asset = await EstateAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Estate asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching estate asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch estate asset" });
  }
});

/**
 * FETCH SINGLE BIKE ASSET BY ID
 * /api/assets/bike/:id
 */
router.get("/bike/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid bike asset ID" });
    }

    const asset = await BikeAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Bike asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching bike asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch bike asset" });
  }
});

/**
 * FETCH SINGLE YACHT ASSET BY ID
 * /api/assets/yacht/:id
 */
router.get("/yacht/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid yacht asset ID" });
    }

    const asset = await YachtAsset.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) {
      return res.status(404).json({ message: "Yacht asset not found" });
    }

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching yacht asset by ID:", error);
    res.status(500).json({ message: "Failed to fetch yacht asset" });
  }
});

/**
 * ASSET DETAIL
 * /api/assets/:type/:id
 */
router.get("/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid asset ID" });
    }

    let Model;

    if (type === "cars") Model = CarAsset;
    else if (type === "estates") Model = EstateAsset;
    else if (type === "bikes") Model = BikeAsset;
    else if (type === "yachts") Model = YachtAsset;
    else return res.status(400).json({ message: "Invalid asset type" });

    const asset = await Model.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });

    if (!asset) return res.status(404).json({ message: "Asset not found" });

    const assetObj = asset.toObject();
    if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
      const agentUser = await User.findById(assetObj.agent.id);
      if (agentUser) {
        assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
        assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
        if (agentUser.company) {
          assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
          assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
        }
      }
    }

    res.json(assetObj);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch asset detail" });
  }
});

/**
 * LIKE ASSET
 * /api/assets/:type/:id/like
 */
router.post("/:type/:id/like", authMiddleware, async (req, res) => {
  try {
    const { type, id } = req.params;

    let asset;

    if (type === "cars") {
      asset = await CarAsset.findById(id);
    } else if (type === "estates") {
      asset = await EstateAsset.findById(id);
    } else if (type === "bikes") {
      asset = await BikeAsset.findById(id);
    } else if (type === "yachts") {
      asset = await YachtAsset.findById(id);
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
    const { q, page = 1, limit = 12, type, minPrice, maxPrice, location } = req.query;

    let searchQuery = {};
    if (q) {
      const words = q.split(' ').filter(word => word.length > 0);

      const andQuery = words.map(word => {
        const searchRegex = { $regex: word, $options: "i" };
        return {
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex },
            { brand: searchRegex },
            { 'highlights': searchRegex },
            { 'keywords': searchRegex },
            { category: searchRegex },
            { type: searchRegex },
            { 'specification.model': searchRegex },
            { 'keySpecifications.propertyType': searchRegex },
            { 'specification.propertyType': searchRegex },
            { 'specification.architectureStyle': searchRegex },
            { 'specification.country': searchRegex },
            { 'specification.city': searchRegex },
            { 'specification.body': searchRegex },
            { 'specification.fuelType': searchRegex },
            { 'specification.transmission': searchRegex },
            { 'specification.exteriorColor': searchRegex },
            { 'specification.engineType': searchRegex },
            { 'specification.yachtType': searchRegex },
            { builder: searchRegex },
            { 'amenities': searchRegex },
          ]
        };
      });

      searchQuery = { $or: andQuery };
    }

    const query = { ...searchQuery, status: 'Active' };

    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const [carAssets, estateAssets, bikeAssets, yachtAssets, otherAssets] =
      await Promise.all([
        CarAsset.find(query)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        EstateAsset.find(query)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        BikeAsset.find(query)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        YachtAsset.find(query)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        Listing.find(query)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
      ]);

    const combinedAssets = [
      ...carAssets,
      ...estateAssets,
      ...bikeAssets,
      ...yachtAssets,
      ...otherAssets,
    ];

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
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      query.acquisition = { $in: acquisition.toLowerCase().split(',') };
    }

    const data = await CarAsset.find(query)
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
    const data = await EstateAsset.find({ status: 'Active' })
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all estate assets" });
  }
});

/**
 * ALL BIKE ASSETS (NEW ENDPOINT)
 * /api/assets/bike
 */
router.get("/bike", async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const data = await BikeAsset.find({ status: 'Active' })
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all bike assets" });
  }
});

/**
 * ALL YACHT ASSETS (NEW ENDPOINT)
 * /api/assets/yacht
 */
router.get("/yacht", async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const data = await YachtAsset.find({ status: 'Active' })
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all yacht assets" });
  }
});

/**
 * SEARCH SUGGESTIONS
 * /api/assets/suggestions
 */
router.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    // 1. Fetch suggestions from Google's unofficial API
    const googleApiUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=&q=${encodeURIComponent(q)}`;
    let googleSuggestions = [];
    try {
      const response = await axios.get(googleApiUrl);
      if (response.data && Array.isArray(response.data) && response.data.length > 1) {
        googleSuggestions = response.data[1];
      }
    } catch (apiErr) {
      console.error("Google Suggestion API Error:", apiErr.message);
      // Don't fail the request, just proceed with local suggestions
    }

    // 2. Fetch suggestions from the local database (as a supplement)
    const searchRegex = { $regex: `^${q}`, $options: "i" };
    const [brands, titles, models] = await Promise.all([
      CarAsset.find({ brand: searchRegex }).limit(5),
      CarAsset.find({ title: searchRegex }).limit(5),
      CarAsset.find({ 'specification.model': searchRegex }).limit(5),
      BikeAsset.find({ brand: searchRegex }).limit(5),
      BikeAsset.find({ title: searchRegex }).limit(5),
      BikeAsset.find({ 'specification.model': searchRegex }).limit(5),
      YachtAsset.find({ brand: searchRegex }).limit(5),
      YachtAsset.find({ title: searchRegex }).limit(5),
      YachtAsset.find({ 'specification.model': searchRegex }).limit(5),
      EstateAsset.find({ title: searchRegex }).limit(5)
    ]);

    const localSuggestions = {};
    const processAssets = (assets, field, type) => {
      assets.forEach(asset => {
        const value = asset[field] || (asset.specification && asset.specification.model);
        if (value && !localSuggestions[value]) {
          localSuggestions[value] = { value, type };
        }
      });
    };

    processAssets(brands, 'brand', 'Brand');
    processAssets(titles, 'title', 'Asset');
    processAssets(models, 'model', 'Model');

    // 3. Combine, deduplicate, and send
    const combined = [...googleSuggestions.map(s => ({ value: s, type: 'Global' })), ...Object.values(localSuggestions)];
    const uniqueValues = {};
    const uniqueSuggestions = [];

    for (const suggestion of combined) {
      if (!uniqueValues[suggestion.value]) {
        uniqueValues[suggestion.value] = true;
        uniqueSuggestions.push(suggestion);
      }
    }

    res.json(uniqueSuggestions.slice(0, 10));

  } catch (err) {
    console.error("Suggestions Error:", err);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});

/**
 * LOCATION SUGGESTIONS
 * /api/assets/location-suggestions
 */
router.get("/location-suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const photonApiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en`;

    try {
      const response = await axios.get(photonApiUrl);
      if (response.data && response.data.features) {
        const suggestions = response.data.features.map(feature => {
          const { name, city, country } = feature.properties;
          let suggestion = name;
          if (city && name !== city) {
            suggestion += `, ${city}`;
          }
          if (country && name !== country && city !== country) {
            suggestion += `, ${country}`;
          }
          return suggestion;
        });
        return res.json(suggestions);
      }
    } catch (apiErr) {
      console.error("Photon API Error:", apiErr.message);
      // Fallback to local search if Photon API fails
    }

    // Fallback to local database search
    const searchRegex = { $regex: q, $options: "i" };
    const [carLocations, estateLocations, bikeLocations, yachtLocations] = await Promise.all([
      CarAsset.distinct("location", { location: searchRegex }),
      EstateAsset.distinct("location", { location: searchRegex }),
      BikeAsset.distinct("location", { location: searchRegex }),
      YachtAsset.distinct("location", { location: searchRegex }),
    ]);

    const combinedLocations = [
      ...carLocations,
      ...estateLocations,
      ...bikeLocations,
      ...yachtLocations,
    ];

    const uniqueLocations = [...new Set(combinedLocations)];

    res.json(uniqueLocations.slice(0, 10));

  } catch (err) {
    console.error("Location Suggestions Error:", err);
    res.status(500).json({ message: "Failed to fetch location suggestions" });
  }
});

module.exports = router;