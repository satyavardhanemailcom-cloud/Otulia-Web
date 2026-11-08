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
const { getAssetFolderPath } = require('../config/cloudinaryFolders');

// Helper to generate asset title
const generateAssetTitle = (reqBody, category, existingTitle) => {
    const { title, make, brand, builder, model, propertyName, yachtName, variant } = reqBody;

    // If title is explicitly provided in request, use it
    if (title && typeof title === 'string' && title.trim() !== '') return title.trim();

    // Fields used for auto-generation (Format: [Brand/Builder/Name] [Model])
    const autoBrand = (make || brand || builder || propertyName || yachtName || '').trim();
    const autoModel = (model || '').trim();
    const autoVariant = (variant || '').trim();

    let generatedTitle = '';
    
    if (autoBrand || autoModel) {
        generatedTitle = `${autoBrand} ${autoModel}`.trim();
        
        // Append variant if available for extra detail
        if (autoVariant) {
            generatedTitle += ` | ${autoVariant}`;
        }
    }

    // Fallback: If nothing was generated from the request body
    if (!generatedTitle || generatedTitle.trim() === '') {
        // Use existing title if available
        if (existingTitle) return existingTitle;
        // Final fallback
        return `Luxury ${category || 'Asset'}`;
    }

    // Sanitize any double spaces
    return generatedTitle.replace(/\s+/g, ' ').trim();
};

// Helper to generate a unique listing reference
const generateUniqueListingReference = async (Model) => {
    const prefix = "#NJM";
    let isUnique = false;
    let reference = "";

    while (!isUnique) {
        // Generate 7 random digits
        const randomDigits = Math.floor(1000000 + Math.random() * 9000000).toString();
        reference = `${prefix}${randomDigits}`;

        // Check uniqueness across all asset models
        const existingCar = await CarAsset.findOne({ listingReference: reference });
        const existingBike = await BikeAsset.findOne({ listingReference: reference });
        const existingYacht = await YachtAsset.findOne({ listingReference: reference });
        const existingEstate = await EstateAsset.findOne({ listingReference: reference });
        const existingListing = await Listing.findOne({ listingReference: reference });

        if (!existingCar && !existingBike && !existingYacht && !existingEstate && !existingListing) {
            isUnique = true;
        }
    }

    return reference;
};

// Robust formatting helpers to prevent duplicated or malformed units
const cleanEstateArea = (val, defaultUnit = 'Sqft') => {
    if (!val) return val;
    const str = val.toString().trim();
    const numMatch = str.match(/[\d,.]+/);
    if (!numMatch) return str;
    const num = numMatch[0];
    const lower = str.toLowerCase();
    let unit = defaultUnit;
    if (lower.includes('acre')) unit = 'Acres';
    else if (lower.includes('hect') || lower.includes('ha')) unit = 'hectres';
    else if (lower.includes('sq') || lower.includes('ft')) unit = 'Sqft';
    return `${num} ${unit}`;
};

const addUnit = (val, unit) => {
    if (!val) return val;
    const strVal = val.toString().trim();
    const numMatch = strVal.match(/^([\d,.]+)/);
    if (numMatch) {
        const num = numMatch[1];
        if (strVal.toLowerCase().includes(unit.toLowerCase())) {
            return `${num} ${unit}`;
        }
    }
    if (strVal.toLowerCase().includes(unit.toLowerCase())) return strVal;
    return `${strVal} ${unit}`;
};

const cleanHighlights = (highlights) => {
    if (!Array.isArray(highlights)) return highlights;
    return highlights.map(h => {
        if (typeof h !== 'string') return h;
        return h
            .replace(/(Sqft\s*)+Sqft/gi, 'Sqft')
            .replace(/(Acres\s*)+Acres/gi, 'Acres')
            .replace(/Acres\s+Sqft/gi, 'Acres')
            .replace(/(hectres\s*)+hectres/gi, 'hectres')
            .replace(/hectres\s+Sqft/gi, 'hectres')
            .replace(/(hp\s*)+hp/gi, 'hp')
            .replace(/(knots\s*)+knots/gi, 'knots')
            .replace(/(km\/h\s*)+km\/h/gi, 'km/h')
            .replace(/(mph\s*)+mph/gi, 'mph');
    });
};

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
    limits: { fileSize: 5 * 1024 * 1024 }, // Set to 5MB
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'images') {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']; // Added WebP support
            if (allowed.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only .jpg, .png, .webp and .jpeg are allowed for images'), false);
            }
        } else {
            cb(null, true);
        }
    }
});

// Cloudinary Helpers
const getPublicIdFromUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.includes('cloudinary')) return null;
    try {
        const uploadSplit = url.split('/upload/');
        if (uploadSplit.length < 2) return null;
        
        const afterUpload = uploadSplit[1];
        const parts = afterUpload.split('/');
        
        const relevantParts = parts.filter(part => {
            if (/^v\d+$/.test(part)) return false; // skip version string e.g. v1721812345
            if (part.includes(',')) return false;  // skip transformation segment e.g. c_fill,w_300
            if (/^(c|w|h|q|f|e|b|r|a|g|fl|pg|dn|so|eo|o|x|y|bo|co|l|u|t)_[a-zA-Z0-9_-]+/.test(part)) return false;
            return true;
        });
        
        let fullPublicId = relevantParts.join('/');
        const dotIndex = fullPublicId.lastIndexOf('.');
        if (dotIndex !== -1) {
            fullPublicId = fullPublicId.substring(0, dotIndex);
        }
        return fullPublicId || null;
    } catch (err) {
        console.error("Error parsing Cloudinary URL in getPublicIdFromUrl:", err);
        return null;
    }
};

