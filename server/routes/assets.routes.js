const authMiddleware = require("../middleware/auth.middleware");
const mongoose = require("mongoose");
const express = require("express");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const YachtAsset = require("../models/YachtAsset.model");
const Listing = require("../models/Listing.model");
const User = require("../models/User.model");
const { incrementPopularity } = require("../utils/popularityUpdater");
const carFilterOptions = require("../../client/src/json/car_filter_options.json");

const axios = require("axios");
const router = express.Router();
const catalogCache = new Map();
const CATALOG_API = "https://fleetcatalog.disturbingbyte.pt/v1";
const CATALOG_CACHE_TTL_MS = 60 * 60 * 1000;

const escapeRegex = (value) => String(value || "").replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
const mergeCanonicalValues = (...groups) => {
  const values = new Map();
  groups.flat().filter((value) => typeof value === "string" && value.trim()).forEach((value) => {
    const trimmed = value.trim();
    const key = trimmed.toLocaleLowerCase();
    if (!values.has(key)) values.set(key, trimmed);
  });
  return [...values.values()].sort((a, b) => a.localeCompare(b));
};

const cleanTaxonomyValues = (values, { maxWords, knownBrands = [] }) => {
  const canonicalBrands = knownBrands.map((brand) => brand.toLocaleLowerCase());
  return mergeCanonicalValues(values).filter((value) => {
    const normalized = value.replace(/\s+/g, " ").trim();
    const wordCount = normalized.split(" ").filter(Boolean).length;
    if (!normalized || normalized.length > 72 || wordCount > maxWords) return false;
    if (/[|\r\n]/.test(normalized) || /\b(?:by|warranty|service|for sale|price on request|verified dealer|listed by)\b/i.test(normalized)) return false;
    return !canonicalBrands.some((knownBrand) => normalized.toLocaleLowerCase().startsWith(`${knownBrand} `));
  });
};

const getCachedCatalogItems = async (cacheKey, url) => {
  const cached = catalogCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.items;
  const { data } = await axios.get(url, { timeout: 6000 });
  const items = Array.isArray(data?.items) ? data.items : [];
  catalogCache.set(cacheKey, { items, total: Number(data?.total) || items.length, expiresAt: Date.now() + CATALOG_CACHE_TTL_MS });
  return items;
};

const getCatalogMakes = async () => {
  const firstPage = await getCachedCatalogItems(
    "makes:1",
    `${CATALOG_API}/makes?page=1&pageSize=100`,
  );
  const cached = catalogCache.get("makes:1");
  const totalPages = Math.ceil((cached?.total || firstPage.length) / 100);
  if (totalPages <= 1) return firstPage;
  const pages = await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => {
    const page = index + 2;
    return getCachedCatalogItems(`makes:${page}`, `${CATALOG_API}/makes?page=${page}&pageSize=100`);
  }));
  return [...firstPage, ...pages.flat()];
};

// Brand/model/variant suggestions combine the curated filter taxonomy with saved car listings.
router.get("/car-taxonomy", async (req, res) => {
  try {
    const staticBrands = Object.values(carFilterOptions).flatMap((group) => Object.keys(group));
    const staticBrandModels = Object.values(carFilterOptions).flatMap((group) => Object.entries(group));
    const brand = String(req.query.brand || "").trim();
    const model = String(req.query.model || "").trim();
    const brandRegex = brand ? new RegExp(`^${escapeRegex(brand)}$`, "i") : null;
    const modelRegex = model ? new RegExp(`^${escapeRegex(model)}$`, "i") : null;

    const [databaseBrands, databaseModels, databaseVariants] = await Promise.all([
      CarAsset.distinct("brand", req.query.activeOnly === "true" ? { status: "Active" } : {}),
      CarAsset.distinct("specification.model", brandRegex ? { brand: brandRegex } : {}),
      brandRegex && modelRegex
        ? Promise.all([
            CarAsset.distinct("variant", { brand: brandRegex, "specification.model": modelRegex }),
            CarAsset.distinct("specification.variant", { brand: brandRegex, "specification.model": modelRegex }),
          ]).then((groups) => groups.flat())
        : Promise.resolve([]),
    ]);

    const matchingStaticEntries = staticBrandModels.filter(([knownBrand]) => !brand || knownBrand.toLowerCase() === brand.toLowerCase());
    let catalogBrands = [];
    let catalogModels = [];
    let catalogVariants = [];
    try {
      catalogBrands = await getCatalogMakes();
      const matchingMake = brand && catalogBrands.find((entry) => entry.name?.toLowerCase() === brand.toLowerCase());
      if (matchingMake) {
        catalogModels = await getCachedCatalogItems(
          `models:${matchingMake.id}`,
          `${CATALOG_API}/makes/${encodeURIComponent(matchingMake.id)}/models?page=1&pageSize=100`,
        );
        const matchingModel = model && catalogModels.find((entry) => entry.name?.toLowerCase() === model.toLowerCase());
        if (matchingModel) {
          catalogVariants = await getCachedCatalogItems(
            `variants:${matchingModel.id}`,
            `${CATALOG_API}/models/${encodeURIComponent(matchingModel.id)}/variants?page=1&pageSize=100`,
          );
        }
      }
    } catch (catalogError) {
      // Keep inventory suggestions available if the external catalog is temporarily unavailable.
      console.warn("External vehicle catalog unavailable; using local suggestions:", catalogError.message);
    }

    const knownBrands = mergeCanonicalValues(staticBrands, catalogBrands.map((entry) => entry.name));
    const cleanDatabaseBrands = cleanTaxonomyValues(databaseBrands, { maxWords: 4, knownBrands });
    const models = mergeCanonicalValues(
      matchingStaticEntries.flatMap(([, entries]) => entries),
      cleanTaxonomyValues(databaseModels, { maxWords: 9, knownBrands: brand ? [brand] : [] }),
      cleanTaxonomyValues(catalogModels.map((entry) => entry.name), { maxWords: 9, knownBrands: brand ? [brand] : [] }),
    );
    const variants = mergeCanonicalValues(
      cleanTaxonomyValues(databaseVariants, { maxWords: 12, knownBrands: brand ? [brand] : [] }),
      catalogVariants.map((entry) => entry.name),
    );
    const brands = mergeCanonicalValues(knownBrands, cleanDatabaseBrands);
    res.json({ brands, models, variants, databaseBrands: cleanDatabaseBrands });
  } catch (error) {
    console.error("Error loading car taxonomy suggestions:", error);
    res.status(500).json({ message: "Could not load car suggestions" });
  }
});

