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

router.get('/verify-payment', authMiddleware, async (req, res) => {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: 'Missing session_id' });

    if (!stripe) {
        return res.status(500).json({ error: "Server Error: Stripe API key is missing." });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Simple verification - in production use webhook
        if (session.payment_status === 'paid') {
            const plan = session.metadata.plan;
            const userId = req.user.id;

            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month

            const user = await User.findByIdAndUpdate(
                userId,
                { plan, planExpiresAt: expiryDate },
                { new: true }
            );

            if (!user) return res.status(404).json({ error: 'User not found' });

            res.json({ success: true, plan, user });
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
