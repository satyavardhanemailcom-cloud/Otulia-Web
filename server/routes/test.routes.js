const express = require("express");
const YachtAsset = require("../models/YachtAsset.model");
const CarAsset = require("../models/CarAsset.model");
const EstateAsset = require("../models/EstateAsset.model");
const BikeAsset = require("../models/BikeAsset.model");
const router = express.Router();
const User = require("../models/User.model");

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

router.get("/make-admin", async (req, res) => {
    try {
        // Promote the default user or specific email
        const email = req.query.email || "contact@prestigemotors.com";
        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );
        if (!user) return res.status(404).send("User not found");
        res.send(`User ${user.email} is now an Admin.`);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});
router.get("/users", async (req, res) => {
    const users = await User.find().select("email name role").limit(10);
    res.json(users);
});

router.get("/force-pending", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).send("Email required");

        const user = await User.findOneAndUpdate(
            { email },
            {
                verificationStatus: 'Pending',
                verificationDocuments: {
                    'businessLicense': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'identityProof': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
                }
            },
            { new: true }
        );
        if (!user) return res.status(404).send("User not found");
        res.json(user);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

router.get("/reset-verification", async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).send("Email required");

        const user = await User.findOneAndUpdate(
            { email },
            {
                verificationStatus: 'None',
                isVerified: false,
                verificationDocuments: {}
            },
            { new: true }
        );
        res.json(user);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});
module.exports = router;
