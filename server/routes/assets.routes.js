const authMiddleware = require("../middleware/auth.middleware");

const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");

const router = express.Router();

/**
 * VEHICLE ASSETS
 * /api/assets/vehicles
 * Supports: ?search=&page=&limit=
 */
/**
 * VEHICLE ASSETS
 * /api/assets/cars
 */
router.get("/cars", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12, type, minPrice, maxPrice, location, brand, model, category, country, sort, acquisition } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Filter only Active (Public) assets
    query.status = 'Active';

    if (type) query.type = type;
    if (acquisition) {
        if (acquisition === 'buy') {
            query.acquisition = {$in: ['buy', 'rent/buy']};
        } else if (acquisition === 'rent') {
            query.acquisition = {$in: ['rent', 'rent/buy']};
        }
    }
    if (location) query.location = { $regex: location, $options: "i" };
    // Country is typically part of location or separate. If separate:
    if (country) query.location = { $regex: country, $options: "i" };
    if (brand) query.brand = brand;
    if (model) query['specification.model'] = { $regex: model, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" }; // or specific field

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };

    const data = await CarAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vehicle assets" });
  }
});

/**
 * ESTATE ASSETS
 * /api/assets/estates
 */
router.get("/estates", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12, type, minPrice, maxPrice, location, bedrooms, bathrooms, propertyType, sort, acquisition } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Filter only Active (Public) assets
    query.status = 'Active';

    if (type) query.type = type; // Sale/Rent
    if (acquisition) {
        if (acquisition === 'buy') {
            query.acquisition = {$in: ['buy', 'rent/buy']};
        } else if (acquisition === 'rent') {
            query.acquisition = {$in: ['rent', 'rent/buy']};
        }
    }
    if (location) query.location = { $regex: location, $options: "i" };

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
    const { search = "", page = 1, limit = 12, type, minPrice, maxPrice, location, brand, model, sort } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Filter only Active (Public) assets
    query.status = 'Active';

    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };
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
    const { search = "", page = 1, limit = 12, type, minPrice, maxPrice, location, brand, model, sort } = req.query;

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Filter only Active (Public) assets
    query.status = 'Active';

    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };
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
 * ALL YACHT ASSETS
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
    let asset = await CarAsset.findById(id);

    if (!asset) {
      return res.status(404).json({ message: "Car asset not found" });
    }

    // Increment views, similar to the existing /:type/:id route
    asset.views += 1;
    await asset.save();

    res.json(asset);
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
    let asset = await EstateAsset.findById(id);

    if (!asset) {
      return res.status(404).json({ message: "Estate asset not found" });
    }

    // Increment views
    asset.views += 1;
    await asset.save();

    res.json(asset);
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
    let asset = await BikeAsset.findById(id);

    if (!asset) {
      return res.status(404).json({ message: "Bike asset not found" });
    }

    // Increment views
    asset.views += 1;
    await asset.save();

    res.json(asset);
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
    let asset = await YachtAsset.findById(id);

    if (!asset) {
      return res.status(404).json({ message: "Yacht asset not found" });
    }

    // Increment views
    asset.views += 1;
    await asset.save();

    res.json(asset);
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
        const processedWord = word.toLowerCase().endsWith('s') ? word.slice(0, -1) : word;
        const searchRegex = { $regex: processedWord, $options: "i" };
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

      searchQuery = { $and: andQuery };
    }

    const query = { ...searchQuery, status: 'Active' };

    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const [carAssets, estateAssets, bikeAssets, yachtAssets] =
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
      ]);

    const combinedAssets = [
      ...carAssets,
      ...estateAssets,
      ...bikeAssets,
      ...yachtAssets,
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

    const searchRegex = { $regex: q, $options: "i" };

    const [carTitles, estateTitles, bikeTitles, yachtTitles, carBrands, bikeBrands, yachtBrands, categories, locations] = await Promise.all([
      CarAsset.distinct("title", { title: searchRegex }),
      EstateAsset.distinct("title", { title: searchRegex }),
      BikeAsset.distinct("title", { title: searchRegex }),
      YachtAsset.distinct("title", { title: searchRegex }),
      CarAsset.distinct("brand", { brand: searchRegex }),
      BikeAsset.distinct("brand", { brand: searchRegex }),
      YachtAsset.distinct("brand", { brand: searchRegex }),
      CarAsset.distinct("category", { category: searchRegex }),
      EstateAsset.distinct("location", { location: searchRegex }),
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
      ...locations,
    ];

    const uniqueSuggestions = [...new Set(suggestions)];

    res.json(uniqueSuggestions.slice(0, 10));
  } catch (err) {
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

    res.json(uniqueLocations.slice(0, 10)); // Limit to 10 suggestions
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch location suggestions" });
  }
});

module.exports = router;
