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
const { cloudinary } = require('../config/cloudinary');

// Setup storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/temp');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'images') {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
            if (allowed.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only .jpg, .png and .jpeg are allowed for images'), false);
            }
        } else {
            cb(null, true);
        }
    }
});

// Cloudinary Helpers
const getPublicId = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    let publicIdWithExtension;
    // Check if the part after 'upload' is a version (starts with 'v' followed by numbers)
    if (parts[uploadIndex + 1].startsWith('v') && !isNaN(parts[uploadIndex + 1].substring(1))) {
        publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
    } else {
        publicIdWithExtension = parts.slice(uploadIndex + 1).join('/');
    }
    return publicIdWithExtension.split('.')[0];
};

const deleteFromCloudinary = async (url) => {
    const publicId = getPublicId(url);
    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (err) {
            console.error(`Failed to delete ${publicId} from Cloudinary:`, err);
        }
    }
};

const deleteFolderFromCloudinary = async (folderPath) => {
    try {
        // Delete all resources in the folder first (images, raw files, and videos)
        await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'image' });
        await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'raw' });
        await cloudinary.api.delete_resources_by_prefix(folderPath, { resource_type: 'video' });

        // Then delete the folder itself
        await cloudinary.api.delete_folder(folderPath);
        console.log(`Cloudinary folder deleted: ${folderPath}`);
    } catch (err) {
        // If folder doesn't exist or other error, log it but don't crash
        console.error(`Cloudinary folder deletion error (${folderPath}):`, err.message);
    }
};

/**
 * CREATE LISTING
 * POST /api/listings/create
 */