// Search public landing pages with conjunctive brand/model/location filters.
router.get("/landing-listings", async (req, res) => {
  try {
    const {
      assetType,
      location,
      acquisition,
      brand,
      model,
      bodyType,
      transmission,
      fuelType,
      exteriorColor,
      country,
      region,
      propertyType,
      search,
      priceRange,
      bedrooms,
      bathrooms,
      architecture,
      amenities,
      category,
      year,
      sort,
      page = 1,
      limit = 9,
    } = req.query;
    if (!['car', 'estate'].includes(assetType)) {
      return res.status(400).json({ message: "Unsupported landing listing type" });
    }

    const Model = assetType === "car" ? CarAsset : EstateAsset;
    const conditions = [{ status: "Active", type: acquisition === "rent" ? "Rent" : "Sale" }];
    const makePattern = (value) => {
      const words = String(value).trim().replace(/-/g, " ").split(/\s+/).filter(Boolean);
      return new RegExp(words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[\\s-]+"), "i");
    };
    const addMatch = (fields, value) => {
      if (!value) return;
      const pattern = makePattern(value);
      conditions.push({ $or: fields.map((field) => ({ [field]: pattern })) });
    };

    if (assetType === "car") {
      addMatch(["brand", "title"], brand);
      addMatch(["specification.model", "title"], model);
      addMatch(["location", "specification.carLocation", "specification.countryOfFirstDelivery"], location);
      addMatch(["specification.body"], bodyType);
      addMatch(["specification.transmission"], transmission);
      addMatch(["specification.fuel", "specification.engineType"], fuelType);
      addMatch(["specification.exteriorColor", "specification.manufacturerColorCode"], exteriorColor);
      addMatch(["title", "description", "brand", "specification.model"], search);
      if (category && carFilterOptions[category]) {
        const categoryBrands = Object.keys(carFilterOptions[category]);
        conditions.push({
          $or: categoryBrands.flatMap((categoryBrand) => {
            const pattern = makePattern(categoryBrand);
            return [{ brand: pattern }, { title: pattern }];
          }),
        });
      }
      if (year) {
        let yearPattern;
        if (year === "2025+") yearPattern = "^(202[5-9]|20[3-9][0-9])";
        else if (year === "Before 2010") yearPattern = "^(19[0-9]{2}|200[0-9])";
        else yearPattern = `^(${year.replace(/[^0-9-]/g, "").split("-").filter(Boolean).join("|")})`;
        conditions.push({ "specification.yearOfConstruction": { $regex: yearPattern } });
      }
    } else {
      addMatch(["location", "specification.city", "specification.areaNeighborhood", "specification.address", "specification.country"], location);
      addMatch(["location", "specification.country", "specification.address"], country);
      addMatch(["location", "specification.city", "specification.areaNeighborhood", "specification.address"], region);
      addMatch(["keySpecifications.propertyType", "specification.propertyType", "title", "description", "keywords"], propertyType);
      if (bedrooms && bedrooms !== "Any") {
        const minimum = Number.parseInt(bedrooms, 10);
        if (Number.isFinite(minimum)) {
          conditions.push({ $or: [
            { "specification.bedrooms": { $gte: minimum } },
            { "keySpecifications.bedrooms": { $regex: `^\\s*${minimum}(?:\\D|$)`, $options: "i" } },
          ] });
        }
      }
      if (bathrooms && bathrooms !== "Any") {
        const minimum = Number.parseInt(bathrooms, 10);
        if (Number.isFinite(minimum)) {
          conditions.push({ $or: [
            { "specification.bathrooms": { $gte: minimum } },
            { "keySpecifications.bathrooms": { $regex: `^\\s*${minimum}(?:\\D|$)`, $options: "i" } },
          ] });
        }
      }
      addMatch(["specification.architectureStyle"], architecture);
      if (amenities) {
        const selectedAmenities = String(amenities).split(",").map((item) => item.trim()).filter(Boolean);
        if (selectedAmenities.length) {
          conditions.push({ amenities: { $in: selectedAmenities.map((item) => new RegExp(item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")) } });
        }
      }
    }

    if (priceRange) {
      const amounts = [...String(priceRange).matchAll(/\$?([\d,.]+)\s*([KkMm])?/g)]
        .map((match) => Number(match[1].replace(/,/g, "")) * (match[2]?.toUpperCase() === "M" ? 1_000_000 : match[2]?.toUpperCase() === "K" ? 1_000 : 1))
        .filter(Number.isFinite);
      if (amounts.length) {
        const price = {};
        if (String(priceRange).includes("+")) price.$gte = amounts[0];
        else {
          price.$gte = amounts[0];
          if (amounts[1]) price.$lte = amounts[1];
        }
        conditions.push({ price });
      }
    }

    if (conditions.length === 1) {
      return res.status(400).json({ message: "A landing listing filter is required" });
    }

    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(24, Math.max(1, Number.parseInt(limit, 10) || 9));
    const query = { $and: conditions };
    const sortOptions = sort === "Oldest" ? { createdAt: 1 }
      : sort === "Low to High" ? { price: 1 }
        : sort === "High to Low" ? { price: -1 }
          : { createdAt: -1 };
    const [total, data] = await Promise.all([
      Model.countDocuments(query),
      Model.find(query)
        .sort(sortOptions)
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),
    ]);

    if (assetType === "car") await syncAgentInfo(data);
    return res.json({
      data,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error("Error fetching landing listings:", error);
    return res.status(500).json({ message: "Failed to fetch landing listings" });
  }
});

// Helper to keep agent/dealer information in sync with User collection in database
const syncAgentInfo = async (assets) => {
  if (!assets) return assets;
  const list = Array.isArray(assets) ? assets : [assets];
  if (list.length === 0) return assets;

  const agentIds = [];
  const agentEmails = [];

  list.forEach((item) => {
    if (item && item.agent) {
      if (item.agent.id && mongoose.Types.ObjectId.isValid(item.agent.id)) {
        agentIds.push(item.agent.id.toString());
      }
      if (item.agent.email) {
        agentEmails.push(item.agent.email.toLowerCase());
      }
    }
    if (item && item.ownerEmail) {
      agentEmails.push(item.ownerEmail.toLowerCase());
    }
  });

  const uniqueIds = [...new Set(agentIds)];
  const uniqueEmails = [...new Set(agentEmails)];

  if (uniqueIds.length === 0 && uniqueEmails.length === 0) return assets;

  try {
    const userQuery = [];
    if (uniqueIds.length > 0) userQuery.push({ _id: { $in: uniqueIds } });
    if (uniqueEmails.length > 0) userQuery.push({ email: { $in: uniqueEmails } });

    const users = await User.find({ $or: userQuery })
      .select("email company isVerified verificationStatus name role plan phone profilePicture")
      .lean();

    const userById = new Map();
    const userByEmail = new Map();
    users.forEach((u) => {
      userById.set(u._id.toString(), u);
      if (u.email) userByEmail.set(u.email.toLowerCase(), u);
    });

    list.forEach((item) => {
      if (!item) return;
      if (!item.agent) item.agent = {};

      const u =
        (item.agent.id && userById.get(item.agent.id.toString())) ||
        (item.agent.email && userByEmail.get(item.agent.email.toLowerCase())) ||
        (item.ownerEmail && userByEmail.get(item.ownerEmail.toLowerCase()));

      if (u) {
        item.agent.id = item.agent.id || u._id.toString();
        item.agent.email = u.email || item.agent.email;
        item.agent.name = item.agent.name || u.name;
        if (u.company?.companyLogo) {
          item.agent.companyLogo = u.company.companyLogo;
        }
        if (u.company?.companyName) {
          item.agent.company = u.company.companyName;
        }
        item.agent.isVerified =
          u.isVerified || u.verificationStatus === "Verified";
        if (u.plan) item.agent.plan = u.plan;
      }
    });
  } catch (err) {
    console.error("Error in syncAgentInfo:", err);
  }

  return assets;
};

/**
 * CAR ASSETS
 * /api/assets/cars
 */
router.get("/cars", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, builder, model, category, country, sort, acquisition, fuelType, transmission, exteriorColor } = req.query;

    let query = { status: 'Active' };
    
    // Acquisition remains a strict mode (Buy/Rent)
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      orClauses.push(
        { title: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { builder: searchRegex },
        { 'specification.model': searchRegex },
        { keywords: searchRegex },
        { location: searchRegex }
      );
    }

    if (type) orClauses.push({ type: type });
    
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }
    
    if (brand || builder) {
      const brandVal = brand || builder;
      orClauses.push({ brand: { $regex: brandVal, $options: "i" } });
      orClauses.push({ builder: { $regex: brandVal, $options: "i" } });
    }
    
    if (model) orClauses.push({ 'specification.model': { $regex: model, $options: "i" } });
    if (category) orClauses.push({ category: { $regex: category, $options: "i" } });

    const specificationFilters = [];
    const addSpecificationMatch = (fields, value) => {
      if (!value) return;
      const escaped = String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      specificationFilters.push({ $or: fields.map((field) => ({ [field]: { $regex: escaped, $options: "i" } })) });
    };
    addSpecificationMatch(["specification.fuel", "specification.fuelType", "specification.engineType"], fuelType);
    addSpecificationMatch(["specification.transmission"], transmission);
    addSpecificationMatch(["specification.exteriorColor", "specification.manufacturerColorCode"], exteriorColor);
    if (specificationFilters.length) query.$and = specificationFilters;

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await CarAsset.countDocuments(query);
    const data = await CarAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions)
      .lean();

    await syncAgentInfo(data);

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Error in /api/assets/cars:", err);
    res.status(500).json({ message: "Failed to fetch vehicle assets" });
  }
});

/**
 * GET ESTATE DEVELOPERS / DEALERS (EXACTLY 3: DAMAC, SOBHA, ELLINGTON)
 * /api/assets/estate-developers
 */
router.get("/estate-developers", async (req, res) => {
  try {
    const targetDevelopers = [
      {
        id: "damac",
        name: "DAMAC",
        fullName: "DAMAC Properties",
        companyName: "DAMAC Properties",
        email: "damac@otulia.com",
        subText: "LIVE THE LUXURY",
        tag: "Official Partner"
      },
      {
        id: "sobha",
        name: "SOBHA",
        fullName: "Sobha Realty",
        companyName: "Sobha Realty",
        email: "sobha@otulia.com",
        subText: "REALTY",
        tag: "Official Partner"
      },
      {
        id: "ellington",
        name: "ELLINGTON",
        fullName: "Ellington Properties",
        companyName: "Ellington Properties",
        email: "ellington@otulia.com",
        subText: "PROPERTIES",
        tag: "Official Partner"
      }
    ];

    // Fetch matching agent photos/logos/emails from DB if available
    const dbEstateAgents = await EstateAsset.aggregate([
      { 
        $match: { 
          status: 'Active', 
          'agent.company': { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: '$agent.company',
          company: { $first: '$agent.company' },
          email: { $first: '$agent.email' },
          companyLogo: { $first: '$agent.companyLogo' }
        }
      }
    ]);

    const result = targetDevelopers.map(dev => {
      const dbMatch = dbEstateAgents.find(d => 
        d.company && d.company.toLowerCase().includes(dev.id)
      );
      if (dbMatch) {
        return {
          ...dev,
          photo: dbMatch.companyLogo || dev.photo || null,
          logo: dbMatch.companyLogo || dev.logo || null,
          email: dbMatch.email || dev.email
        };
      }
      return dev;
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching estate developers:", error);
    res.status(500).json({ message: "Failed to fetch estate developers" });
  }
});

/**
 * ESTATE ASSETS
 * /api/assets/estates
 */
router.get("/estates", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 12, type, minPrice, maxPrice, location, bedrooms, bathrooms, propertyType, sort, acquisition, country } = req.query;

    let query = { status: 'Active' };
    
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      orClauses.push({ title: { $regex: search, $options: "i" } });
      orClauses.push({ description: { $regex: search, $options: "i" } });
      orClauses.push({ "agent.company": { $regex: search, $options: "i" } });
      orClauses.push({ "agent.name": { $regex: search, $options: "i" } });
      orClauses.push({ keywords: { $regex: search, $options: "i" } });
    }

    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }

    if (propertyType) orClauses.push({ 'keySpecifications.propertyType': propertyType });
    if (bedrooms && bedrooms !== 'Any') {
      const val = Number(bedrooms.replace('+', ''));
      if (bedrooms.includes('+')) orClauses.push({ 'specification.bedrooms': { $gte: val } });
      else orClauses.push({ 'specification.bedrooms': val });
    }
    if (bathrooms && bathrooms !== 'Any') {
      const val = Number(bathrooms.replace('+', ''));
      if (bathrooms.includes('+')) orClauses.push({ 'specification.bathrooms': { $gte: val } });
      else orClauses.push({ 'specification.bathrooms': val });
    }

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await EstateAsset.countDocuments(query);
    const data = await EstateAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions)
      .lean();

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
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
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, builder, model, sort, acquisition, country } = req.query;

    let query = { status: 'Active' };
    
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      orClauses.push({ title: searchRegex });
      orClauses.push({ description: searchRegex });
    }

    if (type) orClauses.push({ type: type });
    
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }

    if (brand || builder) {
      const brandVal = brand || builder;
      orClauses.push({ brand: { $regex: brandVal, $options: "i" } });
      orClauses.push({ builder: { $regex: brandVal, $options: "i" } });
    }
    
    if (model) orClauses.push({ 'specification.model': { $regex: model, $options: "i" } });

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await BikeAsset.countDocuments(query);
    const data = await BikeAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions)
      .lean();

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
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
    const { search = "", page = 1, limit = 1000, type, minPrice, maxPrice, location, brand, builder, model, sort, acquisition, country } = req.query;

    let query = { status: 'Active' };
    
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const orClauses = [];

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      orClauses.push({ title: searchRegex });
      orClauses.push({ description: searchRegex });
    }

    if (type) orClauses.push({ type: type });
    
    if (location || country) {
      const locations = (location || '').split(',').concat((country || '').split(',')).filter(l => l && l.trim());
      locations.forEach(loc => {
        orClauses.push({ location: { $regex: loc.trim(), $options: "i" } });
      });
    }

    if (brand || builder) {
      const brandVal = brand || builder;
      orClauses.push({ brand: { $regex: brandVal, $options: "i" } });
      orClauses.push({ builder: { $regex: brandVal, $options: "i" } });
    }
    
    if (model) orClauses.push({ 'specification.model': { $regex: model, $options: "i" } });

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      orClauses.push({ price: priceQuery });
    }

    if (orClauses.length > 0) {
      query.$or = orClauses;
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const total = await YachtAsset.countDocuments(query);
    const data = await YachtAsset.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions)
      .lean();

    res.json({
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
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
    const data = await CarAsset.find({ status: 'Active' }).sort({ createdAt: -1 }).lean();
    await syncAgentInfo(data);
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
    const data = await EstateAsset.find({ status: 'Active' }).sort({ createdAt: -1 }).lean();
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
    const data = await BikeAsset.find({ status: 'Active' }).sort({ createdAt: -1 }).lean();
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
    const data = await YachtAsset.find({ status: 'Active' }).sort({ createdAt: -1 }).lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all yacht assets" });
  }
});

