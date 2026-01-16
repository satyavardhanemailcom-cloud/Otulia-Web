const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        images: [
            {
                type: String,
                required: true,
            },
        ],

        price: {
            type: Number,
            required: true,
        },

        category: {
            type: String,
            required: true, // car , bike , yacht, estate
        },

        location: {
            type: String,
            required: true,
        },

        dealer: {
            name: String,
            phone: String,
            email: String,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        views: {
            type: Number,
            default: 0,
        },

        bookings: {
            type: Number,
            default: 0
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Listing", listingSchema);