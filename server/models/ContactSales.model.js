const mongoose = require('mongoose');

const contactSalesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    inquiryType: { type: String, default: 'Custom Solution' },
    message: { type: String, required: true },
    estimatedListings: { type: String },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactSales', contactSalesSchema);
