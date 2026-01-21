const express = require("express");
const Listing = require("../models/Listing.model");
const VehicleAsset = require("../models/VehicleAsset.model");
const EstateAsset = require("../models/EstateAsset.model");

const router = express.Router();


/**
 * FEATURED LISTINGS
 * Logic: isFeatured = true
 */

router.get("/featured", async(req, res) => {
    try {
        const listings = await Listing.find({ isFeatured: true })
        .limit(6)
        .select("title images price category location dealer");

        res.json(listings);
        
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch featured listings" });
    }
});


/**
 * POPULAR LISTINGS
 * Logic: highest bookings
 */

router.get("/popularity", async (req, res) => {
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

/** 
 * TRENDIND LISTINGS
 * isTrending: true
 */

router.get("/trending", async (req, res) => {
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