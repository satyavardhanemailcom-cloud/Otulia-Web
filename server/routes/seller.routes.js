const express = require("express");
const SellerLead = require("../models/SellerLead.model");
const router = express.Router();

/**
 * SUBMIT SELLER LEAD
 * POST /api/seller/submit
 */
router.post("/submit", async (req, res) => {
    try {
        const { firstName, lastName, email, phone, contactConsent } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const newLead = new SellerLead({
            firstName,
            lastName,
            email,
            phone,
            contactConsent,
        });

        await newLead.save();

        res.status(201).json({ message: "Lead submitted successfully" });
    } catch (error) {
        console.error("Seller Lead Submission Error:", error);
        res.status(500).json({ message: "Failed to submit lead" });
    }
});

module.exports = router;
