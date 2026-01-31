const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User.model');
const authMiddleware = require('../middleware/auth.middleware');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
// To switch to live, remove ".sandbox" from the URL
const PAYPAL_API = 'https://api-m.paypal.com';

// Helper: Generate Access Token
async function generateAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("Missing PayPal Credentials");
    }
    // Trim credentials to avoid whitespace issues
    const clientId = PAYPAL_CLIENT_ID.trim();
    const clientSecret = PAYPAL_CLIENT_SECRET.trim();

    const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");
    try {
        const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error("PayPal Token Error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to authenticate with PayPal");
    }
}

// Create Order (Unified for Plan or Cart)
router.post('/create-order', authMiddleware, async (req, res) => {
    const { plan, cartItems } = req.body;

    let totalAmount = 0;
    let description = "";

    // Calculate Request Amount
    if (plan) {
        if (plan === 'Premium Basic') totalAmount = 99.00;
        else if (plan === 'Business VIP') totalAmount = 299.00;
        else return res.status(400).json({ error: 'Invalid plan' });
        description = `Upgrade to ${plan}`;
    } else if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
        cartItems.forEach(item => {
            totalAmount += parseFloat(item.totalPrice || 0);
        });
        description = "Cart Checkout";
    } else {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        const accessToken = await generateAccessToken();
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "GBP",
                    value: totalAmount.toFixed(2) // Ensure 2 decimal places
                },
                description: description
            }],
            application_context: {
                shipping_preference: "NO_SHIPPING"
            }
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            }
        });

        res.json({ id: response.data.id });
    } catch (e) {
        console.error("PayPal Create Order Error:", e.response ? e.response.data : e.message);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// Capture Order & Fulfill
router.post('/capture-order', authMiddleware, async (req, res) => {
    const { orderID, plan, cartItems } = req.body;

    if (!orderID) return res.status(400).json({ error: "Missing Order ID" });

    try {
        const accessToken = await generateAccessToken();
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            }
        });

        const captureData = response.data;

        if (captureData.status === 'COMPLETED') {
            // Payment successful, fulfill order
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (plan) {
                // Update Plan Logic
                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 1);
                user.plan = plan;
                user.planExpiresAt = expiryDate;
                await user.save();
                return res.json({ success: true, message: `Upgraded to ${plan}`, user });
            } else if (cartItems && Array.isArray(cartItems)) {
                // Fulfill Cart Logic
                cartItems.forEach(item => {
                    // Normalize item structure based on what frontend sends
                    // Using structure consistent with CartPage context
                    if (item.type === 'Rent') {
                        user.rentedHistory.push({
                            item: item.itemId || item.id,
                            itemModel: item.itemModel || 'Listing',
                            startDate: item.startDate ? new Date(item.startDate) : new Date(),
                            endDate: item.endDate ? new Date(item.endDate) : new Date(),
                            totalPrice: item.totalPrice,
                            orderId: orderID,
                            rentedAt: new Date()
                        });
                    } else {
                        user.boughtHistory.push({
                            item: item.itemId || item.id,
                            itemModel: item.itemModel || 'Listing',
                            price: item.totalPrice,
                            orderId: orderID,
                            date: new Date()
                        });
                    }
                });
                await user.save();
                return res.json({ success: true, message: 'Cart processed successfully', user });
            } else {
                // Fallback if no context provided but payment success
                return res.json({ success: true, message: "Payment successful (No fulfillment action triggered)", user });
            }
        } else {
            res.status(400).json({ error: "Payment not completed" });
        }
    } catch (e) {
        console.error("Capture Error:", e.response ? e.response.data : e.message);
        res.status(500).json({ error: "Payment capture failed" });
    }
});

// Cancel Subscription (Existing Logic Preserved)
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