router.post('/create', authMiddleware, upload.fields([
    { name: 'images', maxCount: 15 },
    { name: 'documents', maxCount: 3 },
    { name: 'registrationRC', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'serviceHistory', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'taxId', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 },
    { name: 'dealershipCertificate', maxCount: 1 },
    { name: 'insuranceProof', maxCount: 1 }
]), async (req, res) => {
    try {
        let { title, price, category, location, description } = req.body;
        if (!location) location = 'Unspecified';

        // Auto-generate title if not provided
        if (!title) {
            const makeOrBrand = req.body.make || req.body.brand || req.body.builder || '';
            const model = req.body.model || '';
            const variant = req.body.variant || '';

            if (makeOrBrand || model) {
                title = `${makeOrBrand} ${model} ${variant}`.trim();
            } else if (req.body.propertyName) {
                title = req.body.propertyName;
            } else if (req.body.yachtName) {
                title = req.body.yachtName;
            } else {
                title = `Untitled ${category} Asset`;
            }
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Enforce tiered limits
        const planLimits = {
            'Freemium': 5,
            'Premium Basic': 25,
            'Business VIP': 100
        };

        const currentLimit = planLimits[user.plan] || 5;

        if (user.myListings.length >= currentLimit) {
            return res.status(403).json({
                error: "LIMIT_REACHED",
                message: `You have reached the listing limit for your ${user.plan} plan (${currentLimit} assets). Please upgrade to list more.`
            });
        }

        // Featured listing based on plan
        // Premium Basic: 5 days featured
        // Business VIP: 13 days featured
        // Freemium: No featured
        let isFeatured = false;
        let featuredExpiresAt = null;

        if (user.plan === 'Premium Basic') {
            isFeatured = true;
            featuredExpiresAt = new Date();
            featuredExpiresAt.setDate(featuredExpiresAt.getDate() + 5); // 5 days
        } else if (user.plan === 'Business VIP') {
            isFeatured = true;
            featuredExpiresAt = new Date();
            featuredExpiresAt.setDate(featuredExpiresAt.getDate() + 13); // 13 days
        }

        // Handle files
        const imageFiles = req.files['images'] || [];
        const docFiles = req.files['documents'] || [];



        // Define Base Data
        const baseData = {
            title,
            price: Number(price),
            location,
            description: description || 'No description provided',
            images: [],
            documents: [],
            status: req.body.isPublic === 'true' || req.body.isPublic === true ? 'Active' : 'Draft',
            type: req.body.type || 'Sale',
            acquisition: (req.body.type === 'Rent' ? 'rent' : 'buy'),
            agent: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                photo: user.profilePicture,
                company: 'Otulia Private Seller',
                companyLogo: user.profilePicture,
                joined: new Date(user.createdAt).getFullYear(),
                createdAt: user.createdAt
            }
        };

        let newListing;
        let modelType;
        switch (category) {
            case 'Car': newListing = new CarAsset({ ...baseData, category: 'vehicles' }); modelType = 'CarAsset'; break;
            case 'Bike': newListing = new BikeAsset({ ...baseData, category: 'bikes' }); modelType = 'BikeAsset'; break;
            case 'Yacht': newListing = new YachtAsset({ ...baseData, category: 'yachts' }); modelType = 'YachtAsset'; break;
            case 'Estate': newListing = new EstateAsset({ ...baseData, category: 'estates' }); modelType = 'EstateAsset'; break;
            default: newListing = new Listing({ ...baseData, category: category || 'General' }); modelType = 'Listing';
        }

        const savedListing = await newListing.save();
        const assetId = savedListing._id.toString();
        const folderPath = `${category}/${assetId}`;

        const imageUrls = [];
        const docUrls = [];

        try {
            if (req.files['images']) {
                for (const file of req.files['images']) {
                    const result = await cloudinary.uploader.upload(file.path, { folder: folderPath });
                    imageUrls.push(result.secure_url);
                    fs.unlinkSync(file.path);
                }
            }
            const docFields = ['documents', 'registrationRC', 'insurance', 'serviceHistory', 'businessLicense', 'taxId', 'proofOfAddress', 'dealershipCertificate', 'insuranceProof'];
            for (const field of docFields) {
                if (req.files[field]) {
                    for (const file of req.files[field]) {
                        const result = await cloudinary.uploader.upload(file.path, { folder: folderPath, resource_type: 'auto' });
                        docUrls.push(result.secure_url);
                        fs.unlinkSync(file.path);
                    }
                }
            }
        } catch (uploadError) {
            console.error("Cloudinary Upload Error:", uploadError);
        }

        const updateData = { images: imageUrls, documents: docUrls };
        if (category === 'Car') {
            updateData.brand = req.body.make || 'Unknown';
            updateData.variant = req.body.variant;
            updateData.highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.keySpecifications = {
                power: req.body.horsepower,
                mileage: req.body.mileage,
                cylinderCapacity: req.body.cylinderCapacity,
                topSpeed: req.body.topSpeed,
                engineType: req.body.engineType
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                model: req.body.model,
                variant: req.body.variant,
                body: req.body.bodyType,
                series: req.body.series,
                mileage: req.body.mileage,
                power: req.body.horsepower,
                cylinderCapacity: req.body.cylinderCapacity,
                configuration: req.body.configuration,
                topSpeed: req.body.topSpeed,
                engineType: req.body.engineType,
                steering: req.body.steering,
                transmission: req.body.transmission,
                drive: req.body.driveType,
                fuel: req.body.fuelType,
                interiorMaterial: req.body.interiorMaterial,
                interiorColor: req.body.interiorColor,
                exteriorColor: req.body.exteriorColor,
                manufacturerColorCode: req.body.manufacturerColorCode,
                matchingNumbers: req.body.matchingNumbers,
                condition: req.body.condition,
                accidentFree: req.body.accidentFree,
                accidentHistory: req.body.accidentHistory,
                countryOfFirstDelivery: req.body.countryOfFirstDelivery,
                numberOfOwners: req.body.numberOfOwners,
                carLocation: req.body.currentCarLocation || location,
            };
        } else if (category === 'Bike') {
            updateData.brand = req.body.brand;
            updateData.variant = req.body.variant;
            updateData.highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.keySpecifications = {
                engineCapacity: req.body.engineCapacity,
                mileage: req.body.mileage,
                fuelType: req.body.fuelType,
                transmission: req.body.transmission,
                color: req.body.color
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                brand: req.body.brand,
                model: req.body.model,
                variant: req.body.variant,
                engineCapacityCC: req.body.engineCapacity,
                mileageKM: req.body.mileage,
                fuelType: req.body.fuelType,
                transmission: req.body.transmission,
                color: req.body.color,
                condition: req.body.condition,
                ownershipCount: req.body.ownershipCount,
                accidentHistory: req.body.accidentHistory
            };
        } else if (category === 'Yacht') {
            updateData.builder = req.body.builder;
            updateData.highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.keySpecifications = {
                length: req.body.length,
                beam: req.body.beam,
                draft: req.body.draft,
                cruisingSpeed: req.body.cruisingSpeed,
                guestCapacity: req.body.guestCapacity,
                crewCapacity: req.body.crewCapacity,
                engineType: req.body.engineType
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                brandBuilder: req.body.builder,
                model: req.body.model,
                length: req.body.length,
                beam: req.body.beam,
                draft: req.body.draft,
                engineType: req.body.engineType,
                cruisingSpeed: req.body.cruisingSpeed,
                guestCapacity: req.body.guestCapacity,
                crewCapacity: req.body.crewCapacity,
                yachtLocation: req.body.location,
                fuelType: req.body.fuelType,
                hullMaterial: req.body.hullMaterial,
                condition: req.body.condition
            };
        } else if (category === 'Estate') {
            updateData.propertyName = req.body.propertyName;
            updateData.highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];
            updateData.smartHomeSystems = req.body.smartHomeSystems ? JSON.parse(req.body.smartHomeSystems) : [];
            updateData.viewTypes = req.body.viewTypes ? JSON.parse(req.body.viewTypes) : [];
            updateData.keySpecifications = {
                bedrooms: req.body.bedrooms,
                bathrooms: req.body.bathrooms,
                floors: req.body.floors,
                builtUpArea: req.body.builtUpArea,
                landArea: req.body.landArea,
                propertyType: req.body.propertyType
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                propertyType: req.body.propertyType,
                architectureStyle: req.body.architectureStyle,
                builtUpArea: req.body.builtUpArea,
                landArea: req.body.landArea,
                floors: req.body.floors,
                bedrooms: req.body.bedrooms,
                bathrooms: req.body.bathrooms,
                furnishingStatus: req.body.furnishingStatus,
                configuration: req.body.configuration,
                interiorMaterial: req.body.interiorMaterial,
                interiorColorTheme: req.body.interiorColorTheme,
                exteriorFinish: req.body.exteriorFinish,
                climateControl: req.body.climateControl,
                condition: req.body.condition,
                usageStatus: req.body.usageStatus,
                country: req.body.country,
                city: req.body.city,
                address: req.body.address,
                areaNeighborhood: req.body.areaNeighborhood,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            };
        }

        let Model;
        switch (category) {
            case 'Car': Model = CarAsset; break;
            case 'Bike': Model = BikeAsset; break;
            case 'Yacht': Model = YachtAsset; break;
            case 'Estate': Model = EstateAsset; break;
            default: Model = Listing;
        }

        const finalListing = await Model.findByIdAndUpdate(savedListing._id, updateData, { new: true });
        await User.findByIdAndUpdate(req.user.id, {
            $push: { myListings: { item: finalListing._id, itemModel: modelType } }
        });
        res.status(201).json(finalListing);
    } catch (error) {
        console.error("Create Listing Error:", error);
        res.status(500).json({ error: "Failed to create listing" });
    }
});

