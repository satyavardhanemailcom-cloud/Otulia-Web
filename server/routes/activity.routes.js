const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const UserActivity = require("../models/UserActivity.model");
const router = express.Router();

/**
 * RECORD ACTIVITY
 * POST /api/activity/record
 */
router.post("/record", authMiddleware, async (req, res) => {
    try {
        const { assetId, assetModel, activityType, metadata } = req.body;

        const activity = new UserActivity({
            userId: req.user.id,
            assetId,
            assetModel,
            activityType,
            metadata,
        });

        await activity.save();

        res.status(201).json({ message: "ACTIVITY_RECORDED", activity });
    } catch (error) {
        console.error("Activity Record Error:", error);
        res.status(500).json({ error: "FAILED_TO_RECORD_ACTIVITY" });
    }
});

/**
 * GET USER ACTIVITY
 * GET /api/activity/me
 */
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const activities = await UserActivity.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: "FAILED_TO_FETCH_ACTIVITY" });
    }
});

module.exports = router;
