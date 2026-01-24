const mongoose = require("mongoose");

const sellerLeadSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        contactConsent: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SellerLead", sellerLeadSchema);