// Helper to create asset slug with '-' instead of spaces/special chars
const createAssetSlug = (title, id) => {
  if (title) {
    const slug = title
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (slug) return id ? `${slug}-${id}` : slug;
  }
  return id || '';
};

// Helper to fetch and populate asset by ID, Title, or Slug
const findAndPopulateAsset = async (Model, param) => {
  if (!param) return null;
  const decoded = decodeURIComponent(param).trim();

  let asset = null;

  // 1. Try finding by _id if it's a valid 24-character ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(decoded) && mongoose.Types.ObjectId.isValid(decoded);
  if (isObjectId) {
    asset = await Model.findByIdAndUpdate(decoded, { $inc: { views: 1 } }, { new: true });
  }

  // 2. Try exact title match
  if (!asset) {
    asset = await Model.findOneAndUpdate(
      { title: decoded },
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  // 3. Try case-insensitive exact title match
  if (!asset) {
    const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    asset = await Model.findOneAndUpdate(
      { title: { $regex: new RegExp(`^\\s*${escaped}\\s*$`, 'i') } },
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  // 4. Try slug-based matching (matching tokens separated by hyphens/spaces/punctuation)
  if (!asset) {
    const tokens = decoded
      .split(/[-_\s]+/)
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (tokens.length > 0) {
      const slugRegexPattern = `^[\\s\\W_]*` + tokens.join(`[\\s\\W_]+`) + `[\\s\\W_]*$`;
      asset = await Model.findOneAndUpdate(
        {
          $or: [
            { title: { $regex: new RegExp(slugRegexPattern, 'i') } },
            { propertyName: { $regex: new RegExp(slugRegexPattern, 'i') } },
            { yachtName: { $regex: new RegExp(slugRegexPattern, 'i') } }
          ]
        },
        { $inc: { views: 1 } },
        { new: true }
      );
    }
  }

  // 5. Fallback: space-separated regex match
  if (!asset && decoded.includes('-')) {
    const spaceVersion = decoded.replace(/-/g, ' ');
    const escapedSpace = spaceVersion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    asset = await Model.findOneAndUpdate(
      {
        $or: [
          { title: { $regex: new RegExp(escapedSpace, 'i') } },
          { propertyName: { $regex: new RegExp(escapedSpace, 'i') } },
          { yachtName: { $regex: new RegExp(escapedSpace, 'i') } }
        ]
      },
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  if (!asset) return null;

  const assetObj = asset.toObject();
  let agentUser = null;
  if (assetObj.agent && assetObj.agent.id && mongoose.Types.ObjectId.isValid(assetObj.agent.id)) {
    agentUser = await User.findById(assetObj.agent.id);
  } else if (assetObj.agent && assetObj.agent.email) {
    agentUser = await User.findOne({ email: assetObj.agent.email.toLowerCase() });
  } else if (assetObj.ownerEmail) {
    agentUser = await User.findOne({ email: assetObj.ownerEmail.toLowerCase() });
  }

  if (agentUser) {
    if (!assetObj.agent) assetObj.agent = {};
    assetObj.agent.id = assetObj.agent.id || agentUser._id.toString();
    assetObj.agent.phone = agentUser.phone || assetObj.agent.phone;
    assetObj.agent.email = agentUser.email || assetObj.agent.email;
    assetObj.agent.plan = agentUser.plan || assetObj.agent.plan;
    assetObj.agent.createdAt = agentUser.createdAt || assetObj.agent.createdAt;
    assetObj.agent.isVerified = agentUser.isVerified || agentUser.verificationStatus === 'Verified';
    if (agentUser.company) {
      assetObj.agent.company = agentUser.company.companyName || assetObj.agent.company;
      assetObj.agent.companyLogo = agentUser.company.companyLogo || assetObj.agent.companyLogo;
      assetObj.agent.website = agentUser.company.website || assetObj.agent.website;
    }
  }

  return assetObj;
};

/**
 * FETCH SINGLE CAR ASSET BY ID OR TITLE
 * /api/assets/car/:id
 */
router.get("/car/:id", async (req, res) => {
  try {
    const assetObj = await findAndPopulateAsset(CarAsset, req.params.id);
    if (!assetObj) return res.status(404).json({ message: "Car asset not found" });
    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching car asset by ID/title:", error);
    res.status(500).json({ message: "Failed to fetch car asset" });
  }
});

/**
 * FETCH SINGLE ESTATE ASSET BY ID OR TITLE
 * /api/assets/estate/:id
 */
router.get("/estate/:id", async (req, res) => {
  try {
    const assetObj = await findAndPopulateAsset(EstateAsset, req.params.id);
    if (!assetObj) return res.status(404).json({ message: "Estate asset not found" });
    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching estate asset by ID/title:", error);
    res.status(500).json({ message: "Failed to fetch estate asset" });
  }
});

/**
 * FETCH SINGLE BIKE ASSET BY ID OR TITLE
 * /api/assets/bike/:id
 */
router.get("/bike/:id", async (req, res) => {
  try {
    const assetObj = await findAndPopulateAsset(BikeAsset, req.params.id);
    if (!assetObj) return res.status(404).json({ message: "Bike asset not found" });
    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching bike asset by ID/title:", error);
    res.status(500).json({ message: "Failed to fetch bike asset" });
  }
});

/**
 * FETCH SINGLE YACHT ASSET BY ID OR TITLE
 * /api/assets/yacht/:id
 */
router.get("/yacht/:id", async (req, res) => {
  try {
    const assetObj = await findAndPopulateAsset(YachtAsset, req.params.id);
    if (!assetObj) return res.status(404).json({ message: "Yacht asset not found" });
    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching yacht asset by ID/title:", error);
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

    let Model;
    if (type === "cars" || type === "car") Model = CarAsset;
    else if (type === "estates" || type === "estate") Model = EstateAsset;
    else if (type === "bikes" || type === "bike") Model = BikeAsset;
    else if (type === "yachts" || type === "yacht") Model = YachtAsset;
    else Model = Listing;

    const assetObj = await findAndPopulateAsset(Model, id);
    if (!assetObj) return res.status(404).json({ message: "Asset not found" });

    res.json(assetObj);
  } catch (error) {
    console.error("Error fetching asset details:", error);
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
    await asset.save();

    // 🔥 Update popularity score in real-time
    const modelMapping = {
      cars: "CarAsset",
      estates: "EstateAsset",
      bikes: "BikeAsset",
      yachts: "YachtAsset"
    };
    incrementPopularity(modelMapping[type], id, 5);

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
    const { q, page = 1, limit = 12, type, minPrice, maxPrice, location, acquisition, brand, model, category, propertyType, bedrooms, bathrooms, amenities, architecture, sort } = req.query;

    const andClauses = [{ status: 'Active' }];

    if (q) {
      const words = q.split(' ').filter(word => word.length > 0);
      const qOrQuery = words.map(word => {
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
      andClauses.push({ $or: qOrQuery });
    }

    if (type) andClauses.push({ type: type });
    
    if (acquisition) {
      if (acquisition === 'buy') {
        andClauses.push({ acquisition: { $in: ['buy', 'rent/buy'] } });
      } else if (acquisition === 'rent') {
        andClauses.push({ acquisition: { $in: ['rent', 'rent/buy'] } });
      }
    }

    if (location) {
      andClauses.push({ location: { $regex: location, $options: "i" } });
    }

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      andClauses.push({ price: priceQuery });
    }

    // Category, Brand, Model
    if (category && category !== 'Any') {
        // Handle variations in category naming
        const catRegex = { $regex: category.replace('Asset', '').replace('s', ''), $options: 'i' };
        andClauses.push({ category: catRegex });
    }
    if (brand) andClauses.push({ brand: { $regex: brand, $options: "i" } });
    if (model) andClauses.push({ 'specification.model': { $regex: model, $options: "i" } });

    // Property Specifics
    if (propertyType) andClauses.push({ 'keySpecifications.propertyType': propertyType });
    if (bedrooms && bedrooms !== 'Any') {
        const val = Number(bedrooms.replace('+', ''));
        if (bedrooms.includes('+')) andClauses.push({ 'specification.bedrooms': { $gte: val } });
        else andClauses.push({ 'specification.bedrooms': val });
    }
    if (bathrooms && bathrooms !== 'Any') {
        const val = Number(bathrooms.replace('+', ''));
        if (bathrooms.includes('+')) andClauses.push({ 'specification.bathrooms': { $gte: val } });
        else andClauses.push({ 'specification.bathrooms': val });
    }
    if (amenities && amenities !== 'Any') andClauses.push({ 'amenities': { $regex: amenities, $options: "i" } });
    if (architecture && architecture !== 'Any') andClauses.push({ 'specification.architectureStyle': architecture });

    const query = { $and: andClauses };

    let sortOptions = { createdAt: -1 };
    if (sort === 'Low to High') sortOptions = { price: 1 };
    if (sort === 'High to Low') sortOptions = { price: -1 };
    if (sort === 'Newest') sortOptions = { createdAt: -1 };
    if (sort === 'Oldest') sortOptions = { createdAt: 1 };

    const fetchResults = async (q) => {
        const [car, estate, bike, yacht, other] = await Promise.all([
            CarAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            EstateAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            BikeAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            YachtAsset.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
            Listing.find(q).sort(sortOptions).skip((page - 1) * limit).limit(Number(limit)),
        ]);
        return [...car, ...estate, ...bike, ...yacht, ...other];
    };

    const countResults = async (q) => {
        const [car, estate, bike, yacht, other] = await Promise.all([
            CarAsset.countDocuments(q),
            EstateAsset.countDocuments(q),
            BikeAsset.countDocuments(q),
            YachtAsset.countDocuments(q),
            Listing.countDocuments(q),
        ]);
        return car + estate + bike + yacht + other;
    };

    let total = await countResults(query);
    let combinedAssets = await fetchResults(query);

    // --- COMPREHENSIVE FALLBACK LOGIC ---
    // If no results for strict AND, try a broader search (OR logic for Category/Location/Brand)
    if (combinedAssets.length === 0 && andClauses.length > 1) {
        const fallbackOrClauses = [];
        
        if (category) {
            const catRegex = { $regex: category.replace('Asset', '').replace('s', ''), $options: 'i' };
            fallbackOrClauses.push({ category: catRegex });
        }
        if (location) fallbackOrClauses.push({ location: { $regex: location, $options: "i" } });
        if (brand) fallbackOrClauses.push({ brand: { $regex: brand, $options: "i" } });
        if (q) {
            const words = q.split(' ').filter(word => word.length > 0);
            words.forEach(w => fallbackOrClauses.push({ title: { $regex: w, $options: 'i' } }));
        }

        if (fallbackOrClauses.length > 0) {
            const fallbackQuery = { 
                $and: [
                    { status: 'Active' },
                    { $or: fallbackOrClauses }
                ]
            };
            total = await countResults(fallbackQuery);
            combinedAssets = await fetchResults(fallbackQuery);
        }
    }

    // Final global sort
    if (sort === 'Low to High') combinedAssets.sort((a, b) => a.price - b.price);
    else if (sort === 'High to Low') combinedAssets.sort((a, b) => b.price - a.price);
    else if (sort === 'Oldest') combinedAssets.sort((a, b) => a.createdAt - b.createdAt);
    else combinedAssets.sort((a, b) => b.createdAt - a.createdAt);

    res.json({
      data: combinedAssets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("Combined assets error:", err);
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
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const data = await EstateAsset.find(query)
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
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const data = await BikeAsset.find(query)
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
    const { limit = 15, location, acquisition } = req.query;
    const query = { status: 'Active' };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (acquisition) {
      if (acquisition === 'buy') {
        query.acquisition = { $in: ['buy', 'rent/buy'] };
      } else if (acquisition === 'rent') {
        query.acquisition = { $in: ['rent', 'rent/buy'] };
      }
    }

    const data = await YachtAsset.find(query)
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

/**
 * SIMILAR ASSETS
 * /api/assets/similar/:category/:id
 */
router.get("/similar/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid asset ID" });
    }

    let Model;
    const catLower = category.toLowerCase();
    if (catLower.includes('car')) Model = CarAsset;
    else if (catLower.includes('estate')) Model = EstateAsset;
    else if (catLower.includes('bike')) Model = BikeAsset;
    else if (catLower.includes('yacht')) Model = YachtAsset;
    else return res.status(400).json({ message: "Invalid category" });

    const currentAsset = await Model.findById(id);
    if (!currentAsset) return res.status(404).json({ message: "Asset not found" });

    // Define similarity criteria: 
    // 1. Same brand/builder (for vehicles) or same location (for estates)
    // 2. Similar price (+/- 20%)
    const priceMin = currentAsset.price * 0.8;
    const priceMax = currentAsset.price * 1.2;

    let orClauses = [];
    
    if (catLower.includes('estate')) {
      // For estates: Location is primary
      if (currentAsset.location) {
        orClauses.push({ location: { $regex: currentAsset.location, $options: 'i' } });
      }
    } else {
      // For vehicles: Brand/Builder is primary
      if (currentAsset.brand) orClauses.push({ brand: currentAsset.brand });
      if (currentAsset.builder) orClauses.push({ builder: currentAsset.builder });
    }

    // Secondary: Similar Price
    orClauses.push({ price: { $gte: priceMin, $lte: priceMax } });

    const query = {
      _id: { $ne: id },
      status: 'Active',
      $or: orClauses
    };

    // To ensure "First Brand/Location then Price" priority, we can fetch them and sort or use a weighted approach.
    // For simplicity and performance, we'll fetch them and use JS to sort by match type.
    const similar = await Model.find(query).limit(20); 
    
    const sortedSimilar = similar.sort((a, b) => {
      // Priority 1: Brand/Location match
      let aMatch = false;
      let bMatch = false;

      if (catLower.includes('estate')) {
        aMatch = a.location === currentAsset.location;
        bMatch = b.location === currentAsset.location;
      } else {
        aMatch = (a.brand && a.brand === currentAsset.brand) || (a.builder && a.builder === currentAsset.builder);
        bMatch = (b.brand && b.brand === currentAsset.brand) || (b.builder && b.builder === currentAsset.builder);
      }

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0; // Both are matches or both are price-only matches
    }).slice(0, 10);

    await syncAgentInfo(sortedSimilar);
    res.json(sortedSimilar);
  } catch (error) {
    console.error("Similar assets error:", error);
    res.status(500).json({ message: "Failed to fetch similar assets" });
  }
});

/**
 * ASSETS BY AGENT (SAME CATEGORY)
 * /api/assets/agent/:agentId/:category
 */
router.get("/agent/:agentId/:category", async (req, res) => {
  try {
    const { agentId, category } = req.params;
    const { excludeId } = req.query;

    let Model;
    const catLower = category.toLowerCase();
    if (catLower.includes('car')) Model = CarAsset;
    else if (catLower.includes('estate')) Model = EstateAsset;
    else if (catLower.includes('bike')) Model = BikeAsset;
    else if (catLower.includes('yacht')) Model = YachtAsset;
    else return res.status(400).json({ message: "Invalid category" });

    const query = {
      'agent.id': agentId,
      status: 'Active'
    };

    if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }

    const assets = await Model.find(query).limit(10);
    await syncAgentInfo(assets);
    res.json(assets);
  } catch (error) {
    console.error("Agent assets error:", error);
    res.status(500).json({ message: "Failed to fetch agent assets" });
  }
});

/**
 * SEARCH BY LISTING REFERENCE ID
 * /api/assets/search/id/:id
 */
router.get("/search/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Clean ID (handle URL encoding like #)
    const cleanId = id.startsWith("#") ? id : `#${id}`;

    // Search across all models
    const [car, bike, yacht, estate, generic] = await Promise.all([
      CarAsset.findOne({ listingReference: cleanId }),
      BikeAsset.findOne({ listingReference: cleanId }),
      YachtAsset.findOne({ listingReference: cleanId }),
      EstateAsset.findOne({ listingReference: cleanId }),
      Listing.findOne({ listingReference: cleanId })
    ]);

    if (car) return res.json({ redirect: `/asset/car/${createAssetSlug(car.title, car._id)}`, found: true });
    if (bike) return res.json({ redirect: `/asset/bike/${createAssetSlug(bike.title, bike._id)}`, found: true });
    if (yacht) return res.json({ redirect: `/asset/yacht/${createAssetSlug(yacht.title, yacht._id)}`, found: true });
    if (estate) return res.json({ redirect: `/asset/estate/${createAssetSlug(estate.title, estate._id)}`, found: true });
    if (generic) return res.json({ redirect: `/asset/listing/${createAssetSlug(generic.title, generic._id)}`, found: true });

    res.json({ found: false, message: "No asset found with this reference ID" });
  } catch (err) {
    console.error("Search by ID error:", err);
    res.status(500).json({ message: "Failed to search by ID" });
  }
});

module.exports = router;
