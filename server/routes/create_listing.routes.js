const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Listing = require('../models/Listing.model');
const CarAsset = require('../models/CarAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const User = require('../models/User.model');
const authMiddleware = require('../middleware/auth.middleware');

// Setup storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\\s/g, '_'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * CREATE LISTING
 * POST /api/listings/create
 */
router.post('/create', authMiddleware, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'documents', maxCount: 3 }]), async (req, res) => {
    try {
        const { title, price, category, location, description } = req.body;

        // Fetch full user details from DB since token might not have name
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Enforce limits for Freemium users
        if (user.plan === 'Freemium' && user.myListings.length >= 5) {
            return res.status(403).json({
                error: "LIMIT_REACHED",
                message: "Freemium users are limited to 5 listings. Please upgrade to list more assets."
            });
        }

        // Handle files
        const imageFiles = req.files['images'] || [];
        const docFiles = req.files['documents'] || [];

        const imageUrls = imageFiles.map(file => `/uploads/${file.filename}`);
        const docUrls = docFiles.map(file => `/uploads/${file.filename}`);

        // Define Base Data
        const baseData = {
            title,
            price: Number(price),
            location,
            description: description || 'No description provided',
            images: imageUrls,
            documents: docUrls,
            status: 'Active',
            type: req.body.type || 'Sale',
            agent: {
                id: user._id,
                name: user.name, // Now cleanly coming from DB
                email: user.email,
                photo: user.profilePicture,
                company: 'Otulia Private Seller',
                companyLogo: user.profilePicture,
                joined: new Date(user.createdAt).getFullYear()
            }
        };

        let newListing;
        let modelType;

        // Switch Model Construction
        switch (category) {
            case 'Car':
                newListing = new CarAsset({
                    ...baseData,
                    category: 'vehicles',
                    brand: 'Unknown',
                    specification: { carLocation: location }
                });
                modelType = 'CarAsset';
                break;
            case 'Bike':
                newListing = new BikeAsset({
                    ...baseData,
                    category: 'bikes',
                    brand: 'Unknown'
                });
                modelType = 'BikeAsset';
                break;
            case 'Yacht':
                newListing = new YachtAsset({
                    ...baseData,
                    category: 'yachts',
                    brand: 'Unknown'
                });
                modelType = 'YachtAsset';
                break;
            case 'Estate':
                newListing = new EstateAsset({
                    ...baseData,
                    category: 'estates',
                    specification: { country: location }
                });
                modelType = 'EstateAsset';
                break;
            default:
                // Fallback to generic Listing if category not matched
                newListing = new Listing({
                    ...baseData,
                    category: category || 'General',
                    type: req.body.type || 'Sale',
                    dealer: baseData.agent
                });
                modelType = 'Listing';
        }

        const savedListing = await newListing.save();

        // Link to User with Model Type
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                myListings: {
                    item: savedListing._id,
                    itemModel: modelType
                }
            }
        });

        res.status(201).json(savedListing);
    } catch (error) {
        console.error("Create Listing Error:", error);
        res.status(500).json({ error: "Failed to create listing" });
    }
});

/**
 * UPDATE LISTING
 * PUT /api/listings/:id
 */
router.put('/:id', authMiddleware, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'documents', maxCount: 3 }]), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, location, description, type } = req.body;
        const user = await User.findById(req.user.id);

        const listingEntry = user.myListings.find(entry => entry.item && entry.item.toString() === id);
        if (!listingEntry) {
            return res.status(404).json({ error: "Listing not found in your profile." });
        }

        const modelName = listingEntry.itemModel || 'Listing';
        let Model;
        switch (modelName) {
            case 'CarAsset': Model = CarAsset; break;
            case 'BikeAsset': Model = BikeAsset; break;
            case 'YachtAsset': Model = YachtAsset; break;
            case 'EstateAsset': Model = EstateAsset; break;
            default: Model = Listing;
        }

        const listing = await Model.findById(id);
        if (!listing) return res.status(404).json({ error: "Listing not found." });

        // Update fields
        listing.title = title || listing.title;
        listing.price = price ? Number(price) : listing.price;
        listing.location = location || listing.location;
        listing.description = description || listing.description;
        listing.type = type || listing.type;

        // Handle new files if any
        if (req.files['images']) {
            const newImages = req.files['images'].map(file => `/uploads/${file.filename}`);
            listing.images = [...listing.images, ...newImages].slice(0, 5);
        }
        if (req.files['documents']) {
            const newDocs = req.files['documents'].map(file => `/uploads/${file.filename}`);
            listing.documents = [...listing.documents, ...newDocs].slice(0, 3);
        }

        const updatedListing = await listing.save();
        res.json(updatedListing);
    } catch (error) {
        console.error("Update Listing Error:", error);
        res.status(500).json({ error: "Failed to update listing" });
    }
});

/**
 * DELETE LISTING
 * DELETE /api/listings/:id
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.id);

        // 1. Find the listing in User's my listings to verify ownership and get itemModel
        const listingEntry = user.myListings.find(entry => entry.item && entry.item.toString() === id);

        if (!listingEntry) {
            return res.status(404).json({ error: "Listing not found in your profile." });
        }

        const modelName = listingEntry.itemModel || 'Listing';
        let Model;

        switch (modelName) {
            case 'CarAsset': Model = CarAsset; break;
            case 'BikeAsset': Model = BikeAsset; break;
            case 'YachtAsset': Model = YachtAsset; break;
            case 'EstateAsset': Model = EstateAsset; break;
            default: Model = Listing;
        }

        const listing = await Model.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found." });
        }

        // 2. Delete Files
        const filesToDelete = [...(listing.images || []), ...(listing.documents || [])];
        filesToDelete.forEach(filePath => {
            const absolutePath = path.join(__dirname, '..', filePath); // filePath starts with /uploads
            // Check if file exists to avoid crashes
            if (fs.existsSync(absolutePath)) {
                fs.unlink(absolutePath, (err) => {
                    if (err) console.error("Failed to delete file:", absolutePath, err);
                });
            }
        });

        // 3. Delete from Listing Collection
        await Model.findByIdAndDelete(id);

        // 4. Remove from User's myListings
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { myListings: { item: id } }
        });

        res.json({ message: "Listing deleted successfully" });

    } catch (error) {
        console.error("Delete Listing Error:", error);
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

module.exports = router;