const deleteFromCloudinary = async (url) => {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
        try {
            const res = await cloudinary.uploader.destroy(publicId);
            console.log(`[Cloudinary] Deleted image ${publicId}:`, res);
        } catch (err) {
            console.error(`Failed to delete ${publicId} from Cloudinary:`, err);
        }
    }
};

// Cloudinary folder deletion helper
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
        console.error(`Cloudinary folder deletion error (${folderPath}):`, err.message || err.error?.message || err);
    }
};

// Brand Logo Mappings
const BRAND_LOGOS = {
    'Car': {
        'Aston Martin': 'Aston_Martin_Wings.webp',
        'Audi': 'Audi.webp',
        'BMW': 'BMW.webp',
        'Bugatti': 'Bugatti.webp',
        'Ferrari': 'Ferrari.webp',
        'Koenigsegg': 'Koenigsegg_Automotive_AB.webp',
        'Lexus': 'Lexus.webp',
        'Mercedes-Benz': 'Mercedes-Benz.webp',
        'Porsche': 'Porsche.webp',
        'Shelby': 'Shelby_American.webp'
    },
    'Bike': {
        'BMW': 'BMW.webp',
        'Ducati': 'Ducati.webp',
        'Harley-Davidson': 'Harley-Davidson.webp',
        'Honda': 'Honda.webp',
        'Indian': 'Indian_Motorcycles.webp',
        'Kawasaki': 'Kawasaki.webp',
        'KTM': 'KTM.webp',
        'Royal Enfield': 'Royal-Enfield.webp',
        'Triumph': 'Triumph.webp',
        'Yamaha': 'Yamaha.webp'
    },
    'Yacht': {
        'Azimut': 'Azimut_Yachts.webp',
        'Benetti': 'Benetti.webp',
        'Custom Line': 'Custom_Line.webp',
        'Ferretti': 'Ferretti_Yachts.webp',
        'Heesen': 'Heesen.webp',
        'Pershing': 'Pershing.webp',
        'Princess': 'Princess-Yachts.webp',
        'Riva': 'Riva.webp',
        'Sunseeker': 'Sunseeker.webp',
        'Wally': 'Wally.webp'
    }
};

const getBrandLogoPath = (category, brandName) => {
    if (!BRAND_LOGOS[category] || !brandName) return null;
    const fileName = BRAND_LOGOS[category][brandName];
    if (!fileName) return null;

    const folderMap = {
        'Car': 'car_brands',
        'Bike': 'bike_brands',
        'Yacht': 'yacht_brands'
    };

    return path.join(__dirname, `../../client/src/assets/${folderMap[category]}/${fileName}`);
};

/**
 * CREATE LISTING
 * POST /api/listings/create
 */
