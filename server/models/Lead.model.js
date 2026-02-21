const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        agentId: {
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
        assetTitle: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "New",
            enum: ["New", "Contacted", "Negotiating", "Closed"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
