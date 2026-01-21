const express = require("express");
const Listing = require("../models/Listing.model");
const CarAsset = require("../models/CarAsset.model");
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

/** 
 * TRENDIND LISTINGS
 * isTrending: true
 */

router.get("/trending", async (req, res) => {
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