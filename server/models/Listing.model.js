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

        documents: [
            {
                type: String, // URL/Path to document
                required: false
            }
        ],

        status: {
            type: String,
            enum: ['Active', 'Sold', 'Rented'],
            default: 'Active'
        },

        type: {
            type: String,
            enum: ['Sale', 'Rent'],
            default: 'Sale'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);