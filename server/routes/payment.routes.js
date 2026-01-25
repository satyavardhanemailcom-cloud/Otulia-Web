const express = require('express');
const router = express.Router();
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}
const User = require('../models/User.model');
const authMiddleware = require('../middleware/auth.middleware');

const DOMAIN = 'http://localhost:5173'; // Update this for production

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
    const { plan } = req.body;

    let priceAmount = 0;
    let productName = '';

    // Validate Plan
    if (plan === 'Premium Basic') {
        priceAmount = 9900; // £99.00
        productName = 'Premium Basic Plan';
    } else if (plan === 'Business VIP') {
        priceAmount = 29900; // £299.00
        productName = 'Business VIP Plan';
    } else {
        return res.status(400).json({ error: 'Invalid plan selected' });
    }

    if (!stripe) {
        return res.status(500).json({ error: "Server Error: Stripe API key is missing." });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: productName,
                            description: `Monthly subscription for ${productName}`,
                        },
                        unit_amount: priceAmount,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan)}`,
            cancel_url: `${DOMAIN}/pricing`,
            metadata: {
                userId: req.user.id, // Changed to match auth routes payload usage (req.user.id)
                plan: plan
            }
        });

        res.json({ url: session.url });
    } catch (e) {
        console.error("Stripe Error:", e);
        res.status(500).json({ error: e.message });
    }
});

router.post('/create-cart-checkout-session', authMiddleware, async (req, res) => {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!stripe) {
        return res.status(500).json({ error: "Server Error: Stripe API key is missing." });
    }

    try {
        const line_items = cartItems.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.title,
                    description: item.type === 'Rent'
                        ? `Rental Period: ${item.startDate} to ${item.endDate} (${item.duration} days)`
                        : `Purchase of ${item.title}`,
                },
                unit_amount: Math.round(item.totalPrice * 100), // Stripe expects minor units (cents/pence)
            },
            quantity: 1,
        }));

        // Prepare metadata for order reconstruction
        // Simplified keys to stay under char limit
        const cartData = cartItems.map(item => ({
            id: item.itemId,
            mod: item.itemModel || 'Listing',
            type: item.type,
            s: item.startDate || null,
            e: item.endDate || null,
            p: item.totalPrice
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&type=cart_checkout`,
            cancel_url: `${DOMAIN}/cart`,
            metadata: {
                userId: req.user.id,
                type: 'cart_checkout',
                cartData: JSON.stringify(cartData)
            }
        });

        res.json({ url: session.url });
    } catch (e) {
        console.error("Stripe Cart Error:", e);
        res.status(500).json({ error: e.message });
    }
});

router.get('/verify-payment', authMiddleware, async (req, res) => {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

    if (!stripe) {
        return res.status(500).json({ error: "Server Error: Stripe API key is missing." });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (session.metadata.type === 'cart_checkout') {
                const cartData = JSON.parse(session.metadata.cartData);
                const orderId = `ORD-${Date.now()}`;

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
                            price: item.p,
                            orderId: orderId,
                            date: new Date()
                        });
                    }
                });

                await user.save();
                return res.json({ success: true, message: 'Cart processed', user });

            } else {
                // Subscription logic
                const plan = session.metadata.plan;
                if (plan) {
                    const expiryDate = new Date();
                    expiryDate.setMonth(expiryDate.getMonth() + 1);

                    user.plan = plan;
                    user.planExpiresAt = expiryDate;
                    await user.save();
                    return res.json({ success: true, plan, user });
                }
            }

            res.json({ success: true, message: 'Payment verified.' });
        } else {
            res.status(400).json({ error: 'Payment not completed' });
        }
    } catch (e) {
        console.error('Verify Payment Error:', e);
        res.status(500).json({ error: e.message });
    }
});

router.post('/cancel-subscription', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // In a real app, you would retrieve the subscription ID from the user model or Stripe
        // For now, we simulate cancellation by resetting the local plan

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
