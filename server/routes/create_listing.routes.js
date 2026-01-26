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
        let { title, price, category, location, description } = req.body;

        if (!title && req.body.make && req.body.model) {
            title = `${req.body.make} ${req.body.model} ${req.body.variant || ''}`.trim();
        }

        // Fetch full user details from DB since token might not have name
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

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
            status: req.body.isPublic === 'true' || req.body.isPublic === true ? 'Active' : 'Draft',
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
                    brand: req.body.make || 'Unknown',
                    variant: req.body.variant,
                    highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
                    videoUrl: req.body.videoUrl,
                    keySpecifications: {
                        power: req.body.horsepower,
                        mileage: req.body.mileage,
                        cylinderCapacity: req.body.cylinderCapacity,
                        topSpeed: req.body.topSpeed
                    },
                    specification: {
                        yearOfConstruction: req.body.year,
                        model: req.body.model,
                        variant: req.body.variant,
                        body: req.body.bodyType,
                        series: req.body.series,
                        mileage: req.body.mileage,
                        power: req.body.horsepower,
                        cylinderCapacity: req.body.cylinderCapacity,
                        topSpeed: req.body.topSpeed,
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
                    }
                });
                modelType = 'CarAsset';
                break;
            case 'Bike':
                if (!title && req.body.brand && req.body.model) title = `${req.body.brand} ${req.body.model}`;
                newListing = new BikeAsset({
                    ...baseData,
                    title: title || `${req.body.brand} ${req.body.model}`,
                    category: 'bikes',
                    brand: req.body.brand,
                    variant: req.body.variant,
                    highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
                    videoUrl: req.body.videoUrl,
                    keySpecifications: {
                        engineCapacity: req.body.engineCapacity,
                        mileage: req.body.mileage,
                        fuelType: req.body.fuelType,
                        transmission: req.body.transmission,
                        color: req.body.color
                    },
                    specification: {
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
                    }
                });
                modelType = 'BikeAsset';
                break;
            case 'Yacht':
                if (!title && req.body.yachtName) title = req.body.yachtName;
                newListing = new YachtAsset({
                    ...baseData,
                    title: title || req.body.yachtName || `${req.body.builder} ${req.body.model}`,
                    category: 'yachts',
                    builder: req.body.builder,
                    highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
                    videoUrl: req.body.videoUrl,
                    keySpecifications: {
                        length: req.body.length,
                        beam: req.body.beam,
                        draft: req.body.draft,
                        cruisingSpeed: req.body.cruisingSpeed,
                        guestCapacity: req.body.guestCapacity,
                        crewCapacity: req.body.crewCapacity,
                        engineType: req.body.engineType
                    },
                    specification: {
                        yearOfConstruction: req.body.year,
                        builder: req.body.builder,
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
                    }
                });
                modelType = 'YachtAsset';
                break;
            case 'Estate':
                if (!title && req.body.propertyName) title = req.body.propertyName;
                newListing = new EstateAsset({
                    ...baseData,
                    title: title || req.body.propertyName || `${req.body.propertyType} in ${req.body.location}`,
                    category: 'estates',
                    propertyName: req.body.propertyName,
                    highlights: req.body.highlights ? JSON.parse(req.body.highlights) : [],
                    videoUrl: req.body.videoUrl,
                    amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
                    smartHomeSystems: req.body.smartHomeSystems ? JSON.parse(req.body.smartHomeSystems) : [],
                    viewTypes: req.body.viewTypes ? JSON.parse(req.body.viewTypes) : [],
                    keySpecifications: {
                        bedrooms: req.body.bedrooms,
                        bathrooms: req.body.bathrooms,
                        floors: req.body.floors,
                        builtUpArea: req.body.builtUpArea,
                        landArea: req.body.landArea,
                        propertyType: req.body.propertyType
                    },
                    specification: {
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
                    }
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
        // Common fields
        const { title, price, location, description, type, isPublic, videoUrl } = req.body;
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

        // Update Common Fields
        if (title) listing.title = title;
        if (price) listing.price = Number(price);
        if (location) listing.location = location;
        if (description) listing.description = description;
        if (type) listing.type = type;
        if (videoUrl !== undefined) listing.videoUrl = videoUrl;

        // Update Status/Visibility
        if (isPublic !== undefined) {
            listing.status = (isPublic === 'true' || isPublic === true) ? 'Active' : 'Draft';
        }

        // Update Highlights
        if (req.body.highlights) {
            try {
                listing.highlights = JSON.parse(req.body.highlights);
            } catch (e) {
                // If not JSON, maybe array or string?
                if (Array.isArray(req.body.highlights)) listing.highlights = req.body.highlights;
            }
        }

        // --- TYPE SPECIFIC UPDATES ---

        if (modelName === 'CarAsset') {
            // Update Top Level
            if (req.body.make) listing.brand = req.body.make;
            if (req.body.variant) listing.variant = req.body.variant;

            // Prepare Specs
            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            // Map Body -> Spec
            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.variant) spec.variant = req.body.variant;
            if (req.body.bodyType) spec.body = req.body.bodyType;
            if (req.body.series) spec.series = req.body.series;
            if (req.body.mileage) {
                spec.mileage = req.body.mileage;
                keySpec.mileage = req.body.mileage;
            }
            if (req.body.horsepower) {
                spec.power = req.body.horsepower;
                keySpec.power = req.body.horsepower;
            }
            if (req.body.cylinderCapacity) {
                spec.cylinderCapacity = req.body.cylinderCapacity;
                keySpec.cylinderCapacity = req.body.cylinderCapacity;
            }
            if (req.body.topSpeed) {
                spec.topSpeed = req.body.topSpeed;
                keySpec.topSpeed = req.body.topSpeed;
            }
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
            if (req.body.numberOfOwners) spec.numberOfOwners = req.body.numberOfOwners;
            if (req.body.currentCarLocation || location) spec.carLocation = req.body.currentCarLocation || location;

            listing.specification = spec;
            listing.keySpecifications = keySpec;

        } else if (modelName === 'BikeAsset') {
            if (req.body.brand) listing.brand = req.body.brand;

            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.brand) spec.brand = req.body.brand;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.variant) spec.variant = req.body.variant;
            if (req.body.engineCapacity) {
                spec.engineCapacityCC = req.body.engineCapacity;
                keySpec.engineCapacity = req.body.engineCapacity;
            }
            if (req.body.mileage) {
                spec.mileageKM = req.body.mileage;
                keySpec.mileage = req.body.mileage;
            }
            if (req.body.fuelType) {
                spec.fuelType = req.body.fuelType;
                keySpec.fuelType = req.body.fuelType;
            }
            if (req.body.transmission) {
                spec.transmission = req.body.transmission;
                keySpec.transmission = req.body.transmission;
            }
            if (req.body.color) {
                spec.color = req.body.color;
                keySpec.color = req.body.color;
            }
            if (req.body.condition) spec.condition = req.body.condition;
            if (req.body.ownershipCount) spec.ownershipCount = req.body.ownershipCount;
            if (req.body.accidentHistory) spec.accidentHistory = req.body.accidentHistory;

            listing.specification = spec;
            listing.keySpecifications = keySpec;

        } else if (modelName === 'YachtAsset') {
            if (req.body.builder) listing.builder = req.body.builder;

            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.builder) spec.builder = req.body.builder;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.length) {
                spec.length = req.body.length;
                keySpec.length = req.body.length;
            }
            if (req.body.beam) {
                spec.beam = req.body.beam;
                keySpec.beam = req.body.beam;
            }
            if (req.body.draft) {
                spec.draft = req.body.draft;
                keySpec.draft = req.body.draft;
            }
            if (req.body.engineType) {
                spec.engineType = req.body.engineType;
                keySpec.engineType = req.body.engineType;
            }
            if (req.body.cruisingSpeed) {
                spec.cruisingSpeed = req.body.cruisingSpeed;
                keySpec.cruisingSpeed = req.body.cruisingSpeed;
            }
            if (req.body.guestCapacity) {
                spec.guestCapacity = req.body.guestCapacity;
                keySpec.guestCapacity = req.body.guestCapacity;
            }
            if (req.body.crewCapacity) {
                spec.crewCapacity = req.body.crewCapacity;
                keySpec.crewCapacity = req.body.crewCapacity;
            }
            if (location) spec.yachtLocation = location;

            listing.specification = spec;
            listing.keySpecifications = keySpec;

        } else if (modelName === 'EstateAsset') {
            if (req.body.propertyName) listing.propertyName = req.body.propertyName;

            // Amenities / Arrays
            if (req.body.amenities) listing.amenities = JSON.parse(req.body.amenities);
            if (req.body.smartHomeSystems) listing.smartHomeSystems = JSON.parse(req.body.smartHomeSystems);
            if (req.body.viewTypes) listing.viewTypes = JSON.parse(req.body.viewTypes);

            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.propertyType) {
                spec.propertyType = req.body.propertyType;
                keySpec.propertyType = req.body.propertyType;
            }
            if (req.body.builtUpArea) {
                spec.builtUpArea = req.body.builtUpArea;
                keySpec.builtUpArea = req.body.builtUpArea;
            }
            if (req.body.landArea) {
                spec.landArea = req.body.landArea;
                keySpec.landArea = req.body.landArea;
            }
            if (req.body.floors) {
                spec.floors = req.body.floors;
                keySpec.floors = req.body.floors;
            }
            if (req.body.bedrooms) {
                spec.bedrooms = req.body.bedrooms;
                keySpec.bedrooms = req.body.bedrooms;
            }
            if (req.body.bathrooms) {
                spec.bathrooms = req.body.bathrooms;
                keySpec.bathrooms = req.body.bathrooms;
            }

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
        }

        // Handle new files if any
        if (req.files['images']) {
            const newImages = req.files['images'].map(file => `/uploads/${file.filename}`);
            // Append or Replace? Usually users want to append in edit, but let's just append for now with limit
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
        res.status(500).json({ error: "Failed to update listing: " + error.message });
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
