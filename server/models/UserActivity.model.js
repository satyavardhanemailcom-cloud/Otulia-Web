const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        assetModel: {
            type: String,
            required: true,
            enum: ["CarAsset", "EstateAsset", "YachtAsset", "BikeAsset"],
        },
        activityType: {
            type: String,
            required: true,
            enum: ["VIEW", "CALL_AGENT", "INQUIRY", "BUY_REQUEST", "RENT_REQUEST"],
        },
        status: {
            type: String,
            default: "New",
            enum: ["New", "Contacted", "Negotiating", "Closed"],
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
