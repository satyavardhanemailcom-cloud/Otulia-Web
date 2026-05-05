const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const CarAsset = require('../models/CarAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const UserActivity = require('../models/UserActivity.model');
const Lead = require('../models/Lead.model');

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

        let stats = {
            totalAssets: listings.length,
            totalViews: 0,
            totalLeads: 0,
            avgConversion: 0,
            activeCount: 0,
            closedCount: 0,
            savedCount: 0,
            estLeadValue: 0
        };

        const detailedItems = listings.map(l => {
            const item = l.item;
            stats.totalViews += (item.views || 0);
            stats.activeCount += (item.status === 'Active' ? 1 : 0);
            stats.closedCount += (item.status !== 'Active' ? 1 : 0);

            return {
                ...item.toObject ? item.toObject() : item,
                id: item._id,
                itemModel: l.itemModel,
                title: item.title,
                price: item.price,
                status: item.status,
                views: item.views || 0,
                type: item.type,
                images: item.images,
                createdAt: item.createdAt
            };
        });

        // 2. Fetch Leads (from Lead model and Activities)
        const assetIds = detailedItems.map(i => i.id);

        const newLeads = await Lead.find({ agentId: userId })
            .populate('sender', 'name email phone profilePicture')
            .sort({ createdAt: -1 });

        const activities = await UserActivity.find({
            assetId: { $in: assetIds },
            activityType: { $in: ['CALL_AGENT', 'INQUIRY', 'RENT_REQUEST', 'BUY_REQUEST'] }
        })
            .populate('userId', 'name email phone profilePicture')
            .sort({ createdAt: -1 });

        stats.totalLeads = newLeads.length + activities.length;
        stats.avgConversion = stats.totalViews > 0 ? ((stats.totalLeads / stats.totalViews) * 100).toFixed(2) : 0;

        // Calculate Saved/Shortlisted Count
        const usersWithSaved = await User.countDocuments({
            'favorites.assetId': { $in: assetIds }
        });
        stats.savedCount = usersWithSaved; // Or you could aggregate the exact number of favorites, this gives number of users who saved at least one

        // Calculate Est Lead Value
        // Find unique assets that have leads/activities
        const leadAssetIds = new Set([
            ...newLeads.map(l => l.assetId?.toString()),
            ...activities.map(a => a.assetId?.toString())
        ].filter(Boolean));

        let estLeadValue = 0;
        detailedItems.forEach(item => {
            if (leadAssetIds.has(item.id.toString())) {
                estLeadValue += (item.price || 0);
            }
        });
        stats.estLeadValue = estLeadValue;

        // 3. Lead Details (Formatted for the Leads Table)
        const leadsTable = [
            ...newLeads.map(l => ({
                id: l._id,
                buyerName: l.sender?.name || l.name || 'Anonymous Client',
                buyerPhoto: l.sender?.profilePicture,
                buyerPhone: l.sender?.phone || l.phone || 'No Phone Provided',
                assetName: l.assetTitle || 'Untitled Asset',
                category: l.assetModel || 'General',
                date: l.createdAt,
                status: l.status || 'New',
                message: l.message,
                isActivity: false,
                customerContact: user.plan === 'Business VIP' || user.plan === 'Enterprise Elite' ? (l.sender?.email || l.email) : 'Upgrade to VIP to view contact'
            })),
            ...activities.map(act => ({
                id: act._id,
                buyerName: act.userId?.name || 'Anonymous Client',
                buyerPhoto: act.userId?.profilePicture,
                buyerPhone: act.userId?.phone || 'No Phone Provided',
                assetName: detailedItems.find(i => i.id.toString() === act.assetId.toString())?.title || 'Untitled Asset',
                category: detailedItems.find(i => i.id.toString() === act.assetId.toString())?.category || 'General',
                date: act.createdAt,
                status: act.status || 'New',
                message: 'Activity: ' + act.activityType,
                isActivity: true,
                customerContact: user.plan === 'Business VIP' || user.plan === 'Enterprise Elite' ? act.userId?.email : 'Upgrade to VIP to view contact'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        // 4. Analytics Data aggregation
        const now = new Date();
        const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

        const leadsLast4Weeks = await UserActivity.aggregate([
            {
                $match: {
                    assetId: { $in: assetIds },
                    activityType: { $in: ['CALL_AGENT', 'INQUIRY', 'RENT_REQUEST', 'BUY_REQUEST'] },
                    createdAt: { $gte: fourWeeksAgo }
                }
            },
            {
                $group: {
                    _id: { $week: "$createdAt" },
                    count: { $sum: 1 },
                    date: { $first: "$createdAt" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Map aggregation to performanceHistory format
        const performanceHistory = [1, 2, 3, 4].map(idx => {
            const weekDate = new Date(now.getTime() - (4 - idx) * 7 * 24 * 60 * 60 * 1000);
            // Simple logic to map aggregated weeks to our 4 buckets (approximate)
            const foundWeek = leadsLast4Weeks.find(w => {
                const diff = Math.abs(new Date(w.date) - weekDate);
                return diff < 604800000; // within a week
            });
            return {
                week: `Week ${idx}`,
                views: Math.floor(stats.totalViews / 4) + (Math.random() * 10), // Mock views distribution for now as we track total views only on item level
                leads: foundWeek ? foundWeek.count : 0
            };
        });

        // Map leads to assets for performance tracking
        const assetLeadsMap = {};
        assetIds.forEach(id => {
            const idStr = id.toString();
            const assetLeadsCount = newLeads.filter(l => l.assetId?.toString() === idStr).length +
                                    activities.filter(a => a.assetId?.toString() === idStr).length;
            assetLeadsMap[idStr] = assetLeadsCount;
        });

        // Top Performing Assets (Most Leads)
        const topAssets = [...detailedItems]
            .map(item => ({
                ...item,
                leads: assetLeadsMap[item.id.toString()] || 0
            }))
            .sort((a, b) => b.leads - a.leads || b.views - a.views)
            .slice(0, 5)
            .map(item => ({
                name: item.title,
                category: item.category,
                views: item.views,
                leads: item.leads,
                trend: item.leads > 0 ? 'Up' : 'Stable',
                color: item.leads > 0 ? 'text-emerald-500' : 'text-gray-400'
            }));

        // Needs Attention Assets (Good Views but Least Leads)
        // We define "good views" as at least the median views or at least 1 view if all are low
        const allViews = detailedItems.map(i => i.views).sort((a, b) => a - b);
        const medianViews = allViews.length > 0 ? allViews[Math.floor(allViews.length / 2)] : 0;

        const bottomAssets = [...detailedItems]
            .map(item => ({
                ...item,
                leads: assetLeadsMap[item.id.toString()] || 0
            }))
            .filter(item => item.views >= Math.max(1, medianViews)) // Only consider items that people are actually seeing
            .sort((a, b) => a.leads - b.leads || b.views - a.views) // Sort by least leads first, then by most views if leads are equal
            .slice(0, 5)
            .map(item => ({
                name: item.title,
                category: item.category,
                views: item.views,
                leads: item.leads,
                trend: 'Down',
                color: 'text-orange-500'
            }));

        // Leads by Category
        const categoryCounts = {
            'CarAsset': 0,
            'YachtAsset': 0,
            'EstateAsset': 0,
            'BikeAsset': 0
        };

        [...newLeads, ...activities].forEach(leadOrAct => {
            const item = detailedItems.find(i =>
                (leadOrAct.assetId && i.id.toString() === leadOrAct.assetId.toString()) ||
                (leadOrAct.assetTitle && i.title === leadOrAct.assetTitle)
            );
            if (item) {
                categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
            }
        });

        const leadsByCategory = [
            { label: 'Cars', count: categoryCounts['CarAsset'] || 0 },
            { label: 'Yachts', count: categoryCounts['YachtAsset'] || 0 },
            { label: 'Real Estate', count: categoryCounts['EstateAsset'] || 0 },
            { label: 'Bikes', count: categoryCounts['BikeAsset'] || 0 }
        ];

        res.json({
            plan: user.plan,
            userProfile: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                whatsapp: user.whatsapp,
                jobTitle: user.jobTitle,
                language: user.language,
                timezone: user.timezone,
                preferredContact: user.preferredContact,
                agentDescription: user.agentDescription,
                social: user.social,
                coverPhoto: user.coverPhoto,
                plan: user.plan,
                profilePicture: user.profilePicture,
                company: user.company,
                planExpiresAt: user.planExpiresAt,
                memberSince: user.createdAt,
                verificationStatus: user.verificationStatus,
                isVerified: user.isVerified,
                leadEmailNotifications: user.leadEmailNotifications
            },
            stats,
            inventory: detailedItems,
            leads: leadsTable,
            notifications: user.notifications || [],
            topAssets,
            bottomAssets,
            analytics: {
                performanceTrend: performanceHistory,
                leadsByCategory,
                leadsByLocation: [ // Placeholder as we don't have location data yet
                    { country: 'United States', count: Math.floor(stats.totalLeads * 0.4) },
                    { country: 'United Kingdom', count: Math.floor(stats.totalLeads * 0.3) },
                    { country: 'UAE', count: Math.floor(stats.totalLeads * 0.2) },
                    { country: 'Other', count: Math.floor(stats.totalLeads * 0.1) }
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
        const modelLower = (model || "").toLowerCase();
        
        if (modelLower.includes('car') || modelLower.includes('vehicle')) Model = CarAsset;
        else if (modelLower.includes('estate') || modelLower.includes('real')) Model = EstateAsset;
        else if (modelLower.includes('bike')) Model = BikeAsset;
        else if (modelLower.includes('yacht')) Model = YachtAsset;
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
