const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usageCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Check if coupon is valid
couponSchema.methods.isValid = function() {
    const now = new Date();
    const isNotExpired = this.expiresAt > now;
    const isUnderLimit = this.usageLimit === null || this.usageCount < this.usageLimit;
    return this.isActive && isNotExpired && isUnderLimit;
};

module.exports = mongoose.model('Coupon', couponSchema);
