const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const CarAsset = require('../models/CarAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const UserActivity = require('../models/UserActivity.model');

/**
 * GET INVENTORY DASHBOARD DATA
 * Advanced features gated by plan: Premium Basic vs Business VIP
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('myListings.item');

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Gating for Freemium
        if (user.plan === 'Freemium') {
            return res.status(403).json({ error: 'INSUFFICIENT_PLAN', message: 'Please upgrade to access the Inventory Management System.' });
        }

        const listings = user.myListings.filter(l => l.item);

        // 1. Calculate General Stats
        let stats = {
            totalAssets: listings.length,
            totalViews: 0,
            totalLeads: 0,
            avgConversion: 0,
            activeCount: 0,
            closedCount: 0
        };

        const detailedItems = listings.map(l => {
            const item = l.item;
            stats.totalViews += (item.views || 0);
            stats.activeCount += (item.status === 'Active' ? 1 : 0);
            stats.closedCount += (item.status !== 'Active' ? 1 : 0);

            return {
                id: item._id,
                title: item.title,
                category: l.itemModel,
                price: item.price,
                status: item.status,
                views: item.views || 0,
                type: item.type,
                images: item.images,
                createdAt: item.createdAt
            };
        });

        // 2. Fetch Leads (Activities)
        const assetIds = detailedItems.map(i => i.id);
        const activities = await UserActivity.find({
            assetId: { $in: assetIds },
            activityType: { $in: ['CALL_AGENT', 'INQUIRY', 'RENT_REQUEST', 'BUY_REQUEST'] }
        })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        stats.totalLeads = activities.length;
        stats.avgConversion = stats.totalViews > 0 ? ((stats.totalLeads / stats.totalViews) * 100).toFixed(2) : 0;

        // 3. Lead Details (Formatted for the Leads Table)
        const leadsTable = activities.map(act => ({
            id: act._id,
            buyerName: act.userId?.name || 'Anonymous Client',
            assetName: detailedItems.find(i => i.id.toString() === act.assetId.toString())?.title || 'Unknown Asset',
            category: detailedItems.find(i => i.id.toString() === act.assetId.toString())?.category || 'General',
            date: act.createdAt,
            status: act.status || 'New',
            customerContact: user.plan === 'Business VIP' ? act.userId?.email : 'Upgrade to VIP to view email'
        }));

        // 4. Analytics Data (Mocked for Chart stability)
        const performanceHistory = [
            { week: 'Week 1', views: 8200, leads: 42 },
            { week: 'Week 2', views: 9500, leads: 58 },
            { week: 'Week 3', views: 11200, leads: 64 },
            { week: 'Week 4', views: stats.totalViews, leads: stats.totalLeads }
        ];

        res.json({
            plan: user.plan,
            stats,
            inventory: detailedItems,
            leads: leadsTable,
            analytics: {
                performanceTrend: performanceHistory,
                leadsByLocation: [
                    { country: 'United States', count: 120 },
                    { country: 'United Kingdom', count: 85 },
                    { country: 'UAE', count: 64 },
                    { country: 'France', count: 42 }
                ]
            }
        });

    } catch (error) {
        console.error('Inventory Fetch Error:', error);
        res.status(500).json({ error: 'Failed to sync inventory data' });
    }
});

/**
 * TOGGLE VISIBILITY (Public vs Private)
 */
router.post('/toggle-visibility', authMiddleware, async (req, res) => {
    try {
        const { itemId, model, isPublic } = req.body;

        let Model;
        if (model.includes('Car')) Model = CarAsset;
        else if (model.includes('Estate')) Model = EstateAsset;
        else if (model.includes('Bike')) Model = BikeAsset;
        else if (model.includes('Yacht')) Model = YachtAsset;
        else return res.status(400).json({ error: 'Invalid asset model' });

        const item = await Model.findById(itemId);
        if (!item) return res.status(404).json({ error: 'Asset not found' });

        // Verify Ownership
        if (item.agent?.id !== req.user.id) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        // Using a status field toggle or a dedicated public field if added later
        // For now, let's treat 'Draft' as private and 'Active' as public
        item.status = isPublic ? 'Active' : 'Draft';
        await item.save();

        res.json({ success: true, status: item.status });
    } catch (error) {
        res.status(500).json({ error: 'Sync failed' });
    }
});

module.exports = router;