/**
 * UPDATE LISTING
 * PUT /api/listings/:id
 */
router.put('/:id', authMiddleware, upload.fields([
    { name: 'images', maxCount: 15 },
    { name: 'documents', maxCount: 3 },
    { name: 'registrationRC', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'serviceHistory', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 },
    { name: 'taxId', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 },
    { name: 'dealershipCertificate', maxCount: 1 },
    { name: 'insuranceProof', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, location, description, type, isPublic, videoUrl } = req.body;
        const user = await User.findById(req.user.id);

        const listingEntry = user.myListings.find(entry => entry.item && entry.item.toString() === id);
        if (!listingEntry) return res.status(404).json({ error: "Listing not found in your profile." });

        const modelName = listingEntry.itemModel || 'Listing';
        let Model;
        let categoryName;
        switch (modelName) {
            case 'CarAsset': Model = CarAsset; categoryName = 'Car'; break;
            case 'BikeAsset': Model = BikeAsset; categoryName = 'Bike'; break;
            case 'YachtAsset': Model = YachtAsset; categoryName = 'Yacht'; break;
            case 'EstateAsset': Model = EstateAsset; categoryName = 'Estate'; break;
            default: Model = Listing; categoryName = 'General';
        }

        const listing = await Model.findById(id);
        if (!listing) return res.status(404).json({ error: "Listing not found." });

        const folderPath = `${categoryName}/${id}`;

        if (req.files['images']) {
            // Delete old images from Cloudinary
            if (listing.images && listing.images.length > 0) {
                for (const oldUrl of listing.images) {
                    await deleteFromCloudinary(oldUrl);
                }
            }

            const newImageUrls = [];
            for (const file of req.files['images']) {
                const result = await cloudinary.uploader.upload(file.path, { folder: folderPath });
                newImageUrls.push(result.secure_url);
                fs.unlinkSync(file.path);
            }
            listing.images = newImageUrls.slice(0, 15);
        }

        const docFields = ['documents', 'registrationRC', 'insurance', 'serviceHistory', 'businessLicense', 'taxId', 'proofOfAddress', 'dealershipCertificate', 'insuranceProof'];
        for (const field of docFields) {
            if (req.files[field]) {
                // Delete old documents from Cloudinary
                if (listing.documents && listing.documents.length > 0) {
                    for (const oldUrl of listing.documents) {
                        await deleteFromCloudinary(oldUrl);
                    }
                }

                const newDocUrls = [];
                for (const file of req.files[field]) {
                    const result = await cloudinary.uploader.upload(file.path, { folder: folderPath, resource_type: 'auto' });
                    newDocUrls.push(result.secure_url);
                    fs.unlinkSync(file.path);
                }
                listing.documents = newDocUrls.slice(0, 10);
            }
        }

        if (title) listing.title = title;
        if (price !== undefined) listing.price = Number(price);
        if (location) listing.location = location;
        if (description) listing.description = description;
        if (type) {
            listing.type = type;
            listing.acquisition = (type === 'Rent' ? 'rent' : 'buy');
        }
        if (videoUrl !== undefined) listing.videoUrl = videoUrl;
        if (isPublic !== undefined) listing.status = (isPublic === 'true' || isPublic === true) ? 'Active' : 'Draft';

        if (req.body.highlights) {
            try {
                listing.highlights = JSON.parse(req.body.highlights);
            } catch (e) {
                if (Array.isArray(req.body.highlights)) listing.highlights = req.body.highlights;
            }
        }

        // --- TYPE SPECIFIC UPDATES ---

        if (modelName === 'CarAsset') {
            if (req.body.make) listing.brand = req.body.make;
            if (req.body.variant) listing.variant = req.body.variant;

            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.variant) spec.variant = req.body.variant;
            if (req.body.bodyType) spec.body = req.body.bodyType;
            if (req.body.series) spec.series = req.body.series;
            if (req.body.mileage) { spec.mileage = req.body.mileage; keySpec.mileage = req.body.mileage; }
            if (req.body.horsepower) { spec.power = req.body.horsepower; keySpec.power = req.body.horsepower; }
            if (req.body.cylinderCapacity) { spec.cylinderCapacity = req.body.cylinderCapacity; keySpec.cylinderCapacity = req.body.cylinderCapacity; }
            if (req.body.configuration) spec.configuration = req.body.configuration;
            if (req.body.topSpeed) { spec.topSpeed = req.body.topSpeed; keySpec.topSpeed = req.body.topSpeed; }
            if (req.body.engineType) { spec.engineType = req.body.engineType; keySpec.engineType = req.body.engineType; }
            if (req.body.steering) spec.steering = req.body.steering;
            if (req.body.transmission) spec.transmission = req.body.transmission;
            if (req.body.driveType) spec.drive = req.body.driveType;
            if (req.body.fuelType) spec.fuel = req.body.fuelType;
            if (req.body.interiorMaterial) spec.interiorMaterial = req.body.interiorMaterial;
            if (req.body.interiorColor) spec.interiorColor = req.body.interiorColor;
            if (req.body.exteriorColor) spec.exteriorColor = req.body.exteriorColor;
            if (req.body.manufacturerColorCode) spec.manufacturerColorCode = req.body.manufacturerColorCode;
            if (req.body.matchingNumbers) spec.matchingNumbers = req.body.matchingNumbers;
            if (req.body.condition) spec.condition = req.body.condition;
            if (req.body.accidentFree) spec.accidentFree = req.body.accidentFree;
            if (req.body.accidentHistory) spec.accidentHistory = req.body.accidentHistory;
            if (req.body.countryOfFirstDelivery) spec.countryOfFirstDelivery = req.body.countryOfFirstDelivery;
            if (req.body.numberOfOwners) spec.numberOfOwners = Number(req.body.numberOfOwners);
            if (req.body.currentCarLocation || location) spec.carLocation = req.body.currentCarLocation || location;

            listing.specification = spec;
            listing.keySpecifications = keySpec;
            listing.markModified('specification');
            listing.markModified('keySpecifications');

        } else if (modelName === 'BikeAsset') {
            if (req.body.brand) listing.brand = req.body.brand;
            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.brand) spec.brand = req.body.brand;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.variant) spec.variant = req.body.variant;
            if (req.body.engineCapacity) { spec.engineCapacityCC = Number(req.body.engineCapacity); keySpec.engineCapacity = req.body.engineCapacity; }
            if (req.body.mileage) { spec.mileageKM = Number(req.body.mileage); keySpec.mileage = req.body.mileage; }
            if (req.body.fuelType) { spec.fuelType = req.body.fuelType; keySpec.fuelType = req.body.fuelType; }
            if (req.body.transmission) { spec.transmission = req.body.transmission; keySpec.transmission = req.body.transmission; }
            if (req.body.color) { spec.color = req.body.color; keySpec.color = req.body.color; }
            if (req.body.condition) spec.condition = req.body.condition;
            if (req.body.ownershipCount) spec.ownershipCount = Number(req.body.ownershipCount);
            if (req.body.accidentHistory) spec.accidentHistory = req.body.accidentHistory;

            // Handle Specific Bike Documents (Sync with Cloudinary logic)
            const bikeDocFields = ['registrationRC', 'insurance', 'serviceHistory'];
            for (const field of bikeDocFields) {
                if (req.files[field]) {
                    // Extract existing URL from documents array if present (this part is tricky since they are all in one array)
                    // For simplicity, we are appending all to 'documents' field in the model.
                    // If you need specific fields in the model for these, they should be added to the schema.
                    // Currently everything uploaded as a doc goes into listing.documents.
                }
            }

            listing.specification = spec;
            listing.keySpecifications = keySpec;
            listing.markModified('specification');
            listing.markModified('keySpecifications');

        } else if (modelName === 'YachtAsset') {
            if (req.body.builder) listing.builder = req.body.builder;
            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.builder) spec.brandBuilder = req.body.builder;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.length) { spec.length = req.body.length; keySpec.length = req.body.length; }
            if (req.body.beam) { spec.beam = req.body.beam; keySpec.beam = req.body.beam; }
            if (req.body.draft) { spec.draft = req.body.draft; keySpec.draft = req.body.draft; }
            if (req.body.engineType) { spec.engineType = req.body.engineType; keySpec.engineType = req.body.engineType; }
            if (req.body.cruisingSpeed) { spec.cruisingSpeed = req.body.cruisingSpeed; keySpec.cruisingSpeed = req.body.cruisingSpeed; }
            if (req.body.guestCapacity) { spec.guestCapacity = req.body.guestCapacity; keySpec.guestCapacity = req.body.guestCapacity; }
            if (req.body.crewCapacity) { spec.crewCapacity = req.body.crewCapacity; keySpec.crewCapacity = req.body.crewCapacity; }
            if (location) spec.yachtLocation = location;

            listing.specification = spec;
            listing.keySpecifications = keySpec;
            listing.markModified('specification');
            listing.markModified('keySpecifications');

        } else if (modelName === 'EstateAsset') {
            if (req.body.propertyName) listing.propertyName = req.body.propertyName;
            if (req.body.amenities) listing.amenities = JSON.parse(req.body.amenities);
            if (req.body.smartHomeSystems) listing.smartHomeSystems = JSON.parse(req.body.smartHomeSystems);
            if (req.body.viewTypes) listing.viewTypes = JSON.parse(req.body.viewTypes);

            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.propertyType) { spec.propertyType = req.body.propertyType; keySpec.propertyType = req.body.propertyType; }
            if (req.body.builtUpArea) { spec.builtUpArea = req.body.builtUpArea; keySpec.builtUpArea = req.body.builtUpArea; }
            if (req.body.landArea) { spec.landArea = req.body.landArea; keySpec.landArea = req.body.landArea; }
            if (req.body.floors) { spec.floors = Number(req.body.floors); keySpec.floors = req.body.floors; }
            if (req.body.bedrooms) { spec.bedrooms = Number(req.body.bedrooms); keySpec.bedrooms = req.body.bedrooms; }
            if (req.body.bathrooms) { spec.bathrooms = Number(req.body.bathrooms); keySpec.bathrooms = req.body.bathrooms; }
            if (req.body.architectureStyle) spec.architectureStyle = req.body.architectureStyle;
            if (req.body.furnishingStatus) spec.furnishingStatus = req.body.furnishingStatus;
            if (req.body.configuration) spec.configuration = req.body.configuration;
            if (req.body.interiorMaterial) spec.interiorMaterial = req.body.interiorMaterial;
            if (req.body.interiorColorTheme) spec.interiorColorTheme = req.body.interiorColorTheme;
            if (req.body.exteriorFinish) spec.exteriorFinish = req.body.exteriorFinish;
            if (req.body.climateControl) spec.climateControl = req.body.climateControl;
            if (req.body.condition) spec.condition = req.body.condition;
            if (req.body.usageStatus) spec.usageStatus = req.body.usageStatus;
            if (req.body.country) spec.country = req.body.country;
            if (req.body.city) spec.city = req.body.city;
            if (req.body.address) spec.address = req.body.address;
            if (req.body.areaNeighborhood) spec.areaNeighborhood = req.body.areaNeighborhood;
            if (req.body.latitude) spec.latitude = req.body.latitude;
            if (req.body.longitude) spec.longitude = req.body.longitude;

            listing.specification = spec;
            listing.keySpecifications = keySpec;
            listing.markModified('specification');
            listing.markModified('keySpecifications');
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
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user.id);
        const listingEntry = user.myListings.find(entry => entry.item && entry.item.toString() === id);
        if (!listingEntry) return res.status(404).json({ error: "Listing not found in your profile." });

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

        // Delete the entire asset folder from Cloudinary
        let categoryName;
        switch (modelName) {
            case 'CarAsset': categoryName = 'Car'; break;
            case 'BikeAsset': categoryName = 'Bike'; break;
            case 'YachtAsset': categoryName = 'Yacht'; break;
            case 'EstateAsset': categoryName = 'Estate'; break;
            default: categoryName = 'General';
        }
        const folderPath = `${categoryName}/${id}`;
        await deleteFolderFromCloudinary(folderPath);

        await Model.findByIdAndDelete(id);
        await User.findByIdAndUpdate(req.user.id, { $pull: { myListings: { item: id } } });
        res.json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.error("Delete Listing Error:", error);
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

module.exports = router;
