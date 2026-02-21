const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon.model');
const authMiddleware = require('../middleware/auth.middleware');

// Validate a coupon code
router.get('/validate/:code', authMiddleware, async (req, res) => {
    try {
        const { code } = req.params;
        
        // 1. Check User Account Age (Restricted to first 3 months)
        const User = require('../models/User.model');
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ valid: false, message: 'User not found' });
        }

        const accountAgeInMs = Date.now() - new Date(user.createdAt).getTime();
        const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; // Approx 90 days

        if (accountAgeInMs > threeMonthsInMs) {
            return res.status(403).json({ 
                valid: false, 
                message: 'Coupon eligibility is only valid for the first 3 months of your membership.' 
            });
        }

        // 2. Validate Coupon existence and status
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ valid: false, message: 'Coupon not found' });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({ valid: false, message: 'Coupon is expired or inactive' });
        }

        res.json({
            valid: true,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            code: coupon.code
        });
    } catch (error) {
        console.error('Coupon Validation Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
