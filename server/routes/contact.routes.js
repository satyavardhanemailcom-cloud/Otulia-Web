const express = require('express');
const router = express.Router();
const ContactSales = require('../models/ContactSales.model');

// POST /api/contact - Submit a contact sales inquiry
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, company, inquiryType, message, estimatedListings } = req.body;

        const newInquiry = new ContactSales({
            name,
            email,
            phone,
            company,
            inquiryType,
            message,
            estimatedListings
        });

        await newInquiry.save();

        res.status(201).json({ success: true, message: 'Inquiry submitted successfully' });
    } catch (error) {
        console.error('Error submitting contact sales inquiry:', error);
        res.status(500).json({ success: false, error: 'Failed to submit inquiry' });
    }
});

module.exports = router;
