const express = require("express");
const Listing = require("../models/Listing.model");
const CarAsset = require("../models/CarAsset.model");
const UserActivity = require("../models/UserActivity.model");

const router = express.Router();


/**
 * FEATURED LISTINGS
 * Logic: isFeatured = true
 */

router.get("/featured", async (req, res) => {
  try {
    const listings = await Listing.find({ isFeatured: true })
      .limit(6)
      .select("title images price category location agent isPriceOnRequest type keySpecifications")
      .lean();

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
    const popularCars = await CarAsset.find({ status: 'Active' })
      .sort({ popularity: -1 })
      .limit(10)
      .lean();
    res.json(popularCars);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch popular assets" });
  }
});

/**
 * TRENDING LISTINGS
 * Logic: Most views (VIEW) from UserActivity in the last 3 days
 */
router.get("/trending", async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    
    // Aggregate views from the last 3 days
    const trendingActivities = await UserActivity.aggregate([
      {
        $match: {
          activityType: "VIEW",
          assetModel: "CarAsset",
          createdAt: { $gte: threeDaysAgo }
        }
      },
      {
        $group: {
          _id: { assetId: "$assetId", assetModel: "$assetModel" },
          viewCount: { $sum: 1 }
        }
      },
      {
        $sort: { viewCount: -1 }
      },
      {
        $limit: 15
      }
    ]);

    let trendingAssets = [];

    if (trendingActivities.length > 0) {
      const carIds = trendingActivities.map((item) => item._id.assetId);
      const cars = carIds.length
        ? await CarAsset.find({ _id: { $in: carIds } })
            .select("title images price category location agent isTrending status isPriceOnRequest type keySpecifications")
            .lean()
        : [];

      const assetById = new Map();
      cars.forEach((asset) => {
        if (asset && asset.status === 'Active') {
          assetById.set(asset._id.toString(), asset);
        }
      });

      for (const item of trendingActivities) {
        const asset = assetById.get(item._id.assetId.toString());
        if (asset) {
          trendingAssets.push(asset);
        }
      }
    }

    // Fallback: If no activity in last 3 days, use total views or marked trending
    if (trendingAssets.length < 5) {
     

      const fallbackAssets = await CarAsset.find({ status: 'Active' })
        .sort({ views: -1, isTrending: -1 })
        .limit(5)
        .lean();

      // Merge unique assets
      const existingIds = new Set(trendingAssets.map(a => a._id.toString()));
      for (const asset of fallbackAssets) {
        if (!existingIds.has(asset._id.toString()) && trendingAssets.length < 15) {
          trendingAssets.push(asset);
          existingIds.add(asset._id.toString());
        }
      }
    }

   
    res.json(trendingAssets);

  } catch (error) {
    console.error("Trending Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch trending assets" });
  }
});
module.exports = router;
