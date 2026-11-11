import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FiX, FiArrowLeft, FiImage, FiPlus, FiTrash2, FiVideo, FiCheck, 
  FiChevronRight, FiCheckCircle, FiInfo, FiMapPin, FiUploadCloud, 
  FiChevronDown, FiStar, FiGrid, FiSearch, FiHeart, FiSpeaker, 
  FiTv, FiRadio, FiFeather, FiCpu, FiCast, FiCloud, FiThermometer, FiTool, FiBarChart2, FiTag
} from 'react-icons/fi';
import { 
    ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { getAmenityIcon } from '../../utils/assetIcons';
import { useAuth } from '../../contexts/AuthContext';
import carIcon from '../../assets/icons/car_icon.png';
import estateIcon from '../../assets/icons/estate_icon.png';
import bikeIcon from '../../assets/icons/bike_icon.png';
import yachtIcon from '../../assets/icons/yacht_icon.png';
import otherassetIcon from '../../assets/icons/other_asset_icon.png';

const ESTATE_LIFESTYLE_AMENITIES = ["Swimming Pool", "Infinity Pool", "Gym / Fitness Center", "Spa & Wellness Center", "Sauna / Steam Room", "Jacuzzi", "Clubhouse", "Private Theater", "Game Room", "Bar / Lounge", "BBQ Area", "Outdoor Dining Area", "Kids Play Area", "Pet Friendly", "Jogging Track", "Garden / Lawn", "Landscaped Gardens", "Elevator", "Private Parking", "EV Charging", "Laundry Room", "Storage Room", "Servant Quarters", "Smart Entry", "High-Speed WiFi"];
const ESTATE_VIEWS_OUTDOOR = ["Sea View", "Oceanfront", "Lake View", "River View", "Mountain View", "Forest View", "Garden View", "Park View", "City Skyline View", "Panoramic View", "Sunset View", "Sunrise View", "Pool View", "Golf Course View", "Marina View", "Private Beach Access", "Waterfront Property", "Rooftop Terrace", "Balcony with View", "Outdoor Lounge", "Fire Pit Area", "Outdoor Entertainment Area"];
const ESTATE_SMART_SECURITY = ["Smart Door Lock", "Video Doorbell", "Face Recognition Entry", "Motion Sensors", "Smart Surveillance", "24/7 Security", "Gated Community Access", "Voice Control", "Smart Lighting", "Automated Curtains", "Smart Thermostat", "Climate Control", "Central Control Panel", "Mobile App Control", "Smart Switches", "AI Assistant Integration", "High-Speed Internet Ready", "Fiber Connection", "Smart Intercom"];
const ESTATE_ULTRA_LUXURY = ["Private Island", "Private Beach Access", "Waterfront Estate", "Gated Estate", "Helipad", "Private Dock / Yacht Berth", "Vineyard / Orchard", "Equestrian Facilities", "Multi-Car Garage (10+)", "Car Showroom Garage", "Underground Garage", "Car Lift System", "Private Car Gallery", "EV Fleet Charging", "Private Cinema", "Bowling Alley", "Casino Room", "Wine Cellar", "Cigar Lounge", "Private Bar", "Ballroom / Event Hall", "Private Library", "Private Spa Suite", "Ice Bath", "Indoor Lap Pool", "Meditation Room", "Yoga Pavilion", "Massage Room", "Double-Height Ceilings", "Grand Staircase", "Floating Staircase", "Floor-to-Ceiling Glass", "Sky Bridge", "Smart Glass"];

const AddAssetModal = ({ isOpen, onClose, onCreated, editData = null }) => {
    const { token, user } = useAuth();

    // Step State: 0 (Type Select), 1 (Form Details)
    const [step, setStep] = useState(0);
    const [assetType, setAssetType] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initial Form State
    const initialFormState = {
        // Common
        make: '', model: '', variant: '', year: new Date().getFullYear(),
        listingReference: '',
        autoGenerateId: false,
        price: '', isPriceOnRequest: false, type: 'Sale', location: '', description: '',
        videoUrl: '', isPublic: true,

        // Price History
        priceHistoryRange: '5 Years',
        priceHistory: Array.from({ length: 15 }, (_, i) => ({
            year: new Date().getFullYear() - i,
            price: '',
            currency: 'USD $'
        })),
        priceHistoryOptions: {
            graphType: 'Bar Graph',
            currency: 'USD $',
            useInflationAdjusted: false,
            allowAIEstimate: false
        },

        // Fixed Highlights Keys
        highlight_hp: '', highlight_km: '', highlight_cc: '',
        highlight_length: '', highlight_baths: '', highlight_beds: '',
        highlight_area: '', highlight_kml: '', highlight_fuel: '',
        highlight_garage: '', highlight_built_area: '', highlight_floors: '',
        highlight_engine_hp: '', highlight_speed: '', highlight_engine_type: '',

        // Car Specific
        mileage: '', fuelType: '', transmission: '',
        engine: '', exteriorColor: '', interiorColor: '', condition: '',
        ownershipCount: '1', accidentHistory: '', horsepower: '',
        topSpeed: '', engineType: '', bodyType: '', series: '',
        cylinderCapacity: '', driveType: '', steering: '',
        interiorMaterial: '', manufacturerColorCode: '',
        matchingNumbers: '', accidentFree: '', numberOfOwners: '1',
        countryOfFirstDelivery: '', currentCarLocation: '',
        soulOfTheCar: '', idealBuyer: '',
        latitude: '', longitude: '',
        torque: '', acceleration: '', tag: '',

        // Yacht Specific
        yachtName: '', builder: '', length: '', beam: '', draft: '',
        cruisingSpeed: '', usageHours: '', fuelConsumption: '',
        guestCapacity: '', crewCapacity: '', hullMaterial: '',
        fuelCapacity: '',

        // Real Estate Specific
        directlyFromDeveloper: false,
        propertyName: '', propertyType: '', country: '', city: '', address: '',
        builtUpArea: '', builtUpAreaUnit: 'Sqft', landArea: '', landAreaUnit: 'Sqft', bedrooms: '', bathrooms: '', floors: '',
        garageCapacity: '',
        furnishingStatus: '', architectureStyle: '', configuration: '',
        interiorColorTheme: '', exteriorFinish: '',
        climateControl: '', usageStatus: '',
        areaNeighborhood: '',
        amenities: [], smartHomeSystems: [], viewTypes: [],

        // Bike Specific
        brand: '', engineCapacity: '', color: '',
        maxPower: '', maxTorque: '', abs: '', tractionControl: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [carSuggestions, setCarSuggestions] = useState({ brands: [], models: [], variants: [] });
    const [coverImage, setCoverImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [documents, setDocuments] = useState([]); // General docs
    const [isSuccess, setIsSuccess] = useState(false);
    const [showDraftConfirm, setShowDraftConfirm] = useState(false);
    const [showGraphPopup, setShowGraphPopup] = useState(false);

    useEffect(() => {
        if (!isOpen || assetType !== 'Car') return;
        const controller = new AbortController();
        const params = new URLSearchParams();
        if (formData.make.trim()) params.set('brand', formData.make.trim());
        if (formData.model.trim()) params.set('model', formData.model.trim());
        fetch(`/api/assets/car-taxonomy?${params.toString()}`, { signal: controller.signal })
            .then((response) => response.ok ? response.json() : null)
            .then((data) => {
                if (data) setCarSuggestions({
                    brands: data.brands || [],
                    models: data.models || [],
                    variants: data.variants || [],
                });
            })
            .catch((error) => { if (error.name !== 'AbortError') console.error('Could not load car suggestions:', error); });
        return () => controller.abort();
    }, [isOpen, assetType, formData.make, formData.model]);

    const handleCloseAttempt = () => {
        // Only show draft confirmation if we have some data and we're not in edit mode
        const hasData = formData.price || formData.description || formData.make || formData.model || 
                        formData.propertyName || formData.yachtName || formData.brand ||
                        coverImage || galleryImages.length > 0 || documents.length > 0;
        if (!editData && hasData) {
            setShowDraftConfirm(true);
        } else {
            onClose();
        }
    };

    const saveAsDraft = async () => {
        await handleSubmit(null, false);
    };

    const handleRemoveFile = (index, type) => {
        if (type === 'cover') {
            if (galleryImages.length > 0) {
                // Promote the first gallery image to cover image
                setCoverImage(galleryImages[0]);
                setGalleryImages(prev => prev.slice(1));
            } else {
                setCoverImage(null);
            }
        } else if (type === 'gallery') {
            setGalleryImages(prev => prev.filter((_, i) => i !== index));
        } else if (type === 'document') {
            setDocuments(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleFileUpload = (e, type) => {
        const files = Array.from(e.target.files);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        // Size validation
        const oversizedFiles = files.filter(f => f.size > MAX_SIZE);
        if (oversizedFiles.length > 0) {
            alert(`Some files are too large. Maximum size per file is 5MB. Affected files: ${oversizedFiles.map(f => f.name).join(', ')}`);
            return;
        }

        // Image validation
        if (type === 'cover' || type === 'gallery') {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            const invalidFiles = files.filter(f => !allowed.includes(f.type));
            if (invalidFiles.length > 0) {
                alert('Only .jpg, .png, .webp and .jpeg are allowed for images');
                return;
            }
        }

        if (type === 'cover') {
            setCoverImage(files[0]);
        } else if (type === 'gallery') {
            setGalleryImages(prev => [...prev, ...files].slice(0, 49));
        } else if (type === 'document') {
            setDocuments(prev => [...prev, ...files].slice(0, 5));
        }
        e.target.value = '';
    };

    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            setAssetType(null);
            setCoverImage(null);
            setGalleryImages([]);
            setExistingImages([]);
            setDocuments([]);
            setFormData(initialFormState);
        } else if (editData) {
            setStep(1);

            // 1. Map model or category string to assetType accurately
            let type = 'Car';
            const model = editData.itemModel || '';
            const cat = (editData.category || '').toLowerCase();
            const spec = editData.specification || {};
            const keySpec = editData.keySpecifications || {};

            if (cat === 'carasset' || model === 'CarAsset' || cat === 'vehicles' || cat === 'car' || cat === 'cars') type = 'Car';
            else if (cat === 'yachtasset' || model === 'YachtAsset' || cat === 'yachts' || cat === 'yacht') type = 'Yacht';
            else if (cat === 'estateasset' || model === 'EstateAsset' || cat === 'estates' || cat === 'estate' || cat === 'real estate') type = 'Estate';
            else if (cat === 'bikeasset' || model === 'BikeAsset' || cat === 'bikes' || cat === 'bike') type = 'Bike';
            else if (editData.propertyName || spec.propertyType || keySpec.propertyType) type = 'Estate';
            else if (editData.yachtName || spec.yachtName || spec.brandBuilder || editData.builder) type = 'Yacht';
            else if (spec.engineCapacityCC || spec.maxPower || spec.maxTorque || spec.mileageKM) type = 'Bike';
            else if (editData.brand || spec.brand || spec.model || spec.horsepower) type = 'Car';
            else if (model.toLowerCase().includes('car') || cat.includes('car')) type = 'Car';
            else if (model.toLowerCase().includes('bike') || cat.includes('bike')) type = 'Bike';
            else if (model.toLowerCase().includes('yacht') || cat.includes('yacht')) type = 'Yacht';
            else if (model.toLowerCase().includes('estate') || cat.includes('estate')) type = 'Estate';

            setAssetType(type);

            // Populate images
            const images = Array.isArray(editData.images) ? editData.images : [];
            setExistingImages(images);
            if (images.length > 0) {
                setCoverImage(images[0]);
                if (images.length > 1) {
                    setGalleryImages(images.slice(1));
                } else {
                    setGalleryImages([]);
                }
            } else {
                setCoverImage(null);
                setGalleryImages([]);
            }

            const parseAreaAndUnit = (val, defaultUnit = 'Sqft') => {
                if (!val) return { value: '', unit: defaultUnit };
                const str = val.toString().trim();
                const numMatch = str.match(/[\d,.]+/);
                const num = numMatch ? numMatch[0].replace(/,/g, '') : '';
                const lower = str.toLowerCase();
                let unit = defaultUnit;
                if (lower.includes('acre')) unit = 'Acres';
                else if (lower.includes('hect') || lower.includes('ha')) unit = 'hectres';
                else if (lower.includes('sq') || lower.includes('ft')) unit = 'Sqft';
                return { value: num, unit };
            };

            const parseNumber = (val) => {
                if (val === null || val === undefined) return '';
                const match = val.toString().match(/[\d.]+/);
                return match ? match[0] : '';
            };

            const buaParsed = parseAreaAndUnit(spec.builtUpArea || keySpec.builtUpArea, 'Sqft');
            const laParsed = parseAreaAndUnit(spec.landArea || keySpec.landArea, 'Sqft');

            // Populate Form State
            setFormData({
                ...initialFormState,
                // Common
                price: editData.price !== undefined ? editData.price : '',
                isPriceOnRequest: Boolean(editData.isPriceOnRequest),
                type: ['Car', 'Estate'].includes(type) && editData.status === 'Sold'
                    ? 'Sold'
                    : editData.type || 'Sale',
                location: editData.location || spec.carLocation || spec.yachtLocation || spec.city || spec.address || '',
                description: editData.description || '',
                videoUrl: editData.videoUrl || '',
                isPublic: ['Active', 'Live', 'Sold'].includes(editData.status),
                listingReference: editData.listingReference || '',

                // Fixed Highlights Keys
                highlight_hp: parseNumber(keySpec.power || spec.power || spec.horsepower || ''),
                highlight_km: parseNumber(keySpec.mileage || spec.mileage || spec.mileageKM || ''),
                highlight_cc: parseNumber(keySpec.cylinderCapacity || spec.cylinderCapacity || spec.engineCapacityCC || spec.engineCapacity || ''),
                highlight_length: parseNumber(keySpec.length || spec.length || ''),
                highlight_baths: parseNumber(keySpec.bathrooms || spec.bathrooms || ''),
                highlight_beds: parseNumber(keySpec.bedrooms || spec.bedrooms || ''),
                highlight_area: laParsed.value || parseNumber(keySpec.landArea || spec.landArea || ''),
                highlight_fuel: parseNumber(keySpec.fuelCapacity || spec.fuelCapacity || ''),
                highlight_garage: parseNumber(keySpec.garageCapacity || spec.garageCapacity || ''),
                highlight_built_area: buaParsed.value || parseNumber(keySpec.builtUpArea || spec.builtUpArea || ''),
                highlight_floors: parseNumber(keySpec.floors || spec.floors || ''),
                highlight_speed: parseNumber(keySpec.topSpeed || spec.topSpeed || ''),
                highlight_engine_type: keySpec.engineType || spec.engineType || '',
                highlight_engine_hp: parseNumber(spec.enginePower || keySpec.engineType || spec.engineType || ''),

                // Brand / Maker details
                make: editData.brand || spec.brand || spec.brandBuilder || editData.builder || editData.make || '',
                brand: editData.brand || spec.brand || '',
                builder: editData.builder || spec.brandBuilder || spec.builder || '',
                model: spec.model || editData.model || '',
                variant: spec.variant || editData.variant || '',
                year: spec.yearOfConstruction || spec.year || editData.year || new Date().getFullYear(),

                // Car Specifics
                mileage: parseNumber(spec.mileage || ''),
                fuelType: spec.fuel || spec.fuelType || keySpec.fuelType || '',
                transmission: spec.transmission || '',
                engine: spec.engine || '',
                exteriorColor: spec.exteriorColor || '',
                interiorColor: spec.interiorColor || '',
                condition: spec.condition || '',
                ownershipCount: parseNumber(spec.numberOfOwners || spec.ownershipCount || '1'),
                accidentHistory: spec.accidentHistory || '',
                accidentFree: spec.accidentFree || '',
                horsepower: parseNumber(spec.power || keySpec.power || spec.horsepower || ''),
                topSpeed: parseNumber(spec.topSpeed || keySpec.topSpeed || ''),
                engineType: spec.engineType || keySpec.engineType || '',
                bodyType: spec.body || spec.bodyType || '',
                series: spec.series || '',
                cylinderCapacity: parseNumber(spec.cylinderCapacity || ''),
                driveType: spec.drive || spec.driveType || '',
                steering: spec.steering || '',
                interiorMaterial: spec.interiorMaterial || '',
                manufacturerColorCode: spec.manufacturerColorCode || '',
                matchingNumbers: spec.matchingNumbers || '',
                countryOfFirstDelivery: spec.countryOfFirstDelivery || '',
                currentCarLocation: spec.carLocation || editData.location || '',
                latitude: spec.latitude || '',
                longitude: spec.longitude || '',
                soulOfTheCar: spec.soulOfTheCar || '',
                idealBuyer: spec.idealBuyer || '',
                torque: parseNumber((spec.torque || '').toString().replace(/,/g, '')),
                acceleration: parseNumber(spec.acceleration || ''),
                tag: editData.tag || '',

                // Yacht Specifics
                yachtName: editData.yachtName || (type === 'Yacht' ? editData.title : '') || '',
                length: parseNumber(spec.length || keySpec.length),
                beam: parseNumber(spec.beam),
                draft: parseNumber(spec.draft),
                cruisingSpeed: parseNumber(spec.cruisingSpeed),
                usageHours: spec.usageHours || '',
                fuelConsumption: spec.fuelConsumption || '',
                guestCapacity: parseNumber(spec.guestCapacity),
                crewCapacity: parseNumber(spec.crewCapacity),
                hullMaterial: spec.hullMaterial || '',
                bathrooms: parseNumber(keySpec.bathrooms || spec.bathrooms),
                bedrooms: parseNumber(keySpec.bedrooms || spec.bedrooms),
                fuelCapacity: parseNumber(keySpec.fuelCapacity || spec.fuelCapacity),

                // Real Estate Specifics
                directlyFromDeveloper: Boolean(editData.directlyFromDeveloper ?? editData.isDirectFromDeveloper ?? false),
                propertyName: editData.propertyName || (type === 'Estate' ? editData.title : '') || '',
                propertyType: spec.propertyType || keySpec.propertyType || '',
                builtUpArea: buaParsed.value,
                builtUpAreaUnit: buaParsed.unit,
                landArea: laParsed.value,
                landAreaUnit: laParsed.unit,
                floors: parseNumber(spec.floors || keySpec.floors),
                garageCapacity: parseNumber(spec.garageCapacity || keySpec.garageCapacity),
                furnishingStatus: spec.furnishingStatus || '',
                architectureStyle: spec.architectureStyle || '',
                configuration: spec.configuration || '',
                interiorColorTheme: spec.interiorColorTheme || '',
                exteriorFinish: spec.exteriorFinish || '',
                climateControl: spec.climateControl || '',
                usageStatus: spec.usageStatus || '',
                country: spec.country || '',
                city: spec.city || '',
                address: spec.address || '',
                areaNeighborhood: spec.areaNeighborhood || '',
                amenities: Array.isArray(editData.amenities) ? editData.amenities : [],
                smartHomeSystems: Array.isArray(editData.smartHomeSystems) ? editData.smartHomeSystems : [],
                viewTypes: Array.isArray(editData.viewTypes) ? editData.viewTypes : [],

                // Bike Specifics
                engineCapacity: parseNumber(spec.engineCapacityCC || spec.engineCapacity || keySpec.engineCapacity),
                maxPower: spec.maxPower || '',
                maxTorque: spec.maxTorque || '',
                abs: spec.abs || '',
                tractionControl: spec.tractionControl || '',
                color: spec.color || '',

                // Price History from editData
                priceHistoryRange: editData.priceHistory?.length > 10 ? '15 Years' : (editData.priceHistory?.length > 5 ? '10 Years' : '5 Years'),
                priceHistory: Array.from({ length: 15 }, (_, i) => {
                    const targetYear = new Date().getFullYear() - i;
                    const existing = editData.priceHistory?.find(h => h.year === targetYear);
                    return existing || {
                        year: targetYear,
                        price: '',
                        currency: editData.priceHistoryOptions?.currency || 'USD $'
                    };
                }),
                priceHistoryOptions: {
                    graphType: editData.priceHistoryOptions?.graphType || 'Bar Graph',
                    currency: editData.priceHistoryOptions?.currency || 'USD $',
                    useInflationAdjusted: editData.priceHistoryOptions?.useInflationAdjusted || false,
                    allowAIEstimate: editData.priceHistoryOptions?.allowAIEstimate || false
                }
            });
        } else {
            // New Asset: Pre-populate 5 years of price history if empty
            setFormData(prev => {
                if (prev.priceHistory && prev.priceHistory.length > 0) return prev;
                
                const currentYear = new Date().getFullYear();
                const defaultHistory = Array.from({ length: 5 }, (_, i) => ({
                    year: currentYear - i,
                    price: '',
                    currency: prev.priceHistoryOptions?.currency || 'USD $'
                }));
                return { ...prev, priceHistory: defaultHistory };
            });
        }
    }, [isOpen, editData]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const nextValue = type === 'checkbox' ? checked : value;
            if (name === 'make' && prev.make.trim().toLowerCase() !== String(nextValue).trim().toLowerCase()) {
                return { ...prev, make: nextValue, model: '', variant: '' };
            }
            if (name === 'model' && prev.model.trim().toLowerCase() !== String(nextValue).trim().toLowerCase()) {
                return { ...prev, model: nextValue, variant: '' };
            }
            return { ...prev, [name]: nextValue };
        });
    };

    const handleGenerateId = () => {
        const prefix = "#NJM";
        const randomDigits = Math.floor(1000000 + Math.random() * 9000000).toString();
        setFormData(prev => ({ ...prev, listingReference: `${prefix}${randomDigits}` }));
    };

    const handleCheckboxToggle = (listName, value) => {
        setFormData(prev => {
            const currentList = prev[listName] || [];
            if (currentList.includes(value)) {
                return { ...prev, [listName]: currentList.filter(item => item !== value) };
            } else {
                return { ...prev, [listName]: [...currentList, value] };
            }
        });
    };

    const parseNumber = (val) => {
        if (val === null || val === undefined) return '';
        const match = val.toString().match(/[\d.]+/);
        return match ? match[0] : '';
    };

    const handleSubmit = async (e, draftOverride = null) => {
        const isDraft = draftOverride !== null ? draftOverride : !formData.isPublic;

        // Validation for non-draft submissions
        if (!isDraft) {
            const requiredCommon = ['location', 'description', 'listingReference', 'latitude', 'longitude'];
            
            if (assetType === 'Estate') {
                requiredCommon.push('propertyName');
            }
            if (assetType === 'Car') {
                requiredCommon.push('make', 'model');
            }

            for (const field of requiredCommon) {
                if (!formData[field] && formData[field] !== 0) {
                    const label = field.replace(/([A-Z])/g, ' $1').toLowerCase();
                    alert(`Please fill in the ${label} field.`);
                    return;
                }
            }

            if (!formData.price && !formData.isPriceOnRequest) {
                alert("Please enter a price or select 'Price on Request'");
                return;
            }

            // Key Highlights Validation
            let highlightFields = [];
            if (assetType === 'Car') {
                highlightFields = ['highlight_engine_type', 'highlight_hp'];
            } else if (assetType === 'Yacht') {
                highlightFields = ['highlight_length', 'highlight_baths', 'highlight_fuel', 'highlight_engine_hp', 'highlight_beds', 'highlight_speed'];
            } else if (assetType === 'Estate') {
                highlightFields = ['highlight_area', 'highlight_baths', 'highlight_garage', 'highlight_built_area', 'highlight_beds', 'highlight_floors'];
            } else if (assetType === 'Bike') {
                highlightFields = ['highlight_cc', 'highlight_speed', 'highlight_fuel'];
            }

            for (const field of highlightFields) {
                if (!formData[field] && formData[field] !== 0) {
                    const label = field.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase();
                    alert(`Please fill in the ${label} field (Key Highlight).`);
                    return;
                }
            }

            if (!coverImage && galleryImages.length === 0) {
                alert("Please upload at least one image (Cover or Gallery).");
                return;
            }
        } else {
            if (!formData.model && !editData && assetType === 'Car') {
                formData.model = 'Draft Asset';
            }
            if (!formData.propertyName && !editData && assetType === 'Estate') {
                formData.propertyName = 'Draft Asset';
            }
            if (!formData.listingReference && !editData) {
                handleGenerateId();
            }
        }

        setLoading(true);
        
        const data = new FormData();

        // Sync highlights to main fields
        if (assetType === 'Car') {
            if (!formData.horsepower) formData.horsepower = formData.highlight_hp;
            if (!formData.topSpeed) formData.topSpeed = formData.highlight_speed;
            if (!formData.engineType) formData.engineType = formData.highlight_engine_type;
        } else if (assetType === 'Yacht') {
            if (!formData.length) formData.length = formData.highlight_length;
            if (!formData.bathrooms) formData.bathrooms = formData.highlight_baths;
            if (!formData.topSpeed) formData.topSpeed = formData.highlight_speed;
            if (!formData.bedrooms) formData.bedrooms = formData.highlight_beds;
            if (!formData.fuelCapacity) formData.fuelCapacity = formData.highlight_fuel;
            if (!formData.engineType) formData.engineType = formData.highlight_engine_hp;
        } else if (assetType === 'Estate') {
            if (!formData.landArea) formData.landArea = formData.highlight_area;
            if (!formData.bathrooms) formData.bathrooms = formData.highlight_baths;
            if (!formData.builtUpArea) formData.builtUpArea = formData.highlight_built_area;
            if (!formData.bedrooms) formData.bedrooms = formData.highlight_beds;
            if (!formData.floors) formData.floors = formData.highlight_floors;
            if (!formData.garageCapacity) formData.garageCapacity = formData.highlight_garage;
        } else if (assetType === 'Bike') {
            if (!formData.engineCapacity) formData.engineCapacity = formData.highlight_cc;
            if (!formData.topSpeed) formData.topSpeed = formData.highlight_speed;
        }

        // Highlights construction
        let constructedHighlights = [];
        if (assetType === 'Car') {
            constructedHighlights = [
                formData.highlight_speed ? `${parseNumber(formData.highlight_speed)} mph` : '',
                formData.highlight_engine_type ? `${formData.highlight_engine_type}` : '',
                formData.highlight_hp ? `${parseNumber(formData.highlight_hp)} hp` : ''
            ].filter(Boolean);
        } else if (assetType === 'Yacht') {
            constructedHighlights = [
                formData.highlight_length ? `${parseNumber(formData.highlight_length)} M length` : '',
                formData.highlight_baths ? `Bathrooms: ${parseNumber(formData.highlight_baths)}` : '',
                formData.highlight_fuel ? `${parseNumber(formData.highlight_fuel)} L fuel capacity` : '',
                formData.highlight_engine_hp ? `${parseNumber(formData.highlight_engine_hp)} HP total` : '',
                formData.highlight_beds ? `Bedrooms: ${parseNumber(formData.highlight_beds)}` : '',
                formData.highlight_speed ? `TopSpeed: ${parseNumber(formData.highlight_speed)} knots` : ''
            ].filter(Boolean);
        } else if (assetType === 'Estate') {
            const cleanArea = parseNumber(formData.highlight_area);
            const cleanBuiltArea = parseNumber(formData.highlight_built_area);
            constructedHighlights = [
                cleanArea ? `Land Area: ${cleanArea} ${formData.landAreaUnit}` : '',
                formData.highlight_baths ? `Bathrooms: ${parseNumber(formData.highlight_baths)}` : '',
                formData.highlight_garage ? `Garage: ${parseNumber(formData.highlight_garage)} Cars` : '',
                cleanBuiltArea ? `Built Area: ${cleanBuiltArea} ${formData.builtUpAreaUnit}` : '',
                formData.highlight_beds ? `Bedrooms: ${parseNumber(formData.highlight_beds)}` : '',
                formData.highlight_floors ? `Floors: ${parseNumber(formData.highlight_floors)}` : ''
            ].filter(Boolean);
        } else if (assetType === 'Bike') {
            constructedHighlights = [
                formData.highlight_cc ? `${parseNumber(formData.highlight_cc)} cc` : '',
                formData.highlight_speed ? `${parseNumber(formData.highlight_speed)} km/h` : '',
                formData.highlight_fuel ? `${parseNumber(formData.highlight_fuel)} liters` : ''
            ].filter(Boolean);
        }

        Object.keys(formData).forEach(key => {
            if (key.startsWith('highlight_') || ['highlights', 'amenities', 'smartHomeSystems', 'viewTypes', 'priceHistory', 'priceHistoryOptions'].includes(key)) {
                return;
            }
            if (key === 'isPublic' && draftOverride !== null) {
                data.append(key, !draftOverride);
            } else if (key === 'builtUpArea') {
                const num = parseNumber(formData.builtUpArea);
                data.append(key, num ? `${num} ${formData.builtUpAreaUnit}` : '');
            } else if (key === 'landArea') {
                const num = parseNumber(formData.landArea);
                data.append(key, num ? `${num} ${formData.landAreaUnit}` : '');
            } else if (['builtUpAreaUnit', 'landAreaUnit'].includes(key)) {
                return;
            } else {
                data.append(key, formData[key] !== null && formData[key] !== undefined ? formData[key] : '');
            }
        });

        data.append('highlights', JSON.stringify(constructedHighlights));
        data.append('priceHistory', JSON.stringify(formData.priceHistory));
        data.append('priceHistoryOptions', JSON.stringify(formData.priceHistoryOptions));

        if (formData.amenities) data.append('amenities', JSON.stringify(formData.amenities));
        if (formData.smartHomeSystems) data.append('smartHomeSystems', JSON.stringify(formData.smartHomeSystems));
        if (formData.viewTypes) data.append('viewTypes', JSON.stringify(formData.viewTypes));

        data.append('category', assetType);

        // Retained Existing Image URLs & New File Uploads
        const retainedImages = [];
        if (typeof coverImage === 'string' && coverImage) {
            retainedImages.push(coverImage);
        }
        galleryImages.forEach(img => {
            if (typeof img === 'string' && img) {
                retainedImages.push(img);
            }
        });

        data.append('retainedImages', JSON.stringify(retainedImages));

        // Append new cover image file if selected
        if (coverImage instanceof File) {
            data.append('images', coverImage);
            data.append('isCoverNew', 'true');
        }

        // Append new gallery image files
        galleryImages.forEach(img => {
            if (img instanceof File) {
                data.append('images', img);
            }
        });

        // Documents
        documents.forEach(doc => {
            if (doc instanceof File) {
                data.append('documents', doc);
            }
        });

        try {
            const url = editData
                ? `/api/listings/${editData.id || editData._id}`
                : '/api/listings/create';

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                setIsSuccess(true);
                onCreated(result, !!editData);

                setTimeout(() => {
                    onClose();
                    setIsSuccess(false);
                }, 1500);
            } else {
                const errData = await response.json();
                alert(errData.error || errData.message || "Failed to save asset");
            }
        } catch (error) {
            console.error(error);
            alert("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const types = [
        { id: 'Car', label: 'Car', icon: carIcon },
        { id: 'Estate', label: 'Real Estate', icon: estateIcon },
        { id: 'Yacht', label: 'Yacht', icon: yachtIcon },
        { id: 'Bike', label: 'Bike', icon: bikeIcon },
    ];

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        <FiCheckCircle />
                    </div>
                    <h2 className="text-3xl font-bold canela text-gray-900 mb-2">Success!</h2>
                    <p className="text-gray-500 font-medium">Your luxury listing has been {editData ? 'updated' : 'created'} successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="asset-modal fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-10 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        {step === 1 && !editData && (
                            <button onClick={() => setStep(0)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <FiArrowLeft className="text-xl" />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold canela text-black">
                            {step === 0 ? 'Select Asset Type' : `${editData ? 'Edit' : 'Add'} ${assetType} Details`}
                        </h2>
                    </div>
                    <button onClick={handleCloseAttempt} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">

                    {/* STEP 0: TYPE SELECT */}
                    {step === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {types.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => {
                                        setAssetType(type.id);
                                        setStep(1);
                                    }}
                                    className="group bg-white border border-gray-100 p-8 rounded-[2rem] hover:border-[#D48D2A] hover:bg-[#F2E8DB]/20 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between min-h-[260px]"
                                >
                                    <div className="flex-1 w-full flex justify-center items-center grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 duration-500">
                                        <img className="max-w-[140px] max-h-[100px] object-contain" src={type.icon} alt="icon" title={type.label} />
                                    </div>
                                    <span className="text-xl font-bold text-black canela mt-6">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP 1: FORM DETAILS */}
                    {step === 1 && (
                        <div className="space-y-16 animate-in slide-in-from-bottom-5 duration-500">

                            {/* Section Header */}
                            <div className="flex justify-between items-center pb-8 border-b border-gray-100">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-[#FDF8F0] border border-[#F2E8DB] rounded-2xl flex items-center justify-center text-3xl shadow-sm p-1">
                                        <img className='w-fit object-contain' src={assetType === 'Car' ? carIcon : assetType === 'Yacht' ? yachtIcon : assetType === 'Estate' ? estateIcon : assetType === 'Bike' ? bikeIcon : otherassetIcon} alt={assetType} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-black canela">{assetType} Details</h3>
                                        <p className="text-sm text-gray-500 font-medium">{editData ? 'Update the details and images of this listing' : 'Fill in the details for your luxury listing'}</p>
                                    </div>
                                </div>
                                {!editData && (
                                    <button onClick={() => setStep(0)} className="px-6 py-2.5 bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 border border-gray-200 transition-all">
                                        Change Type
                                    </button>
                                )}
                            </div>

                            {/* Common Details for all types */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 pb-8 border-b border-gray-100">
                                <InputField
                                    label={assetType === 'Estate' ? "Property Name *" : (assetType === 'Yacht' ? "Yacht Name *" : "Make / Brand *")}
                                    name={assetType === 'Estate' ? "propertyName" : (assetType === 'Yacht' ? "yachtName" : "make")}
                                    value={assetType === 'Estate' ? formData.propertyName : (assetType === 'Yacht' ? formData.yachtName : formData.make)}
                                    placeholder={assetType === 'Estate' ? "e.g., Monaco Penthouse" : "e.g., Ferrari / Azimut"}
                                    onChange={handleInputChange}
                                    required={assetType === 'Car'} 
                                    options={assetType === 'Car' ? carSuggestions.brands : undefined}
                                    suggestionPlaceholder="Search brands..."
                                />
                                {assetType === 'Yacht' && (
                                    <InputField 
                                        label="Builder *" 
                                        name="builder" 
                                        value={formData.builder} 
                                        placeholder="e.g., Azimut / Sunseeker" 
                                        onChange={handleInputChange} 
                                        required={false} 
                                    />
                                )}
                                {assetType !== 'Estate' && (
                                    <>
                                        <InputField 
                                            label="Model *" 
                                            name="model" 
                                            value={formData.model} 
                                            placeholder="e.g., SF90 / Grande 32" 
                                            onChange={handleInputChange} 
                                            required={assetType === 'Car'} 
                                            options={assetType === 'Car' ? carSuggestions.models : undefined}
                                            suggestionDisabled={assetType === 'Car' && !formData.make.trim()}
                                            suggestionPlaceholder="Search models..."
                                        />
                                        <InputField label="Variant" name="variant" value={formData.variant} placeholder="e.g., Assetto Fiorano / S" onChange={handleInputChange} required={false} options={assetType === 'Car' ? carSuggestions.variants : undefined} suggestionDisabled={assetType === 'Car' && (!formData.make.trim() || !formData.model.trim())} suggestionPlaceholder="Search variants..." />
                                        <InputField label="Year *" name="year" type="number" value={formData.year} onChange={handleInputChange} required={false} />
                                    </>
                                )}
                                <div className="flex flex-col gap-3">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        disabled={formData.isPriceOnRequest}
                                        required={false}
                                        placeholder={formData.isPriceOnRequest ? "Price on Request" : "0.00"}
                                        className="w-full p-3.5 bg-gray-50/50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all disabled:opacity-50 font-medium text-black placeholder:text-gray-400"
                                        onChange={handleInputChange}
                                    />
                                    <div className="relative">
                                        <select
                                            name="isPriceOnRequest"
                                            value={formData.isPriceOnRequest}
                                            className="w-full p-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all appearance-none cursor-pointer pr-10 text-[10px] font-bold uppercase tracking-widest text-black"
                                            onChange={(e) => setFormData({ ...formData, isPriceOnRequest: e.target.value === 'true' })}
                                        >
                                            <option value="false" className="text-black bg-white">Show Fixed Price</option>
                                            <option value="true" className="text-black bg-white">Price On Request</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <FiChevronDown />
                                        </div>
                                    </div>
                                </div>
                                <SelectField
                                    label="Listing Type"
                                    name="type"
                                    value={formData.type}
                                    options={assetType === 'Car' || assetType === 'Estate' ? ['Sale', 'Rent', 'Sold'] : ['Sale', 'Rent']}
                                    onChange={handleInputChange}
                                    required
                                />
                                {assetType === 'Car' && (
                                    <SelectField label="Tag / Badge" name="tag" value={formData.tag} options={CAR_TAG_OPTIONS} onChange={handleInputChange} required={false} />
                                )}
                                
                                {/* Listing Reference ID Field */}
                                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#FAFBFB] p-8 rounded-[2rem] border border-gray-200 flex flex-col gap-6 mt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset ID (Listing Reference)</label>
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="idMode" 
                                                    checked={!formData.autoGenerateId} 
                                                    onChange={() => setFormData(prev => ({ ...prev, autoGenerateId: false }))}
                                                    className="w-4 h-4 border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A] cursor-pointer" 
                                                />
                                                <span className="text-[11px] font-bold text-black uppercase tracking-wider group-hover:text-[#D48D2A] transition-colors">I have an ID</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="idMode" 
                                                    checked={formData.autoGenerateId} 
                                                    onChange={() => {
                                                        setFormData(prev => ({ ...prev, autoGenerateId: true }));
                                                        handleGenerateId();
                                                    }}
                                                    className="w-4 h-4 border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A] cursor-pointer" 
                                                />
                                                <span className="text-[11px] font-bold text-black uppercase tracking-wider group-hover:text-[#D48D2A] transition-colors">Generate ID</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex-1 w-full">
                                            <input 
                                                type="text" 
                                                name="listingReference" 
                                                value={formData.listingReference} 
                                                placeholder="e.g. #NJM8314201"
                                                className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 text-sm font-mono text-black focus:outline-none focus:border-[#D48D2A] transition-all shadow-sm"
                                                onChange={handleInputChange} 
                                                readOnly={formData.autoGenerateId}
                                            />
                                        </div>
                                        {formData.autoGenerateId && (
                                            <button 
                                                type="button"
                                                onClick={handleGenerateId}
                                                className="px-10 py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all whitespace-nowrap shadow-lg shadow-black/10"
                                            >
                                                Generate ID
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {assetType === 'Estate' && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#FAFBFB] p-6 sm:p-7 rounded-[1.5rem] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                                        <div className="flex items-start gap-3.5">
                                            <div className="p-2.5 bg-amber-50 border border-amber-200/60 rounded-xl text-[#D48D2A] shrink-0 mt-0.5">
                                                <FiTag className="text-lg" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-sm font-bold text-gray-900 tracking-tight">Directly from Developer & 3% Price Deduction</h5>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100/80 text-[#B58252] border border-amber-200/80 rounded-md">Estate Feature</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-2xl">
                                                    Enable to display the <span className="font-semibold text-gray-700">"Directly from Developer"</span> badge and <span className="font-semibold text-gray-700">"3% Price Deduction" (-3% with Otulia)</span> tags on the estate card and property details page.
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
                                            <input 
                                                type="checkbox" 
                                                name="directlyFromDeveloper" 
                                                checked={Boolean(formData.directlyFromDeveloper)} 
                                                onChange={handleInputChange} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-12 h-6.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-[#D48D2A] transition-colors"></div>
                                        </label>
                                    </div>
                                )}

                                {assetType === 'Car' && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                        <div className="flex flex-col">
                                            <label className="block text-[10px] font-bold text-[#D48D2A] uppercase tracking-widest mb-3">Soul of the Car</label>
                                            <textarea
                                                name="soulOfTheCar"
                                                value={formData.soulOfTheCar}
                                                onChange={handleInputChange}
                                                placeholder="e.g. A celebration of 60 years of the 911..."
                                                rows="4"
                                                className="w-full p-6 bg-white border border-[#D48D2A]/20 rounded-[1.5rem] focus:outline-none focus:border-[#D48D2A] transition-all text-sm leading-relaxed text-black shadow-sm placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="block text-[10px] font-bold text-[#D48D2A] uppercase tracking-widest mb-3">Ideal Buyer</label>
                                            <textarea
                                                name="idealBuyer"
                                                value={formData.idealBuyer}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Made for Porsche lovers who enjoy pure driving..."
                                                rows="4"
                                                className="w-full p-6 bg-white border border-[#D48D2A]/20 rounded-[1.5rem] focus:outline-none focus:border-[#D48D2A] transition-all text-sm leading-relaxed text-black shadow-sm placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                )}

                                <LocationInputField label="Location *" name="location" value={formData.location} placeholder="Beverly Hills, CA" onChange={handleInputChange} required />
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 pt-8">
                                {assetType === 'Car' && (
                                    <>
                                        <InputField label="Horsepower" name="horsepower" value={formData.horsepower} placeholder="e.g., 789" onChange={handleInputChange} required={false} />
                                        <InputField label="Top Speed" name="topSpeed" value={formData.topSpeed} placeholder="e.g., 211" onChange={handleInputChange} required={false} />
                                        <InputField label="Engine Type" name="engineType" value={formData.engineType} placeholder="e.g., V12" onChange={handleInputChange} required={false} />
                                        <InputField label="Torque (Nm)" name="torque" type="number" value={formData.torque} placeholder="e.g., 1000" onChange={handleInputChange} required={false} />
                                        <InputField label="0-100 km/h (sec)" name="acceleration" value={formData.acceleration} placeholder="e.g., 3.2" onChange={handleInputChange} required={false} />
                                        <InputField label="Mileage" name="mileage" type="number" value={formData.mileage} placeholder="1500" onChange={handleInputChange} required={false} />
                                        <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Gasoline', 'Diesel', 'Hybrid', 'Electric']} onChange={handleInputChange} required={false} />
                                        <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Automatic', 'Manual', 'PDK', 'F1']} onChange={handleInputChange} required={false} />
                                        <InputField label="Engine" name="engine" value={formData.engine} placeholder="e.g., 4.0L V8 Twin-Turbo" onChange={handleInputChange} required={false} />
                                        <InputField label="Exterior Color" name="exteriorColor" value={formData.exteriorColor} placeholder="e.g., Rosso Corsa" onChange={handleInputChange} required={false} />
                                        <InputField label="Interior Color" name="interiorColor" value={formData.interiorColor} placeholder="e.g., Black Leather" onChange={handleInputChange} required={false} />
                                        <SelectField label="Condition" name="condition" value={formData.condition} options={['New', 'Used', 'Classic', 'Restored']} onChange={handleInputChange} required={false} />
                                        <InputField label="Ownership Count" name="ownershipCount" type="number" value={formData.ownershipCount} onChange={handleInputChange} required={false} />
                                        <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} required={false} />
                                        <InputField label="Configuration" name="configuration" value={formData.configuration} placeholder="e.g., LHD" onChange={handleInputChange} required={false} />
                                        <InputField label="Cylinder Capacity" name="cylinderCapacity" type="number" value={formData.cylinderCapacity} placeholder="e.g., 3990" onChange={handleInputChange} required={false} />
                                        <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} placeholder="e.g., Alcantara" onChange={handleInputChange} required={false} />
                                        <InputField label="Country of First Delivery" name="countryOfFirstDelivery" value={formData.countryOfFirstDelivery} placeholder="e.g., Germany" onChange={handleInputChange} required={false} />
                                        <InputField label="Body Type" name="bodyType" value={formData.bodyType} placeholder="e.g., Coupe" onChange={handleInputChange} required={false} />
                                        <InputField label="Series" name="series" value={formData.series} placeholder="e.g., SF90" onChange={handleInputChange} required={false} />
                                        <SelectField label="Steering" name="steering" value={formData.steering} options={['Left Hand Drive', 'Right Hand Drive']} onChange={handleInputChange} required={false} />
                                        <SelectField label="Drive Type" name="driveType" value={formData.driveType} options={['AWD', 'RWD', 'FWD', '4WD']} onChange={handleInputChange} required={false} />
                                        <InputField label="Manufacturer Color Code" name="manufacturerColorCode" value={formData.manufacturerColorCode} placeholder="e.g., FER 322" onChange={handleInputChange} required={false} />
                                        <SelectField label="Matching Numbers" name="matchingNumbers" value={formData.matchingNumbers} options={['Yes', 'No']} onChange={handleInputChange} required={false} />
                                        <SelectField label="Accident Free" name="accidentFree" value={formData.accidentFree} options={['Yes', 'No']} onChange={handleInputChange} required={false} />
                                        <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 34.0522" onChange={handleInputChange} required />
                                        <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., -118.2437" onChange={handleInputChange} required />
                                    </>
                                )}
                                {assetType === 'Yacht' && (
                                    <>
                                        <InputField label="Length (m)" name="length" type="number" value={formData.length} placeholder="32" onChange={handleInputChange} required />
                                        <InputField label="Beam (m)" name="beam" type="number" value={formData.beam} placeholder="7.5" onChange={handleInputChange} required />
                                        <InputField label="Draft (m)" name="draft" type="number" value={formData.draft} placeholder="2.2" onChange={handleInputChange} required />
                                        <InputField label="Engine Type" name="engineType" value={formData.engineType} placeholder="e.g., Twin MTU 16V 2000" onChange={handleInputChange} required />
                                        <InputField label="Cruising Speed (knots)" name="cruisingSpeed" type="number" value={formData.cruisingSpeed} placeholder="22" onChange={handleInputChange} required />
                                        <InputField label="Top Speed (knots)" name="topSpeed" type="number" value={formData.topSpeed} placeholder="28" onChange={handleInputChange} required />
                                        <InputField label="Usage Hours" name="usageHours" value={formData.usageHours} placeholder="e.g., 500" onChange={handleInputChange} required />
                                        <InputField label="Fuel Consumption" name="fuelConsumption" value={formData.fuelConsumption} placeholder="e.g., 150 L/h" onChange={handleInputChange} required />
                                        <InputField label="Guest Capacity" name="guestCapacity" type="number" value={formData.guestCapacity} placeholder="12" onChange={handleInputChange} required />
                                        <InputField label="Crew Capacity" name="crewCapacity" type="number" value={formData.crewCapacity} placeholder="6" onChange={handleInputChange} required />
                                        <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Diesel', 'Gasoline', 'Hybrid', 'Electric']} onChange={handleInputChange} required />
                                        <SelectField label="Hull Material" name="hullMaterial" value={formData.hullMaterial} options={['Fiberglass', 'Steel', 'Aluminum', 'Carbon Fiber', 'Wood']} onChange={handleInputChange} required />
                                        <SelectField label="Condition" name="condition" value={formData.condition} options={['New', 'Used', 'Classic', 'Restored']} onChange={handleInputChange} required />
                                        <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} placeholder="e.g., Teak & Marble" onChange={handleInputChange} required />
                                        <InputField label="Exterior Color" name="exteriorColor" value={formData.exteriorColor} placeholder="e.g., White" onChange={handleInputChange} required />
                                        <InputField label="Country of First Delivery" name="countryOfFirstDelivery" value={formData.countryOfFirstDelivery} placeholder="e.g., Italy" onChange={handleInputChange} required />
                                        <InputField label="Number of Owners" name="numberOfOwners" type="number" value={formData.numberOfOwners} onChange={handleInputChange} required />
                                        <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 34.0522" onChange={handleInputChange} required />
                                        <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., -118.2437" onChange={handleInputChange} required />
                                    </>
                                )}
                                {assetType === 'Estate' && (
                                    <>
                                        <SelectField label="Property Type" name="propertyType" value={formData.propertyType} options={['Villa', 'Penthouse', 'Apartment', 'Mansion', 'Estate']} onChange={handleInputChange} required />
                                        <InputField label="Country" name="country" value={formData.country} placeholder="e.g., Monaco" onChange={handleInputChange} required />
                                        <InputField label="City" name="city" value={formData.city} placeholder="e.g., Monte Carlo" onChange={handleInputChange} required />
                                        <InputField label="Address (Optional)" name="address" value={formData.address} placeholder="e.g., Avenue Princess Grace" onChange={handleInputChange} required />
                                        <InputField label="Area / Neighborhood" name="areaNeighborhood" value={formData.areaNeighborhood} placeholder="e.g., South Beach" onChange={handleInputChange} required />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-1">
                                            <div className="sm:col-span-2">
                                                <InputField label="Built-up Area" name="builtUpArea" type="number" value={formData.builtUpArea} placeholder="5500" onChange={handleInputChange} required />
                                            </div>
                                            <div>
                                                <SelectField label="Unit" name="builtUpAreaUnit" value={formData.builtUpAreaUnit} options={['Sqft', 'Acres', 'hectres']} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-1">
                                            <div className="sm:col-span-2">
                                                <InputField label="Land Area" name="landArea" type="number" value={formData.landArea} placeholder="8000" onChange={handleInputChange} required />
                                            </div>
                                            <div>
                                                <SelectField label="Unit" name="landAreaUnit" value={formData.landAreaUnit} options={['Sqft', 'Acres', 'hectres']} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                        <InputField label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms} placeholder="5" onChange={handleInputChange} required />
                                        <InputField label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms} placeholder="6" onChange={handleInputChange} required />
                                        <InputField label="Floors" name="floors" type="number" value={formData.floors} placeholder="2" onChange={handleInputChange} required />
                                        <InputField label="Garage Capacity (Cars)" name="garageCapacity" type="number" value={formData.garageCapacity} placeholder="3" onChange={handleInputChange} required />
                                        <SelectField label="Furnishing Status" name="furnishingStatus" value={formData.furnishingStatus} options={['Unfurnished', 'Partially Furnished', 'Fully Furnished', 'Designer Furnished']} onChange={handleInputChange} required />
                                        <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 25.7617" onChange={handleInputChange} required />
                                        <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., -80.1918" onChange={handleInputChange} required />
                                    </>
                                )}
                                {assetType === 'Bike' && (
                                    <>
                                        <InputField label="Engine Capacity (cc)" name="engineCapacity" type="number" value={formData.engineCapacity} placeholder="e.g., 1000" onChange={handleInputChange} required />
                                        <InputField label="Max Power" name="maxPower" value={formData.maxPower} placeholder="e.g., 214 hp" onChange={handleInputChange} required />
                                        <InputField label="Max Torque" name="maxTorque" value={formData.maxTorque} placeholder="e.g., 124 Nm" onChange={handleInputChange} required />
                                        <InputField label="Mileage (km)" name="mileage" type="number" value={formData.mileage} placeholder="e.g., 5000" onChange={handleInputChange} required />
                                        <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Petrol', 'Electric', 'Hybrid']} onChange={handleInputChange} required />
                                        <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Manual', 'Automatic', 'Semi-Automatic']} onChange={handleInputChange} required />
                                        <InputField label="Color" name="color" value={formData.color} placeholder="e.g., Midnight Black" onChange={handleInputChange} required />
                                        <SelectField label="ABS" name="abs" value={formData.abs} options={['Yes', 'No']} onChange={handleInputChange} required />
                                        <SelectField label="Traction Control" name="tractionControl" value={formData.tractionControl} options={['Yes', 'No']} onChange={handleInputChange} required />
                                        <SelectField label="Condition" name="condition" value={formData.condition} options={['New', 'Used', 'Pre-Owned', 'Classic']} onChange={handleInputChange} required />
                                        <InputField label="Ownership Count" name="ownershipCount" type="number" value={formData.ownershipCount} onChange={handleInputChange} required />
                                        <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} required />
                                        <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 34.0522" onChange={handleInputChange} required />
                                        <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., -118.2437" onChange={handleInputChange} required />
                                    </>
                                )}
                            </div>

                            {/* Section for Estate Amenities */}
                            {assetType === 'Estate' && (
                                <div className="space-y-6">
                                    <div className="bg-[#FAFBFB] p-10 rounded-[2.5rem] border border-gray-200">
                                        <h4 className="text-xl font-bold text-black canela mb-2">Amenities & Details</h4>
                                        <p className="text-sm text-gray-500 mb-8 font-medium">Select all luxurious additions found within the property</p>
                                        
                                        {[
                                            { title: "Lifestyle & Amenities", desc: "Select all amenities that apply to this property.", items: ESTATE_LIFESTYLE_AMENITIES, num: 1 },
                                            { title: "Views & Outdoor Experience", desc: "Select all views and outdoor experiences that apply to this property.", items: ESTATE_VIEWS_OUTDOOR, num: 2 },
                                            { title: "Smart, Security & Technology", desc: "Select all smart, security and technology features that apply to this property.", items: ESTATE_SMART_SECURITY, num: 3 },
                                            { title: "Ultra Luxury Features", desc: "Select all ultra luxury features that apply to this property.", items: ESTATE_ULTRA_LUXURY, num: 4 }
                                        ].map((section) => (
                                            <div key={section.num} className="bg-white p-8 rounded-3xl mb-8 border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg font-bold font-serif text-[#D48D2A]">{section.num}.</span>
                                                    <h3 className="text-lg font-bold text-black">{section.title}</h3>
                                                    {section.num === 4 && <span className="ml-2 bg-[#fef3c7] text-[#d97706] px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">Premium</span>}
                                                </div>
                                                <p className="text-xs text-gray-500 mb-6 font-medium">{section.desc}</p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                    {section.items.map(amenity => (
                                                        <button
                                                            key={amenity}
                                                            type="button"
                                                            onClick={() => handleCheckboxToggle('amenities', amenity)}
                                                            className={`flex items-center justify-start gap-3 px-4 py-3 rounded-xl border text-[11px] md:text-xs font-semibold transition-all ${formData.amenities.includes(amenity) ? 'bg-[#fef9f3] border-[#D48D2A] text-[#D48D2A]' : 'bg-white border-gray-200 text-black hover:border-gray-400'}`}
                                                        >
                                                            <div className={`w-4 h-4 rounded-[4px] border ${formData.amenities.includes(amenity) ? 'bg-[#D48D2A] border-[#D48D2A]' : 'bg-white border-gray-300'} flex items-center justify-center shrink-0`}>
                                                                {formData.amenities.includes(amenity) && <FiCheck className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <div className={`flex items-center justify-center transition-colors ${formData.amenities.includes(amenity) ? 'text-[#D48D2A]' : 'text-[#D48D2A] opacity-80 group-hover:opacity-100'}`}>
                                                                {getAmenityIcon(amenity)}
                                                            </div>
                                                            <span className="text-left leading-tight whitespace-break-spaces text-black">{amenity}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Highlights Section - Fixed Fields */}
                            <section className="bg-[#FAFBFB] p-10 rounded-[2.5rem] border border-gray-200">
                                <div className="max-w-4xl mx-auto space-y-10">
                                    <div>
                                        <h4 className="text-xl font-bold text-black canela mb-2">Description</h4>
                                        <p className="text-sm text-gray-500 font-medium mb-6">Main asset description for the listing page</p>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-200 rounded-[1.5rem] p-8 text-sm text-black focus:outline-none focus:border-[#D48D2A] transition-all min-h-[200px] shadow-sm placeholder:text-gray-400 font-medium leading-relaxed"
                                            placeholder="Provide a detailed description of your asset..."
                                            required={false} 
                                        ></textarea>
                                        <div className="flex justify-between mt-3 px-2">
                                            <p className="text-[10px] text-gray-500 font-bold">Minimum 150 characters</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase">{formData.description.length}/2000</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div>
                                                <h4 className="text-lg font-bold text-black canela">Key Highlights</h4>
                                                <p className="text-xs text-gray-500 font-medium italic">These specific details will be highlighted on your listing</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {assetType === 'Car' && (
                                                <>
                                                    <InputField label="Top Speed (mph)" name="highlight_speed" value={formData.highlight_speed || ''} placeholder="e.g. 211" onChange={handleInputChange} required={false} />
                                                    <InputField label="Engine Type *" name="highlight_engine_type" value={formData.highlight_engine_type || ''} placeholder="e.g. V12 Quad Turbo" onChange={handleInputChange} required />
                                                    <InputField label="Horsepower (hp) *" name="highlight_hp" value={formData.highlight_hp || ''} placeholder="e.g. 789" onChange={handleInputChange} required />
                                                </>
                                            )}
                                            {assetType === 'Yacht' && (
                                                <>
                                                    <InputField label="Length (M) *" name="highlight_length" value={formData.highlight_length || ''} placeholder="e.g. 27" onChange={handleInputChange} required />
                                                    <InputField label="Bathrooms *" name="highlight_baths" value={formData.highlight_baths || ''} placeholder="e.g. 6" onChange={handleInputChange} required />
                                                    <InputField label="Fuel Capacity (L) *" name="highlight_fuel" value={formData.highlight_fuel || ''} placeholder="e.g. 9500" onChange={handleInputChange} required />
                                                    <InputField label="Engine (HP total) *" name="highlight_engine_hp" value={formData.highlight_engine_hp || ''} placeholder="e.g. 3800" onChange={handleInputChange} required />
                                                    <InputField label="Bedrooms *" name="highlight_beds" value={formData.highlight_beds || ''} placeholder="e.g. 7" onChange={handleInputChange} required />
                                                    <InputField label="Top Speed (knots) *" name="highlight_speed" value={formData.highlight_speed || ''} placeholder="e.g. 28" onChange={handleInputChange} required />
                                                </>
                                            )}
                                            {assetType === 'Estate' && (
                                                <>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:col-span-1">
                                                        <div className="sm:col-span-2">
                                                            <InputField label="Land Area *" name="highlight_area" value={formData.highlight_area || ''} placeholder="e.g. 0.5" onChange={handleInputChange} required />
                                                        </div>
                                                        <div>
                                                            <SelectField label="Unit" name="landAreaUnit" value={formData.landAreaUnit} options={['Sqft', 'Acres', 'hectres']} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>
                                                    <InputField label="Bathrooms *" name="highlight_baths" value={formData.highlight_baths || ''} placeholder="e.g. 6" onChange={handleInputChange} required />
                                                    <InputField label="Garage (Cars) *" name="highlight_garage" value={formData.highlight_garage || ''} placeholder="e.g. 3" onChange={handleInputChange} required />
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:col-span-1">
                                                        <div className="sm:col-span-2">
                                                            <InputField label="Built Area *" name="highlight_built_area" value={formData.highlight_built_area || ''} placeholder="e.g. 6500" onChange={handleInputChange} required />
                                                        </div>
                                                        <div>
                                                            <SelectField label="Unit" name="builtUpAreaUnit" value={formData.builtUpAreaUnit} options={['Sqft', 'Acres', 'hectres']} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>
                                                    <InputField label="Bedrooms *" name="highlight_beds" value={formData.highlight_beds || ''} placeholder="e.g. 5" onChange={handleInputChange} required />
                                                    <InputField label="Floors *" name="highlight_floors" value={formData.highlight_floors || ''} placeholder="e.g. 3" onChange={handleInputChange} required />
                                                </>
                                            )}
                                            {assetType === 'Bike' && (
                                                <>
                                                    <InputField label="Engine (cc) *" name="highlight_cc" value={formData.highlight_cc || ''} placeholder="e.g. 803" onChange={handleInputChange} required />
                                                    <InputField label="Top Speed (km/h) *" name="highlight_speed" value={formData.highlight_speed || ''} placeholder="e.g. 175" onChange={handleInputChange} required />
                                                    <InputField label="Fuel Capacity (L) *" name="highlight_fuel" value={formData.highlight_fuel || ''} placeholder="e.g. 13.5" onChange={handleInputChange} required />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Real Estate Specific Additions */}
                                    {assetType === 'Estate' && (
                                        <div className="space-y-12">
                                            <div className="pt-10 border-t border-gray-200">
                                                <div className="flex items-center gap-2 mb-8">
                                                    <FiInfo className="text-[#D48D2A] text-xl" />
                                                    <h4 className="text-lg font-bold text-black canela">Property Specifications</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    <InputField label="Year of Construction" name="year" type="number" value={formData.year} placeholder="e.g., 2020" onChange={handleInputChange} required />
                                                    <SelectField label="Architecture Style" name="architectureStyle" value={formData.architectureStyle} options={['Modern', 'Contemporary', 'Classical', 'Colonial', 'Mediterranean', 'Industrial']} onChange={handleInputChange} required />
                                                    <InputField label="Configuration" name="configuration" value={formData.configuration} placeholder="e.g., 5BR + Study + Media Room" onChange={handleInputChange} required />
                                                    <SelectField label="Condition" name="condition" value={formData.condition} options={['Brand New', 'Excellent', 'Renovated', 'Good', 'Premium Shell']} onChange={handleInputChange} required />
                                                    <SelectField label="Usage Status" name="usageStatus" value={formData.usageStatus} options={['Vacant', 'Owner Occupied', 'Tenanted', 'Short-term Rental']} onChange={handleInputChange} required />
                                                </div>
                                                <div className="mt-8">
                                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">View Type</label>
                                                    <div className="flex flex-wrap gap-3">
                                                        {['Sea', 'City', 'Marina', 'Mountain', 'Golf', 'Park', 'River'].map(view => (
                                                            <button
                                                                key={view}
                                                                type="button"
                                                                onClick={() => handleCheckboxToggle('viewTypes', view)}
                                                                className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${formData.viewTypes.includes(view) ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-gray-200 text-black hover:border-gray-900'}`}
                                                            >
                                                                {view}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-200">
                                                <div className="flex items-center gap-2 mb-8">
                                                    <FiCheckCircle className="text-[#D48D2A] text-xl" />
                                                    <h4 className="text-lg font-bold text-black canela">Materials & Finish</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} placeholder="e.g., Italian Marble, Hardwood" onChange={handleInputChange} required />
                                                    <InputField label="Interior Color Theme" name="interiorColorTheme" value={formData.interiorColorTheme} placeholder="e.g., Neutral Tones, White & Gold" onChange={handleInputChange} required />
                                                    <InputField label="Exterior Finish" name="exteriorFinish" value={formData.exteriorFinish} placeholder="e.g., Glass & Concrete" onChange={handleInputChange} required />
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-200">
                                                <div className="flex items-center gap-2 mb-8">
                                                    <FiVideo className="text-[#D48D2A] text-xl" />
                                                    <h4 className="text-lg font-bold text-black canela">Comfort & Tech</h4>
                                                </div>
                                                <div className="grid grid-cols-1 gap-8">
                                                    <InputField label="Climate Control" name="climateControl" value={formData.climateControl} placeholder="e.g., Central AC with Zoned Control" onChange={handleInputChange} required />
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Smart Home Systems</label>
                                                        <div className="flex flex-wrap gap-3">
                                                            {['Lighting Control', 'Climate Control', 'Security System', 'Entertainment', 'Voice Assistant', 'Automated Blinds'].map(system => (
                                                                <button
                                                                    key={system}
                                                                    type="button"
                                                                    onClick={() => handleCheckboxToggle('smartHomeSystems', system)}
                                                                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${formData.smartHomeSystems.includes(system) ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-gray-200 text-black hover:border-gray-900'}`}
                                                                >
                                                                    {system}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Price History Timeline Section */}
                            <section className="bg-[#FAFBFB] p-10 rounded-[2.5rem] border border-gray-200">
                                <div className="max-w-5xl mx-auto">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-black">Price History Timeline</h3>
                                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Add previous market prices to generate historical value graphs for buyers.</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                                        <div className="flex flex-col lg:flex-row min-h-[400px]">
                                            {/* Left Column: Data Entry */}
                                            <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                                                <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-8">
                                                    {['5 Years', '10 Years', '15 Years'].map(range => (
                                                        <button
                                                            key={range}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, priceHistoryRange: range }))}
                                                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${formData.priceHistoryRange === range ? 'bg-white text-[#D48D2A] shadow-sm' : 'text-gray-600 hover:text-black'}`}
                                                        >
                                                            {range}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">
                                                        <span>Year</span>
                                                        <div className="flex items-center gap-1">
                                                            <span>Estimated Market Price</span>
                                                            <FiInfo className="text-gray-400" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {formData.priceHistory.slice(0, parseInt(formData.priceHistoryRange)).map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-3">
                                                                <div className="relative w-28 shrink-0">
                                                                    <select 
                                                                        value={item.year}
                                                                        onChange={(e) => {
                                                                            const newHistory = [...formData.priceHistory];
                                                                            newHistory[idx].year = parseInt(e.target.value);
                                                                            setFormData(prev => ({ ...prev, priceHistory: newHistory }));
                                                                        }}
                                                                        className="w-full pl-4 pr-8 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold text-black appearance-none focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all"
                                                                    >
                                                                        {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                                            <option key={year} value={year} className="text-black bg-white">{year}</option>
                                                                        ))}
                                                                    </select>
                                                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                                </div>
                                                                
                                                                <div className="flex-1 flex items-center gap-3">
                                                                    <div className="relative w-28 shrink-0">
                                                                        <select 
                                                                            value={item.currency}
                                                                            onChange={(e) => {
                                                                                const newHistory = [...formData.priceHistory];
                                                                                newHistory[idx].currency = e.target.value;
                                                                                setFormData(prev => ({ ...prev, priceHistory: newHistory }));
                                                                            }}
                                                                            className="w-full pl-4 pr-8 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-bold text-black appearance-none focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all"
                                                                        >
                                                                            <option className="text-black bg-white">USD $</option>
                                                                            <option className="text-black bg-white">EUR €</option>
                                                                            <option className="text-black bg-white">GBP £</option>
                                                                            <option className="text-black bg-white">AED د.إ</option>
                                                                        </select>
                                                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                                    </div>
                                                                    <input 
                                                                        type="number"
                                                                        value={item.price}
                                                                        placeholder="Enter price"
                                                                        onChange={(e) => {
                                                                            const newHistory = [...formData.priceHistory];
                                                                            newHistory[idx].price = e.target.value;
                                                                            setFormData(prev => ({ ...prev, priceHistory: newHistory }));
                                                                        }}
                                                                        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-black focus:outline-none focus:border-[#D48D2A] transition-all placeholder:text-gray-400 shadow-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Settings */}
                                            <div className="w-full lg:w-[320px] p-8 bg-gray-50/30 space-y-8 flex flex-col justify-center">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1">
                                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Graph Type</label>
                                                            <FiInfo className="text-gray-400 text-[10px]" />
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 16V12"/><path d="M11 16V8"/><path d="M15 16V10"/><path d="M19 16V14"/></svg>
                                                            </div>
                                                            <select 
                                                                value={formData.priceHistoryOptions.graphType}
                                                                onChange={(e) => setFormData(prev => ({ ...prev, priceHistoryOptions: { ...prev.priceHistoryOptions, graphType: e.target.value } }))}
                                                                className="w-full pl-10 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-[#D48D2A] appearance-none shadow-sm"
                                                            >
                                                                <option className="text-black bg-white">Bar Graph</option>
                                                                <option className="text-black bg-white">Line Graph</option>
                                                                <option className="text-black bg-white">Area Graph</option>
                                                            </select>
                                                            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Currency</label>
                                                        <div className="relative">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold">$</div>
                                                            </div>
                                                            <select 
                                                                value={formData.priceHistoryOptions.currency}
                                                                onChange={(e) => setFormData(prev => ({ ...prev, priceHistoryOptions: { ...prev.priceHistoryOptions, currency: e.target.value } }))}
                                                                className="w-full pl-10 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-black focus:outline-none focus:border-[#D48D2A] appearance-none shadow-sm"
                                                            >
                                                                <option className="text-black bg-white">USD $</option>
                                                                <option className="text-black bg-white">EUR €</option>
                                                                <option className="text-black bg-white">GBP £</option>
                                                                <option className="text-black bg-white">AED د.إ</option>
                                                            </select>
                                                            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    type="button"
                                                    onClick={() => setShowGraphPopup(true)}
                                                    className="w-full py-4 bg-[#D48D2A] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#b87a24] transition-all shadow-lg shadow-[#D48D2A]/20 flex items-center justify-center gap-3 mt-4"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                                    Generate Market Graph
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-[#F2F8FF] border-t border-gray-200 flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#3B82F6] shrink-0 border border-blue-100 shadow-sm">
                                                <FiInfo className="text-xs" />
                                            </div>
                                            <p className="text-[10px] text-[#4A5568] font-medium leading-relaxed">
                                                These values help buyers understand appreciation trends and collector value over time. High accuracy improves listing visibility.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Media Section */}
                            <div className="pt-10 border-t border-gray-200 space-y-10">
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2 canela">Media & Images</h3>
                                    <p className="text-xs text-gray-500 font-medium">Manage existing photos or add new ones. Removed photos will be cleaned up from storage automatically.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Cover Image */}
                                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#D48D2A]">
                                                <FiImage />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-black">Cover Image *</h4>
                                                <p className="text-xs text-gray-500">Primary display image for this listing</p>
                                            </div>
                                        </div>

                                        <label className="block">
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                                            <div className={`border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all text-center ${coverImage ? 'border-[#D48D2A] bg-white' : 'border-gray-300 bg-white hover:border-[#D48D2A]'}`}>
                                                {coverImage ? (
                                                    <div className="relative group">
                                                        <img 
                                                            src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)} 
                                                            alt="Cover"
                                                            className="w-full h-44 object-cover rounded-xl shadow-sm" 
                                                        />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                            <p className="text-white text-xs font-bold uppercase tracking-widest">Click to Change Cover</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
                                                        <FiUploadCloud className="text-3xl text-gray-400" />
                                                        <p className="text-xs font-bold uppercase tracking-widest text-black">Select Cover Photo</p>
                                                        <p className="text-[10px] text-gray-400">JPG, PNG, WEBP up to 5MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>

                                        {coverImage && (
                                            <div className="mt-4 flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                    <FiCheck />
                                                </div>
                                                <p className="text-xs font-bold text-black truncate flex-1">
                                                    {typeof coverImage === 'string' ? 'Current Cover Image' : (coverImage.name || 'New Cover Image')}
                                                </p>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveFile(null, 'cover')} 
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                    title="Remove Cover Image"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Gallery Images */}
                                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#D48D2A]">
                                                <FiPlus />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-black">Gallery Photos ({galleryImages.length})</h4>
                                                <p className="text-xs text-gray-500">Additional interior, exterior and detail shots (Max 49)</p>
                                            </div>
                                        </div>

                                        <label className="block">
                                            <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} />
                                            <div className="border-2 border-dashed border-gray-300 bg-white rounded-2xl p-6 cursor-pointer transition-all hover:border-[#D48D2A] text-center">
                                                <div className="flex flex-col items-center gap-2 py-4 text-gray-500">
                                                    <FiUploadCloud className="text-3xl text-gray-400" />
                                                    <p className="text-xs font-bold uppercase tracking-widest text-black">+ Add Gallery Photos</p>
                                                    <p className="text-[10px] text-gray-400">Select one or multiple photos</p>
                                                </div>
                                            </div>
                                        </label>

                                        {galleryImages.length > 0 && (
                                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                                                {galleryImages.map((file, idx) => (
                                                    <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                                                        <img 
                                                            src={typeof file === 'string' ? file : URL.createObjectURL(file)} 
                                                            alt={`Gallery ${idx + 1}`} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleRemoveFile(idx, 'gallery')}
                                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all shadow-md"
                                                                title="Delete photo"
                                                            >
                                                                <FiTrash2 className="text-sm" />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            #{idx + 1}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <InputField label="Video URL (YouTube/Vimeo)" name="videoUrl" value={formData.videoUrl} placeholder="https://youtube.com/watch?v=..." onChange={handleInputChange} />
                                </div>
                            </div>

                            {/* Footer / Visibility */}
                            <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                                        className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${formData.isPublic ? 'bg-[#D48D2A]' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${formData.isPublic ? 'left-8' : 'left-1'}`}></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-black">Public Visibility</p>
                                        <p className="text-[11px] text-gray-500 font-medium">Make this listing visible on the public marketplace</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <button onClick={handleCloseAttempt} className="px-8 py-4 bg-gray-100 text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all flex-1 md:flex-none">Cancel</button>
                                    <button
                                        disabled={loading}
                                        onClick={handleSubmit}
                                        className="px-10 py-4 bg-[#D48D2A] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#B5751C] shadow-lg shadow-[#D48D2A]/30 transition-all flex-1 md:flex-none disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editData ? 'Update Asset' : 'Save Asset')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Graph Popup Modal */}
            <MarketGraphPopup 
                isOpen={showGraphPopup} 
                onClose={() => setShowGraphPopup(false)} 
                data={formData.priceHistory} 
                options={formData.priceHistoryOptions}
                assetName={formData.propertyName || formData.make || formData.brand || formData.yachtName || 'Asset'}
            />

            {/* Draft Confirmation Modal */}
            {showDraftConfirm && (
                <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 text-2xl">
                            <FiInfo />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">Save as Draft?</h3>
                        <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
                            You have unsaved changes. Would you like to save this asset as a draft so you can finish it later?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={saveAsDraft}
                                disabled={loading}
                                className="w-full py-4 bg-black text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving Draft...' : 'Yes, Save as Draft'}
                            </button>
                            <button 
                                onClick={onClose}
                                className="w-full py-4 bg-gray-50 text-red-500 font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-red-50 transition-all border border-gray-200"
                            >
                                Discard Changes
                            </button>
                            <button 
                                onClick={() => setShowDraftConfirm(false)}
                                className="w-full py-4 bg-white text-gray-500 font-bold uppercase text-xs tracking-widest rounded-xl hover:text-black transition-all"
                            >
                                Keep Editing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
                
                .asset-modal input,
                .asset-modal select,
                .asset-modal textarea,
                .asset-modal option {
                    color: #000000 !important;
                    -webkit-text-fill-color: #000000 !important;
                }
                .asset-modal select option {
                    color: #000000 !important;
                    background-color: #FFFFFF !important;
                }
                .asset-modal input::placeholder,
                .asset-modal textarea::placeholder {
                    color: #9CA3AF !important;
                    -webkit-text-fill-color: #9CA3AF !important;
                    opacity: 1 !important;
                }
            `}} />
        </div>
    );
};

const InputField = ({ label, name, value, type = "text", placeholder, onChange, required = false, options, suggestionDisabled = false, suggestionPlaceholder }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</label>
        {options !== undefined ? (
            <FilterStyleAutocomplete
                name={name}
                value={value}
                options={options}
                placeholder={placeholder}
                searchPlaceholder={suggestionPlaceholder}
                onChange={onChange}
                required={required}
                disabled={suggestionDisabled}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value !== null && value !== undefined ? value : ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-gray-50/50 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-medium text-black transition-all placeholder:text-gray-400 focus:border-[#D48D2A] focus:bg-white focus:outline-none"
            />
        )}
    </div>
);

const FilterStyleAutocomplete = ({ name, value = '', options = [], placeholder, searchPlaceholder, onChange, required, disabled }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef(null);
    const menuRef = React.useRef(null);
    const [menuPosition, setMenuPosition] = React.useState(null);
    const formatOptionLabel = (option) => String(option).split(/([\s/-]+)/).map((part) => {
        if (!part || /^[\s/-]+$/.test(part)) return part;
        return part.split('-').map((word) => {
            if (/^(?:[A-Z]{2,3}|[IVX]{2,5}|\d+[A-Z])$/.test(word)) return word;
            return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
        }).join('-');
    }).join('');
    const filteredOptions = [...new Set(options)]
        .filter((option) => option.toLowerCase().includes(String(value || '').trim().toLowerCase()))
        .slice(0, 100);

    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!wrapperRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    React.useEffect(() => {
        if (!isOpen || disabled) return undefined;
        const updatePosition = () => {
            const bounds = wrapperRef.current?.getBoundingClientRect();
            if (!bounds) return;
            const roomBelow = window.innerHeight - bounds.bottom - 16;
            const roomAbove = bounds.top - 16;
            const placeAbove = roomBelow < 220 && roomAbove > roomBelow;
            const availableHeight = Math.max(100, Math.min(260, placeAbove ? roomAbove : roomBelow));
            setMenuPosition({
                left: bounds.left,
                width: bounds.width,
                ...(placeAbove
                    ? { bottom: window.innerHeight - bounds.top + 8, top: 'auto' }
                    : { top: bounds.bottom + 8, bottom: 'auto' }),
                maxHeight: availableHeight,
            });
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, disabled]);

    const selectOption = (option) => {
        onChange({ target: { name, value: option, type: 'text' } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <div className={`flex w-full items-center overflow-hidden rounded-xl border bg-gray-50/50 transition-all ${isOpen ? 'border-[#D48D2A] bg-white ring-2 ring-[#D48D2A]/10' : 'border-gray-200'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
                <input
                    type="text"
                    name={name}
                    value={value ?? ''}
                    onChange={onChange}
                    onFocus={() => !disabled && setIsOpen(true)}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') setIsOpen(false);
                        if (event.key === 'ArrowDown' && !disabled) { event.preventDefault(); setIsOpen(true); }
                        if (event.key === 'Enter' && isOpen && filteredOptions.length) { event.preventDefault(); selectOption(filteredOptions[0]); }
                    }}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    className="min-w-0 flex-1 border-0 bg-transparent px-5 py-3.5 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-0"
                />
                <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Show ${name} options`}
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((open) => !open)}
                    className="flex h-full min-h-[48px] w-12 shrink-0 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {isOpen && !disabled && menuPosition && createPortal(
                <div ref={menuRef} style={{ position: 'fixed', maxHeight: menuPosition.maxHeight, ...menuPosition, zIndex: 10000 }} className="min-w-[220px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                    <div className="border-b border-gray-100 px-4 py-3 text-xs font-medium text-gray-400">{searchPlaceholder}</div>
                    <div style={{ maxHeight: Math.max(60, menuPosition.maxHeight - 44) }} className="overflow-y-auto p-1.5" role="listbox" aria-label={`${name} options`}>
                        {filteredOptions.length ? filteredOptions.map((option) => (
                            <button
                                type="button"
                                role="option"
                                aria-selected={value === option}
                                key={option}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectOption(option)}
                                className={`block w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${value === option ? 'bg-[#fdf8f0] font-semibold text-[#9C824A]' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {formatOptionLabel(option)}
                            </button>
                        )) : (
                            <div className="px-3.5 py-3 text-sm text-gray-400">No matching options. You can keep your custom value.</div>
                        )}
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
};

const CAR_TAG_OPTIONS = ['Exclusive', 'Rare', 'Limited Edition', 'Track Spec', 'Trending', 'Featured'];

const SelectField = ({ label, name, value, options, onChange, required = false }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</label>
        <div className="relative">
            <select
                name={name}
                value={value !== null && value !== undefined ? value : ''}
                onChange={onChange}
                required={required}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all appearance-none cursor-pointer pr-10"
            >
                <option value="" className="text-black bg-white">Select {label.toLowerCase()}</option>
                {options.map(opt => (
                    <option key={opt} value={opt} className="text-black bg-white font-medium">{opt}</option>
                ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <FiChevronDown />
            </div>
        </div>
    </div>
);

const LocationInputField = ({ label, name, value, placeholder, onChange, required = false }) => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const locationRef = React.useRef(null);

    React.useEffect(() => {
        const handler = setTimeout(async () => {
            if (value && value.length > 0) {
                try {
                    const response = await fetch(`/api/assets/location-suggestions?q=${encodeURIComponent(value)}`);
                    const data = await response.json();
                    setSuggestions(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.error("Failed to fetch location suggestions", error);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [value]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={locationRef}>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</label>
            <input
                type="text"
                name={name}
                value={value !== null && value !== undefined ? value : ''}
                onChange={(e) => {
                    onChange(e);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                required={required}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-medium text-black focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all placeholder:text-gray-400"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-[110] w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-2xl left-0 p-2 overflow-hidden max-h-64 overflow-y-auto">
                    {suggestions.map((s, idx) => {
                        const labelText = typeof s === 'string' ? s : s.value;
                        return (
                            <li
                                key={idx}
                                className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer text-black text-sm font-medium transition-colors"
                                onClick={() => {
                                    onChange({ target: { name, value: labelText, type: 'text' } });
                                    setShowSuggestions(false);
                                }}
                            >
                                {labelText}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

const MarketGraphPopup = ({ isOpen, onClose, data, options, assetName }) => {
    if (!isOpen) return null;

    const chartData = data
        .filter(item => item.price && item.year)
        .map(item => ({
            year: item.year.toString(),
            price: parseFloat(item.price),
            formattedPrice: new Intl.NumberFormat('en-US').format(item.price)
        }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <FiBarChart2 className="text-4xl mb-4 opacity-20" />
                    <p className="text-sm font-medium text-gray-500">Add some prices to generate a graph</p>
                </div>
            );
        }

        const chartProps = {
            data: chartData,
            margin: { top: 20, right: 30, left: 20, bottom: 20 }
        };

        const commonAxis = (
            <>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#6B7280' }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#6B7280' }}
                    tickFormatter={(val) => `${options.currency.split(' ')[1] || '$'}${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: '700', color: '#D48D2A' }}
                    labelStyle={{ fontSize: '10px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}
                    formatter={(value) => [`${options.currency.split(' ')[0]} ${new Intl.NumberFormat().format(value)}`, 'Market Value']}
                />
            </>
        );

        if (options.graphType === 'Line Graph') {
            return (
                <LineChart {...chartProps}>
                    {commonAxis}
                    <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#D48D2A" 
                        strokeWidth={3} 
                        dot={{ r: 6, fill: '#D48D2A', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                </LineChart>
            );
        }

        if (options.graphType === 'Area Graph') {
            return (
                <AreaChart {...chartProps}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D48D2A" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#D48D2A" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    {commonAxis}
                    <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#D48D2A" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                    />
                </AreaChart>
            );
        }

        return (
            <BarChart {...chartProps}>
                {commonAxis}
                <Bar 
                    dataKey="price" 
                    fill="#D48D2A" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                />
            </BarChart>
        );
    };

    return (
        <div className="fixed inset-0 z-[120] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                            <FiBarChart2 className="text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-black canela">Market Value Analysis</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{assetName} Price Trend</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <div className="p-10">
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {renderChart()}
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-10 grid grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Peak Value</p>
                            <p className="text-lg font-bold text-black">
                                {chartData.length > 0 
                                    ? `${options.currency.split(' ')[0]} ${new Intl.NumberFormat().format(Math.max(...chartData.map(d => d.price)))}`
                                    : '—'}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Analysis Period</p>
                            <p className="text-lg font-bold text-black">{chartData.length} Years</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Currency</p>
                            <p className="text-lg font-bold text-black">{options.currency}</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                    >
                        Close Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAssetModal;