router.post('/create', authMiddleware, upload.fields([
    { name: 'images', maxCount: 50 },
    { name: 'documents', maxCount: 5 },
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
        const user = req.user;
        let { title, price, category, location, description, isPriceOnRequest } = req.body;
        const priceOnRequest = isPriceOnRequest === 'true' || isPriceOnRequest === true;

        console.log(`[Create Listing] Initiating request...`);
        console.log(`[Create Listing] User ID: ${user?._id || user?.id}`);
        console.log(`[Create Listing] Payload:`, { category, title, price, location, priceOnRequest });

        // Basic validation
        if (!category) {
            console.error("[Create Listing] Validation Failed: Category is missing");
            return res.status(400).json({ error: "Category is required (Car, Bike, Yacht, or Estate)" });
        }

        // Sanitize and validate price
        let sanitizedPrice = price;
        if (typeof price === 'string') {
            sanitizedPrice = price.replace(/[,$\s]/g, ''); // Handle comma, currency and spaces
        }

        if (!priceOnRequest) {
            if (!sanitizedPrice || isNaN(Number(sanitizedPrice))) {
                console.error(`[Create Listing] Validation Failed: Invalid price "${price}"`);
                return res.status(400).json({ error: "A valid numeric price is required when 'Price on Request' is disabled" });
            }
        }

        const dbPrice = priceOnRequest ? 0 : Number(sanitizedPrice);

        if (!location) location = 'Unspecified';
        if (!description) description = 'No luxury description provided';

        if (!description) description = 'No luxury description provided';

        // --- TITLE GENERATION ---
        title = generateAssetTitle(req.body, category);

        // --- LISTING REFERENCE HANDLING ---
        let listingReference = req.body.listingReference;
        if (!listingReference) {
            listingReference = await generateUniqueListingReference();
        } else {
            // Verify uniqueness if provided
            const existingCar = await CarAsset.findOne({ listingReference });
            const existingBike = await BikeAsset.findOne({ listingReference });
            const existingYacht = await YachtAsset.findOne({ listingReference });
            const existingEstate = await EstateAsset.findOne({ listingReference });
            const existingListing = await Listing.findOne({ listingReference });

            if (existingCar || existingBike || existingYacht || existingEstate || existingListing) {
                return res.status(400).json({ error: "Listing Reference ID already exists. Please provide a unique ID or generate one." });
            }
        }

        // Define Base Data
        const baseData = {
            title,
            listingReference,
            price: dbPrice,
            isPriceOnRequest: priceOnRequest,
            location,
            description: description || 'No description provided',
            images: [],
            documents: [],
            status: req.body.isPublic === 'true' || req.body.isPublic === true ? 'Active' : 'Draft',
            directlyFromDeveloper: req.body.directlyFromDeveloper === 'true' || req.body.directlyFromDeveloper === true,
            type: req.body.type || 'Sale',
            acquisition: (req.body.type === 'Rent' ? 'rent' : 'buy'),
            priceHistory: req.body.priceHistory ? JSON.parse(req.body.priceHistory) : [],
            priceHistoryOptions: req.body.priceHistoryOptions ? JSON.parse(req.body.priceHistoryOptions) : {
                graphType: 'Bar Graph',
                currency: 'USD $',
                useInflationAdjusted: false,
                allowAIEstimate: false
            },
            agent: {
                id: user._id,
                name: user.name,
                email: user.contactEmail || user.email,
                phone: user.phone,
                photo: user.profilePicture,
                company: user.company?.companyName || 'Otulia Private Seller',
                companyLogo: user.company?.companyLogo || null,
                companyDescription: user.company?.description || null,
                address: user.company?.address || null,
                website: user.company?.website || null,
                plan: user.plan || 'Freemium',
                joined: new Date(user.createdAt).getFullYear(),
                createdAt: user.createdAt
            }
        };

        let newListing;
        let modelType;
        try {
            switch (category) {
                case 'Car': newListing = new CarAsset({ ...baseData, category: 'vehicles' }); modelType = 'CarAsset'; break;
                case 'Bike': newListing = new BikeAsset({ ...baseData, category: 'bikes' }); modelType = 'BikeAsset'; break;
                case 'Yacht': newListing = new YachtAsset({ ...baseData, category: 'yachts' }); modelType = 'YachtAsset'; break;
                case 'Estate': newListing = new EstateAsset({ ...baseData, category: 'estates' }); modelType = 'EstateAsset'; break;
                default:
                    console.error(`[Create Listing] Error: Invalid category "${category}"`);
                    return res.status(400).json({ error: `Invalid category: ${category}` });
            }
        } catch (schemaErr) {
            console.error(`[Create Listing] Schema Mapping Error:`, schemaErr.message);
            return res.status(500).json({ error: "Internal error preparing asset data" });
        }

        console.log(`[Create Listing] Saving initial ${modelType} to database...`);
        const savedListing = await newListing.save();
        const assetId = savedListing._id.toString();
        const folderPath = getAssetFolderPath(category, assetId);
        console.log(`[Create Listing] DB Save Successful. ID: ${assetId}. Target Cloudinary Folder: ${folderPath}`);

        const imageUrls = [];
        const docUrls = [];

        try {
            if (req.files['images']) {
                console.log(`[Create Listing] Uploading ${req.files['images'].length} images to Cloudinary...`);
                for (const file of req.files['images']) {
                    try {
                        const result = await cloudinary.uploader.upload(file.path, { folder: folderPath });
                        imageUrls.push(result.secure_url);
                    } catch (uploadErr) {
                        console.error(`[Create Listing] Cloudinary Image Upload FAILED (${file.originalname}):`, uploadErr.message);
                    } finally {
                        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                    }
                }
            }

            const docFields = ['documents', 'registrationRC', 'insurance', 'serviceHistory', 'businessLicense', 'taxId', 'proofOfAddress', 'dealershipCertificate', 'insuranceProof'];
            for (const field of docFields) {
                if (req.files[field]) {
                    console.log(`[Create Listing] Uploading document(s) for field: ${field}...`);
                    for (const file of req.files[field]) {
                        try {
                            const result = await cloudinary.uploader.upload(file.path, { folder: folderPath, resource_type: 'auto' });
                            docUrls.push(result.secure_url);
                        } catch (uploadErr) {
                            console.error(`[Create Listing] Cloudinary Doc Upload FAILED (${field}):`, uploadErr.message);
                        } finally {
                            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                        }
                    }
                }
            }
        } catch (uploadError) {
            console.error("[Create Listing] Critical Cloudinary error:", uploadError.message);
        } finally {
            // Clean up any files that weren't processed or deleted
            if (req.files) {
                Object.values(req.files).flat().forEach(file => {
                    if (fs.existsSync(file.path)) {
                        try { fs.unlinkSync(file.path); } catch (e) { }
                    }
                });
            }
        }

        // Include title in update data to ensure it's saved properly
        const updateData = {
            images: imageUrls,
            documents: docUrls,
            title: title
        };

        if (category === 'Car') {
            updateData.brand = req.body.make || req.body.brand;

            // Assign brand logo
            if (updateData.brand) {
                const logoPath = getBrandLogoPath('Car', updateData.brand);
                if (logoPath && fs.existsSync(logoPath)) {
                    try {
                        const logoResult = await cloudinary.uploader.upload(logoPath, {
                            folder: `${folderPath}/brand_logo`,
                            public_id: 'logo'
                        });
                        updateData.brand_logo = logoResult.secure_url;
                    } catch (logoErr) { console.error("[Create Listing] Logo Upload Error:", logoErr.message); }
                }
            }

            updateData.variant = req.body.variant;
            updateData.highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.tag = req.body.tag || '';

            updateData.keySpecifications = {
                power: addUnit(req.body.horsepower, 'hp'),
                topSpeed: addUnit(req.body.topSpeed, 'mph'),
                engineType: req.body.engineType
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                model: req.body.model,
                variant: req.body.variant,
                body: req.body.bodyType,
                series: req.body.series,
                mileage: req.body.mileage,
                power: addUnit(req.body.horsepower, 'hp'),
                cylinderCapacity: req.body.cylinderCapacity,
                configuration: req.body.configuration,
                topSpeed: addUnit(req.body.topSpeed, 'mph'),
                engineType: req.body.engineType,
                torque: addUnit(req.body.torque, 'Nm'),
                acceleration: addUnit(req.body.acceleration, 's'),
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
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                soulOfTheCar: req.body.soulOfTheCar,
                idealBuyer: req.body.idealBuyer,
            };
        } else if (category === 'Bike') {
            updateData.brand = req.body.brand || req.body.make;

            // Assign brand logo
            if (updateData.brand) {
                const logoPath = getBrandLogoPath('Bike', updateData.brand);
                if (logoPath && fs.existsSync(logoPath)) {
                    try {
                        const logoResult = await cloudinary.uploader.upload(logoPath, {
                            folder: `${folderPath}/brand_logo`,
                            public_id: 'logo'
                        });
                        updateData.brand_logo = logoResult.secure_url;
                    } catch (logoErr) { console.error("[Create Listing] Logo Upload Error:", logoErr.message); }
                }
            }

            updateData.variant = req.body.variant;
            updateData.highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.keySpecifications = {
                engineCapacity: addUnit(req.body.engineCapacity, 'cc'),
                mileage: addUnit(req.body.mileage, 'km'),
                topSpeed: addUnit(req.body.topSpeed, 'km/h'),
                fuelType: req.body.fuelType
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                brand: req.body.brand,
                model: req.body.model,
                variant: req.body.variant,
                engineCapacityCC: addUnit(req.body.engineCapacity, 'cc'),
                topSpeed: addUnit(req.body.topSpeed, 'km/h'),
                maxPower: addUnit(req.body.maxPower, 'hp'),
                maxTorque: addUnit(req.body.maxTorque, 'Nm'),
                mileageKM: addUnit(req.body.mileage, 'km'),
                fuelType: req.body.fuelType,
                transmission: req.body.transmission,
                color: req.body.color,
                abs: req.body.abs,
                tractionControl: req.body.tractionControl,
                condition: req.body.condition,
                ownershipCount: req.body.ownershipCount,
                accidentHistory: req.body.accidentHistory,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            };
        } else if (category === 'Yacht') {
            updateData.builder = req.body.builder;

            // Assign brand logo
            if (updateData.builder) {
                const logoPath = getBrandLogoPath('Yacht', updateData.builder);
                if (logoPath && fs.existsSync(logoPath)) {
                    try {
                        const logoResult = await cloudinary.uploader.upload(logoPath, {
                            folder: `${folderPath}/brand_logo`,
                            public_id: 'logo'
                        });
                        updateData.brand_logo = logoResult.secure_url;
                    } catch (logoErr) { console.error("[Create Listing] Logo Upload Error:", logoErr.message); }
                }
            }

            updateData.highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.keySpecifications = {
                length: addUnit(req.body.length, 'm'),
                bathrooms: req.body.bathrooms,
                fuelCapacity: addUnit(req.body.fuelCapacity, 'L'),
                engineType: req.body.engineType,
                bedrooms: req.body.bedrooms,
                topSpeed: addUnit(req.body.topSpeed, 'knots')
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                brandBuilder: req.body.builder,
                model: req.body.model,
                length: addUnit(req.body.length, 'm'),
                beam: addUnit(req.body.beam, 'm'),
                draft: addUnit(req.body.draft, 'm'),
                engineType: req.body.engineType,
                cruisingSpeed: addUnit(req.body.cruisingSpeed, 'knots'),
                topSpeed: addUnit(req.body.topSpeed, 'knots'),
                usageHours: req.body.usageHours,
                fuelConsumption: req.body.fuelConsumption,
                guestCapacity: req.body.guestCapacity,
                crewCapacity: req.body.crewCapacity,
                yachtLocation: req.body.location,
                fuelType: req.body.fuelType,
                hullMaterial: req.body.hullMaterial,
                condition: req.body.condition,
                interiorMaterial: req.body.interiorMaterial,
                exteriorColor: req.body.exteriorColor,
                countryOfFirstDelivery: req.body.countryOfFirstDelivery,
                numberOfOwners: req.body.numberOfOwners,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
            };
        } else if (category === 'Estate') {
            updateData.propertyName = req.body.propertyName;
            updateData.directlyFromDeveloper = req.body.directlyFromDeveloper === 'true' || req.body.directlyFromDeveloper === true;
            updateData.highlights = req.body.highlights ? cleanHighlights(JSON.parse(req.body.highlights)) : [];
            updateData.videoUrl = req.body.videoUrl;
            updateData.amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];
            updateData.smartHomeSystems = req.body.smartHomeSystems ? JSON.parse(req.body.smartHomeSystems) : [];
            updateData.viewTypes = req.body.viewTypes ? JSON.parse(req.body.viewTypes) : [];
            
            const bua = cleanEstateArea(req.body.builtUpArea, 'Sqft');
            const la = cleanEstateArea(req.body.landArea, 'Sqft');

            updateData.keySpecifications = {
                bedrooms: req.body.bedrooms,
                bathrooms: req.body.bathrooms,
                floors: req.body.floors,
                garageCapacity: req.body.garageCapacity,
                builtUpArea: bua,
                landArea: la,
                propertyType: req.body.propertyType
            };
            updateData.specification = {
                yearOfConstruction: req.body.year,
                propertyType: req.body.propertyType,
                architectureStyle: req.body.architectureStyle,
                builtUpArea: bua,
                landArea: la,
                floors: req.body.floors,
                bedrooms: req.body.bedrooms,
                bathrooms: req.body.bathrooms,
                garageCapacity: req.body.garageCapacity,
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

        console.log(`[Create Listing] Finalizing record update with media...`);
        const finalListing = await Model.findByIdAndUpdate(savedListing._id, updateData, { new: true });

        console.log(`[Create Listing] Linking listing to user profile...`);
        await User.findByIdAndUpdate(req.user.id, {
            $push: { myListings: { item: finalListing._id, itemModel: modelType } }
        });

        console.log(`[Create Listing] SUCCESS: Asset ${finalListing._id} created for ${user.email}`);
        res.status(201).json(finalListing);

    } catch (error) {
        console.error("[Create Listing] UNEXPECTED FATAL ERROR:", error.message);
        console.error(error.stack);
        res.status(500).json({ error: "Server error while creating listing. Please try again later." });
    }
});

/**
 * UPDATE LISTING
 * PUT /api/listings/:id
 */
router.put('/:id', authMiddleware, upload.fields([
    { name: 'images', maxCount: 50 },
    { name: 'documents', maxCount: 5 },
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
        const { title, price, location, description, type, isPublic, videoUrl, isPriceOnRequest } = req.body;
        const priceOnRequest = isPriceOnRequest === 'true' || isPriceOnRequest === true;

        console.log(`[Update Listing] Request for ID: ${id}`);

        // Price validation for updates
        if (!priceOnRequest && price !== undefined) {
            if (!price || isNaN(Number(price))) {
                console.error(`[Update Listing] Validation Failed: Invalid price "${price}"`);
                return res.status(400).json({ error: "A valid numeric price is required when 'Price on Request' is disabled" });
            }
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            console.error(`[Update Listing] Auth Error: User not found`);
            return res.status(404).json({ error: "User not found" });
        }

        const listingEntry = user.myListings.find(entry => entry.item && entry.item.toString() === id);
        if (!listingEntry) {
            console.warn(`[Update Listing] Unauthorized attempt or invalid ID for user ${user.email}`);
            return res.status(404).json({ error: "Listing not found in your profile." });
        }

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
        if (!listing) {
            console.error(`[Update Listing] DB Error: Asset not found for ID: ${id}`);
            return res.status(404).json({ error: "Asset record missing." });
        }

        const folderPath = getAssetFolderPath(categoryName, id);

        try {
            // 1. Process Retained Images from Request Body
            let retainedImages = [];
            if (req.body.retainedImages !== undefined) {
                try {
                    retainedImages = typeof req.body.retainedImages === 'string'
                        ? JSON.parse(req.body.retainedImages)
                        : req.body.retainedImages;
                } catch (e) {
                    console.error("[Update Listing] Error parsing retainedImages:", e);
                    retainedImages = [];
                }
            } else if (req.body.existingImages !== undefined) {
                try {
                    retainedImages = typeof req.body.existingImages === 'string'
                        ? JSON.parse(req.body.existingImages)
                        : req.body.existingImages;
                } catch (e) {
                    retainedImages = [];
                }
            } else if (!req.files || !req.files['images']) {
                // If neither retained list nor new image files are supplied, preserve existing DB images
                retainedImages = listing.images || [];
            }

            if (!Array.isArray(retainedImages)) {
                retainedImages = [];
            }

            // 2. Delete any old Cloudinary image that is no longer in retainedImages
            const currentDbImages = Array.isArray(listing.images) ? listing.images : [];
            const retainedSet = new Set(retainedImages);
            for (const oldUrl of currentDbImages) {
                if (!retainedSet.has(oldUrl)) {
                    console.log(`[Update Listing] Deleting removed image from Cloudinary: ${oldUrl}`);
                    await deleteFromCloudinary(oldUrl);
                }
            }

            // 3. Upload any newly added image files
            const newImageUrls = [];
            if (req.files && req.files['images']) {
                console.log(`[Update Listing] Uploading ${req.files['images'].length} new images to folder: ${folderPath}`);
                for (const file of req.files['images']) {
                    try {
                        const result = await cloudinary.uploader.upload(file.path, { folder: folderPath });
                        newImageUrls.push(result.secure_url);
                    } catch (uploadErr) {
                        console.error(`[Update Listing] Image Upload Error:`, uploadErr.message);
                    } finally {
                        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                    }
                }
            }

            // 4. Combine retained images and newly uploaded images
            const isCoverNew = req.body.isCoverNew === 'true' || req.body.isCoverNew === true;
            if (isCoverNew && newImageUrls.length > 0) {
                const [newCover, ...restNew] = newImageUrls;
                listing.images = [newCover, ...retainedImages, ...restNew].slice(0, 50);
            } else {
                listing.images = [...retainedImages, ...newImageUrls].slice(0, 50);
            }
            listing.markModified('images');

            // 5. Documents Handling
            let retainedDocs = [];
            if (req.body.retainedDocs !== undefined) {
                try {
                    retainedDocs = typeof req.body.retainedDocs === 'string'
                        ? JSON.parse(req.body.retainedDocs)
                        : req.body.retainedDocs;
                } catch (e) {
                    retainedDocs = [];
                }
            } else {
                retainedDocs = listing.documents || [];
            }

            const docFields = ['documents', 'registrationRC', 'insurance', 'serviceHistory', 'businessLicense', 'taxId', 'proofOfAddress', 'dealershipCertificate', 'insuranceProof'];
            const newDocUrls = [];
            for (const field of docFields) {
                if (req.files && req.files[field]) {
                    console.log(`[Update Listing] Updating document field: ${field}`);
                    for (const file of req.files[field]) {
                        try {
                            const result = await cloudinary.uploader.upload(file.path, { folder: folderPath, resource_type: 'auto' });
                            newDocUrls.push(result.secure_url);
                        } catch (uploadErr) {
                            console.error(`[Update Listing] Doc Upload Error (${field}):`, uploadErr.message);
                        } finally {
                            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
                        }
                    }
                }
            }
            if (newDocUrls.length > 0 || req.body.retainedDocs !== undefined) {
                listing.documents = [...retainedDocs, ...newDocUrls].slice(0, 10);
                listing.markModified('documents');
            }
        } catch (uploadError) {
            console.error("[Update Listing] Cloudinary Error:", uploadError.message);
        } finally {
            if (req.files) {
                Object.values(req.files).flat().forEach(file => {
                    if (fs.existsSync(file.path)) {
                        try { fs.unlinkSync(file.path); } catch (e) { }
                    }
                });
            }
        }

        // --- TITLE GENERATION ---
        listing.title = generateAssetTitle(req.body, categoryName, listing.title);
        if (price !== undefined) listing.price = Number(price);
        if (req.body.isPriceOnRequest !== undefined) {
            listing.isPriceOnRequest = req.body.isPriceOnRequest === 'true' || req.body.isPriceOnRequest === true;
        }
        if (location) listing.location = location;
        if (description) listing.description = description;
        if (req.body.listingReference && req.body.listingReference !== listing.listingReference) {
            // Verify uniqueness if changed
            const reference = req.body.listingReference;
            const existingCar = await CarAsset.findOne({ listingReference: reference });
            const existingBike = await BikeAsset.findOne({ listingReference: reference });
            const existingYacht = await YachtAsset.findOne({ listingReference: reference });
            const existingEstate = await EstateAsset.findOne({ listingReference: reference });
            const existingListing = await Listing.findOne({ listingReference: reference });

            if (existingCar || existingBike || existingYacht || existingEstate || existingListing) {
                return res.status(400).json({ error: "Listing Reference ID already exists. Please provide a unique ID." });
            }
            listing.listingReference = reference;
        }
        if (type) {
            listing.type = type;
            listing.acquisition = (type === 'Rent' ? 'rent' : 'buy');
        }
        if (videoUrl !== undefined) listing.videoUrl = videoUrl;
        if (isPublic !== undefined) listing.status = (isPublic === 'true' || isPublic === true) ? 'Active' : 'Draft';

        if (req.body.priceHistory) {
            listing.priceHistory = JSON.parse(req.body.priceHistory);
            listing.markModified('priceHistory');
        }
        if (req.body.priceHistoryOptions) {
            listing.priceHistoryOptions = JSON.parse(req.body.priceHistoryOptions);
            listing.markModified('priceHistoryOptions');
        }

        if (req.body.highlights) {
            try {
                listing.highlights = cleanHighlights(JSON.parse(req.body.highlights));
            } catch (e) {
                if (Array.isArray(req.body.highlights)) listing.highlights = cleanHighlights(req.body.highlights);
            }
        }

        // --- TYPE SPECIFIC UPDATES ---

        if (modelName === 'CarAsset') {
            const carBrand = req.body.make || req.body.brand;
            if (carBrand) {
                if (listing.brand !== carBrand || !listing.brand_logo) {
                    const logoPath = getBrandLogoPath('Car', carBrand);
                    if (logoPath && fs.existsSync(logoPath)) {
                        try {
                            const logoResult = await cloudinary.uploader.upload(logoPath, {
                                folder: `${folderPath}/brand_logo`,
                                public_id: 'logo'
                            });
                            listing.brand_logo = logoResult.secure_url;
                            listing.markModified('brand_logo');
                        } catch (logoErr) { console.error("[Update Listing] Logo Error:", logoErr.message); }
                    }
                }
                listing.brand = carBrand;
            }
            if (req.body.variant) listing.variant = req.body.variant;

            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.variant) spec.variant = req.body.variant;
            if (req.body.bodyType) spec.body = req.body.bodyType;
            if (req.body.series) spec.series = req.body.series;
            if (req.body.mileage) { spec.mileage = req.body.mileage; }
            if (req.body.horsepower) {
                const p = addUnit(req.body.horsepower, 'hp');
                spec.power = p;
                keySpec.power = p;
            }
            if (req.body.cylinderCapacity) { spec.cylinderCapacity = req.body.cylinderCapacity; }
            if (req.body.configuration) spec.configuration = req.body.configuration;
            if (req.body.topSpeed) {
                const ts = addUnit(req.body.topSpeed, 'mph');
                spec.topSpeed = ts;
                keySpec.topSpeed = ts;
            }
            if (req.body.engineType) { spec.engineType = req.body.engineType; keySpec.engineType = req.body.engineType; }
            if (req.body.torque) spec.torque = addUnit(req.body.torque, 'Nm');
            if (req.body.acceleration) spec.acceleration = addUnit(req.body.acceleration, 's');
            if (req.body.tag !== undefined) listing.tag = req.body.tag;
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
            if (req.body.latitude) spec.latitude = req.body.latitude;
            if (req.body.longitude) spec.longitude = req.body.longitude;
            if (req.body.soulOfTheCar) spec.soulOfTheCar = req.body.soulOfTheCar;
            if (req.body.idealBuyer) spec.idealBuyer = req.body.idealBuyer;

            listing.specification = spec;
            listing.keySpecifications = keySpec;
            listing.markModified('specification');
            listing.markModified('keySpecifications');

        } else if (modelName === 'BikeAsset') {
            const bikeBrand = req.body.brand || req.body.make;
            if (bikeBrand) {
                if (listing.brand !== bikeBrand || !listing.brand_logo) {
                    const logoPath = getBrandLogoPath('Bike', bikeBrand);
                    if (logoPath && fs.existsSync(logoPath)) {
                        try {
                            const logoResult = await cloudinary.uploader.upload(logoPath, {
                                folder: `${folderPath}/brand_logo`,
                                public_id: 'logo'
                            });
                            listing.brand_logo = logoResult.secure_url;
                            listing.markModified('brand_logo');
                        } catch (logoErr) { console.error("[Update Listing] Logo Error:", logoErr.message); }
                    }
                }
                listing.brand = bikeBrand;
            }
            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.brand) spec.brand = req.body.brand;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.variant) spec.variant = req.body.variant;
            if (req.body.engineCapacity) {
                const ec = addUnit(req.body.engineCapacity, 'cc');
                spec.engineCapacityCC = ec;
                keySpec.engineCapacity = ec;
            }
            if (req.body.topSpeed) {
                const ts = addUnit(req.body.topSpeed, 'km/h');
                spec.topSpeed = ts;
                keySpec.topSpeed = ts;
            }
            if (req.body.maxPower) spec.maxPower = addUnit(req.body.maxPower, 'hp');
            if (req.body.maxTorque) spec.maxTorque = addUnit(req.body.maxTorque, 'Nm');
            if (req.body.mileage) {
                const mil = addUnit(req.body.mileage, 'km');
                spec.mileageKM = mil;
                keySpec.mileage = mil;
            }
            if (req.body.fuelType) { spec.fuelType = req.body.fuelType; keySpec.fuelType = req.body.fuelType; }
            if (req.body.transmission) { spec.transmission = req.body.transmission; }
            if (req.body.color) { spec.color = req.body.color; }
            if (req.body.abs) spec.abs = req.body.abs;
            if (req.body.tractionControl) spec.tractionControl = req.body.tractionControl;
            if (req.body.condition) spec.condition = req.body.condition;
            if (req.body.ownershipCount) spec.ownershipCount = Number(req.body.ownershipCount);
            if (req.body.accidentHistory) spec.accidentHistory = req.body.accidentHistory;
            if (req.body.latitude) spec.latitude = req.body.latitude;
            if (req.body.longitude) spec.longitude = req.body.longitude;

            listing.specification = spec;
            listing.keySpecifications = keySpec;
            listing.markModified('specification');
            listing.markModified('keySpecifications');

        } else if (modelName === 'YachtAsset') {
            if (req.body.builder) {
                if (listing.builder !== req.body.builder || !listing.brand_logo) {
                    const logoPath = getBrandLogoPath('Yacht', req.body.builder);
                    if (logoPath && fs.existsSync(logoPath)) {
                        try {
                            const logoResult = await cloudinary.uploader.upload(logoPath, {
                                folder: `${folderPath}/brand_logo`,
                                public_id: 'logo'
                            });
                            listing.brand_logo = logoResult.secure_url;
                            listing.markModified('brand_logo');
                        } catch (logoErr) { console.error("[Update Listing] Logo Error:", logoErr.message); }
                    }
                }
                listing.builder = req.body.builder;
            }
            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.builder) spec.brandBuilder = req.body.builder;
            if (req.body.model) spec.model = req.body.model;
            if (req.body.length) {
                const len = addUnit(req.body.length, 'm');
                spec.length = len;
                keySpec.length = len;
            }
            if (req.body.beam) { spec.beam = addUnit(req.body.beam, 'm'); }
            if (req.body.draft) { spec.draft = addUnit(req.body.draft, 'm'); }
            if (req.body.engineType) { spec.engineType = req.body.engineType; keySpec.engineType = req.body.engineType; }
            if (req.body.cruisingSpeed) { spec.cruisingSpeed = addUnit(req.body.cruisingSpeed, 'knots'); }
            if (req.body.topSpeed) {
                const ts = addUnit(req.body.topSpeed, 'knots');
                spec.topSpeed = ts;
                keySpec.topSpeed = ts;
            }
            if (req.body.usageHours) spec.usageHours = req.body.usageHours;
            if (req.body.fuelConsumption) spec.fuelConsumption = req.body.fuelConsumption;
            if (req.body.guestCapacity) { spec.guestCapacity = req.body.guestCapacity; }
            if (req.body.crewCapacity) { spec.crewCapacity = req.body.crewCapacity; }
            if (req.body.fuelCapacity) {
                const fc = addUnit(req.body.fuelCapacity, 'L');
                keySpec.fuelCapacity = fc;
            }
            if (req.body.bathrooms) keySpec.bathrooms = req.body.bathrooms;
            if (req.body.bedrooms) keySpec.bedrooms = req.body.bedrooms;
            if (req.body.fuelType) spec.fuelType = req.body.fuelType;
            if (req.body.hullMaterial) spec.hullMaterial = req.body.hullMaterial;
            if (req.body.condition) spec.condition = req.body.condition;
            if (req.body.interiorMaterial) spec.interiorMaterial = req.body.interiorMaterial;
            if (req.body.exteriorColor) spec.exteriorColor = req.body.exteriorColor;
            if (req.body.countryOfFirstDelivery) spec.countryOfFirstDelivery = req.body.countryOfFirstDelivery;
            if (req.body.numberOfOwners) spec.numberOfOwners = req.body.numberOfOwners;
            if (req.body.latitude) spec.latitude = req.body.latitude;
            if (req.body.longitude) spec.longitude = req.body.longitude;
            if (location) spec.yachtLocation = location;

            listing.specification = spec;
            listing.keySpecifications = keySpec;
            listing.markModified('specification');
            listing.markModified('keySpecifications');

        } else if (modelName === 'EstateAsset') {
            if (req.body.propertyName) listing.propertyName = req.body.propertyName;
            if (req.body.directlyFromDeveloper !== undefined) {
                listing.directlyFromDeveloper = req.body.directlyFromDeveloper === 'true' || req.body.directlyFromDeveloper === true;
                listing.markModified('directlyFromDeveloper');
            }
            
            if (req.body.amenities) {
                try {
                    listing.amenities = JSON.parse(req.body.amenities);
                } catch (e) {
                    if (Array.isArray(req.body.amenities)) listing.amenities = req.body.amenities;
                }
            }
            if (req.body.smartHomeSystems) {
                try {
                    listing.smartHomeSystems = JSON.parse(req.body.smartHomeSystems);
                } catch (e) {
                    if (Array.isArray(req.body.smartHomeSystems)) listing.smartHomeSystems = req.body.smartHomeSystems;
                }
            }
            if (req.body.viewTypes) {
                try {
                    listing.viewTypes = JSON.parse(req.body.viewTypes);
                } catch (e) {
                    if (Array.isArray(req.body.viewTypes)) listing.viewTypes = req.body.viewTypes;
                }
            }

            const spec = listing.specification || {};
            const keySpec = listing.keySpecifications || {};

            if (req.body.year) spec.yearOfConstruction = req.body.year;
            if (req.body.propertyType) { spec.propertyType = req.body.propertyType; keySpec.propertyType = req.body.propertyType; }
            if (req.body.builtUpArea) {
                const bua = cleanEstateArea(req.body.builtUpArea, 'Sqft');
                spec.builtUpArea = bua;
                keySpec.builtUpArea = bua;
            }
            if (req.body.landArea) {
                const la = cleanEstateArea(req.body.landArea, 'Sqft');
                spec.landArea = la;
                keySpec.landArea = la;
            }
            if (req.body.floors) { spec.floors = Number(req.body.floors); keySpec.floors = req.body.floors; }
            if (req.body.bedrooms) { spec.bedrooms = Number(req.body.bedrooms); keySpec.bedrooms = req.body.bedrooms; }
            if (req.body.bathrooms) { spec.bathrooms = Number(req.body.bathrooms); keySpec.bathrooms = req.body.bathrooms; }
            if (req.body.garageCapacity) { spec.garageCapacity = Number(req.body.garageCapacity); keySpec.garageCapacity = req.body.garageCapacity; }
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
        console.log(`[Update Listing] SUCCESS: Asset ${id} updated for ${user.email}`);
        res.json(updatedListing);

    } catch (error) {
        console.error("[Update Listing] FATAL ERROR:", error.message);
        res.status(500).json({ error: "Failed to update listing. Check server logs." });
    }
});

