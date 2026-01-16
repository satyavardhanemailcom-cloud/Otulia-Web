const express = require("express");
const Listing = require("../models/Listing.model");

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
 * TRENDING LISTINGS
 * Logic: highest views
 */

router.get("/trending", async(req, res)=> {
    try {
        const listings = await Listing.find()
        .sort({ views: -1 })
        .limit(6)
        .select("title immages price category location views");

        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch trending listings"});
    }
})

/**
 * POPULAR LISTINGS
 * Logic: highest bookings
 */


router.get("/popular", async (req, res) => {
    try {
        const listings = await Listing.find()
        .sort({ bookings: -1 })
        .limit(6)
        .select("title images category location bookings");

        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular listings" });
    }
});

module.exports = router;