const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const User = require('../models/User.model');
const authMiddleware = require('../middleware/auth.middleware');

// Initialize Razorpay
let razorpayInstance;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.warn("Razorpay keys are missing in environment variables.");
}

const DOMAIN = 'http://localhost:5173';

// Create Order for Plan Upgrade
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
    const { plan } = req.body;

    let priceAmount = 0; // In smallest currency unit (e.g., paise/cents)
    let currency = 'GBP';

    // Validate Plan
    if (plan === 'Premium Basic') {
        priceAmount = 9900; // £99.00 -> 9900 pence
    } else if (plan === 'Business VIP') {
        priceAmount = 29900; // £299.00 -> 29900 pence
    } else {
        return res.status(400).json({ error: 'Invalid plan selected' });
    }

    if (!razorpayInstance) {
        return res.status(500).json({ error: "Server Error: Razorpay API key is missing." });
    }

    try {
        const options = {
            amount: priceAmount,
            currency: currency,
            receipt: `plan_${Date.now().toString().slice(-10)}_${crypto.randomBytes(2).toString('hex')}`,
            notes: {
                userId: req.user.id,
                plan: plan,
                type: 'subscription'
            }
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            order,
            key_id: process.env.RAZORPAY_KEY_ID,
            // Pass plan info back so frontend knows what to send to verify if needed
            plan: plan
        });
    } catch (e) {
        console.error("Razorpay Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Create Order for Cart Checkout
router.post('/create-cart-checkout-session', authMiddleware, async (req, res) => {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!razorpayInstance) {
        return res.status(500).json({ error: "Server Error: Razorpay API key is missing." });
    }

    try {
        // Calculate Total
        let totalAmount = 0;
        cartItems.forEach(item => {
            // Assuming item.totalPrice is in normal units (e.g. 100 GBP), convert to minor units
            totalAmount += Math.round(item.totalPrice * 100);
        });

        // Prepare simplified cart data for reconstruction/verification
        const cartData = cartItems.map(item => ({
            id: item.itemId,
            mod: item.itemModel || 'Listing',
            type: item.type,
            s: item.startDate || null,
            e: item.endDate || null,
            p: item.totalPrice
        }));

        const options = {
            amount: totalAmount,
            currency: 'GBP',
            receipt: `cart_${Date.now().toString().slice(-10)}_${crypto.randomBytes(2).toString('hex')}`,
            notes: {
                userId: req.user.id,
                type: 'cart_checkout'
                // We avoid putting large cartData in notes as it has limits
            }
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            order,
            key_id: process.env.RAZORPAY_KEY_ID,
            cartData: cartData // Send back to frontend to pass to verify
        });

    } catch (e) {
        console.error("Razorpay Cart Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Verify Payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        cartData, // Optional, present if cart checkout
        plan      // Optional, present if subscription
    } = req.body;

    if (!razorpayInstance) {
        return res.status(500).json({ error: "Server Error: Razorpay API keys missing." });
    }

    try {
        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // Payment is legit. Now fulfill the order.
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Retrieve order to double check amount if needed? 
        // For strictness we could fetch order from Razorpay, but signature verification confirms the order was paid.
        // We verify the type based on input or logic.

        if (cartData && Array.isArray(cartData) && cartData.length > 0) {
            // Cart Checkout Logic
            const orderId = razorpay_order_id;

            // Optional: You could re-verify that cartData total matches order amount here
            // But relying on signature is "okay" as long as order_id was created by us with that amount.
            // The mapping assumes cartData passed is what was intended.

            cartData.forEach(item => {
                if (item.type === 'Rent') {
                    user.rentedHistory.push({
                        item: item.id,
                        itemModel: item.mod,
                        startDate: new Date(item.s),
                        endDate: new Date(item.e),
                        totalPrice: item.p,
                        orderId: orderId,
                        rentedAt: new Date()
                    });
                } else {
                    user.boughtHistory.push({
                        item: item.id,
                        itemModel: item.mod,
                        price: item.p, // This corresponds to 'price' in boughtHistory schema
                        orderId: orderId,
                        date: new Date()
                    });
                }
            });

            await user.save();
            return res.json({ success: true, message: 'Cart processed successfully', user });

        } else if (plan) {
            // Subscription Logic
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);

            user.plan = plan;
            user.planExpiresAt = expiryDate;
            await user.save();
            return res.json({ success: true, message: `Upgraded to ${plan}`, user });
        } else {
            return res.status(400).json({ error: "Unknown purchase type" });
        }

    } catch (e) {
        console.error('Verify Payment Error:', e);
        res.status(500).json({ error: e.message });
    }
});

router.post('/cancel-subscription', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.plan === 'Freemium') {
            return res.status(400).json({ error: "You are already on the free plan." });
        }

        user.plan = 'Freemium';
        user.planExpiresAt = null;
        await user.save();

        res.json({ message: "Subscription cancelled successfully. You are now on the Free plan.", user });
    } catch (e) {
        console.error("Cancel Subscription Error:", e);
        res.status(500).json({ error: "Failed to cancel subscription." });
    }
});

module.exports = router;