/**
 * DELETE LISTING
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[Delete Listing] Request for ID: ${id}`);

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isAdmin = user.role === 'admin';
        const isOwner = user.myListings.some(entry => entry.item && entry.item.toString() === id);

        // Ensure user is admin or the owner who listed the asset
        if (!isAdmin && !isOwner) {
            console.warn(`[Delete Listing] Access denied for user ${user.email} (Not Admin and Not Owner)`);
            return res.status(403).json({ error: "Only admins or the owner who listed the asset are allowed to delete it." });
        }

        // Search for the listing across all models
        let Model = null;
        let categoryName = '';
        let listing = null;

        listing = await CarAsset.findById(id);
        if (listing) {
            Model = CarAsset;
            categoryName = 'Car';
        }

        if (!listing) {
            listing = await BikeAsset.findById(id);
            if (listing) {
                Model = BikeAsset;
                categoryName = 'Bike';
            }
        }

        if (!listing) {
            listing = await YachtAsset.findById(id);
            if (listing) {
                Model = YachtAsset;
                categoryName = 'Yacht';
            }
        }

        if (!listing) {
            listing = await EstateAsset.findById(id);
            if (listing) {
                Model = EstateAsset;
                categoryName = 'Estate';
            }
        }

        if (!listing) {
            listing = await Listing.findById(id);
            if (listing) {
                Model = Listing;
                categoryName = 'General';
            }
        }

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        // Delete from Cloudinary folder if exists
        console.log(`[Delete Listing] Purging Cloudinary folder for asset ${id}...`);
        const folderPath = getAssetFolderPath(categoryName, id);
        await deleteFolderFromCloudinary(folderPath);
        
        // Delete the document
        await Model.findByIdAndDelete(id);

        // Remove from myListings and favorites of any user
        await User.updateMany(
            { "myListings.item": id },
            { $pull: { myListings: { item: id } } }
        );
        await User.updateMany(
            { "favorites.assetId": id },
            { $pull: { favorites: { assetId: id } } }
        );

        console.log(`[Delete Listing] SUCCESS: Asset ${id} removed by admin ${user.email}`);
        res.json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.error("[Delete Listing] ERROR:", error.message);
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

module.exports = router;
