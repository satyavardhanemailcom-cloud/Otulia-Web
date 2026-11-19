import React, { useState, useEffect, useRef } from 'react';
import { FiImage, FiPlus, FiGrid, FiTrash2, FiInfo, FiChevronRight, FiSearch, FiCheck, FiChevronLeft, FiAward } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import ImageCropModal from '../ImageCropModal';

import carIcon from '../../assets/icons/car_icon.png';
import estateIcon from '../../assets/icons/estate_icon.png';
import yachtIcon from '../../assets/icons/yacht_icon.png';
import bikeIcon from '../../assets/icons/bike_icon.png';
import contentCreatorIcon from '../../assets/icons/content_creater_icon.png';
import otherIcon from '../../assets/icons/other_asset_icon.png';

const types = [
    { id: 'Cars', label: 'Cars', icon: carIcon },
    { id: 'Real Estate', label: 'Real Estate', icon: estateIcon },
    { id: 'Yachts', label: 'Yachts', icon: yachtIcon },
    { id: 'Bikes', label: 'Bikes', icon: bikeIcon },
    { id: 'Content Creator', label: 'Content Creator', icon: contentCreatorIcon },
    { id: 'Other', label: 'Other', icon: otherIcon }
];

// Mock database of searchable nominees
const mockAssetNominees = [
    { id: 'a1', name: 'Bugatti Tourbillon', detail: 'Hypercar · $4.6M', image: 'https://images.unsplash.com/photo-1600706432502-75a0e2b8b915?w=150&auto=format&fit=crop&q=60' },
    { id: 'a2', name: 'Koenigsegg Jesko Absolut', detail: 'Hypercar · $3.4M', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=150&auto=format&fit=crop&q=60' },
    { id: 'a3', name: 'Pagani Utopia Roadster', detail: 'Hypercar · $2.8M', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=150&auto=format&fit=crop&q=60' },
    { id: 'a4', name: 'Ferrari SF90 XX Stradale', detail: 'Supercar · $890K', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=150&auto=format&fit=crop&q=60' },
    { id: 'a5', name: 'Rolls-Royce Spectre', detail: 'Luxury Coupe · $420K', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=150&auto=format&fit=crop&q=60' },
    { id: 'a6', name: 'Beverly Hills Modern Mansion', detail: 'Estate · $28M', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=60' },
    { id: 'a7', name: 'Tuscan Hillside Villa', detail: 'Villa · $8.5M', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=150&auto=format&fit=crop&q=60' },
    { id: 'a8', name: 'Monaco Waterfront Penthouse', detail: 'Apartment · $19M', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=150&auto=format&fit=crop&q=60' },
    { id: 'a9', name: 'Benetti Oasis 40M Yacht', detail: 'Superyacht · $22M', image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=150&auto=format&fit=crop&q=60' },
    { id: 'a10', name: 'Lürssen Flying Fox 136M', detail: 'Gigayacht · Charter Only', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=150&auto=format&fit=crop&q=60' }
];

const mockDealerNominees = [
    { id: 'd1', name: 'Prestige Motors Dealership', detail: 'Miami, FL · Platinum Dealer', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=150&auto=format&fit=crop&q=60' },
    { id: 'd2', name: 'Elite Yachts Group', detail: 'Monaco Brokerage · 48 Active Listings', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&auto=format&fit=crop&q=60' },
    { id: 'd3', name: 'Sotheby’s International Realty', detail: 'London, UK · Global Agency', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=60' },
    { id: 'd4', name: 'Beverly Hills Luxury Estates', detail: 'Los Angeles, CA · High-Volume Realty', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=150&auto=format&fit=crop&q=60' },
    { id: 'd5', name: 'Ultimate Motors Dubai', detail: 'Dubai, UAE · Exotic Car Retailer', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop&q=60' }
];

const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const getFutureDateString = (days) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const RankingCategoryForm = ({ initialData, onSubmit, onCancel }) => {
    const { token } = useAuth();
    const [step, setStep] = useState(1);
    const coverInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const [croppedCoverBlob, setCroppedCoverBlob] = useState(null);
    const [croppedBannerBlob, setCroppedBannerBlob] = useState(null);
    
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState('');
    const [cropTarget, setCropTarget] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        type: 'Cars',
        targetType: 'Assets', // 'Assets' or 'Dealers'
        shortDescription: '',
        detailedDescription: '',
        categoryImage: '',
        bannerImage: '',
        icon: carIcon,
        votingPeriodStart: getTodayDateString(),
        votingPeriodEnd: getFutureDateString(30),
        nomineeLimit: 10,
        allowMultipleVotes: true,
        showInPopularLinks: true,
        displayOrder: 1,
        featuredCategory: true,
        categoryColor: '#6366F1',
        status: 'Active',
        nominees: [],
        seoTitle: '',
        seoKeywords: ''
    });

    // Nominees management state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResultsDropdown, setShowResultsDropdown] = useState(false);

    const [editingNomineeIndex, setEditingNomineeIndex] = useState(null);
    const [editNomineeData, setEditNomineeData] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                votingPeriodStart: initialData.votingPeriodStart || getTodayDateString(),
                votingPeriodEnd: initialData.votingPeriodEnd || getFutureDateString(30),
                targetType: initialData.targetType || 'Assets',
                nominees: initialData.nominees || [],
                seoTitle: initialData.seoTitle || '',
                seoKeywords: initialData.seoKeywords || '',
                status: initialData.status || 'Active'
            });
        }
    }, [initialData]);

    // Update slug smart details on title change
    const handleTitleChange = (e) => {
        const val = e.target.value;
        const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        setFormData(prev => ({
            ...prev,
            title: val,
            slug: generatedSlug,
            targetType: 'Assets'
        }));
    };

    // Filter nominees based on targetType and search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const isEstate = formData.type === 'Real Estate';
                if (formData.targetType === 'Assets') {
                    // Map selected type to category query parameter
                    const categoryMap = {
                        'Cars': 'cars|vehicles',
                        'Real Estate': 'estates',
                        'Yachts': 'yachts',
                        'Bikes': 'bikes'
                    };
                    const queryCategory = categoryMap[formData.type] || '';
                    
                    const url = `/api/assets/combined?q=${encodeURIComponent(searchQuery)}&category=${queryCategory}&limit=10`;
                    const response = await fetch(url);
                    if (response.ok) {
                        const resData = await response.json();
                        if (resData && Array.isArray(resData.data)) {
                            const formatted = resData.data.map(asset => {
                                const detailParts = [];
                                if (asset.brand) detailParts.push(asset.brand);
                                if (asset.specification?.model) detailParts.push(asset.specification.model);
                                if (asset.location) detailParts.push(asset.location);
                                
                                const priceStr = asset.isPriceOnRequest 
                                    ? 'Price on Request' 
                                    : (asset.price ? `$${Number(asset.price).toLocaleString()}` : '');
                                if (priceStr) detailParts.push(priceStr);

                                return {
                                    id: asset._id || asset.id,
                                    name: asset.title || 'Unnamed Asset',
                                    detail: detailParts.join(' · '),
                                    image: asset.images && asset.images[0] ? asset.images[0] : '',
                                    votes: 0,
                                    brand: asset.brand || '',
                                    model: asset.specification?.model || asset.variant || '',
                                    description: asset.description || '',
                                    listingLink: `/assets/${asset._id || asset.id}`,
                                    keyDetails: isEstate ? {
                                         ownership: asset.specification?.ownership || '',
                                         zoning: asset.specification?.zoning || '',
                                         availabilityStatus: asset.specification?.availabilityStatus || asset.availability || '',
                                         listingId: asset.specification?.listingId || asset.referenceId || '',
                                         livingArea: asset.keySpecifications?.builtUpArea || asset.specification?.builtUpArea || '',
                                         landSize: asset.keySpecifications?.landArea || asset.specification?.landArea || '',
                                         bedroom: asset.keySpecifications?.bedrooms?.toString() || asset.specification?.bedrooms?.toString() || '',
                                         bathroom: asset.keySpecifications?.bathrooms?.toString() || asset.specification?.bathrooms?.toString() || '',
                                         propertyType: asset.keySpecifications?.propertyType || asset.specification?.propertyType || '',
                                         yearBuilt: asset.specification?.yearOfConstruction?.toString() || '',
                                         architect: asset.specification?.architectureStyle || '',
                                         interiorDesign: asset.specification?.interiorMaterial || '',
                                         garageCapacity: asset.keySpecifications?.garageCapacity?.toString() || asset.specification?.garageCapacity?.toString() || '',
                                         floors: asset.keySpecifications?.floors?.toString() || asset.specification?.floors?.toString() || '',
                                         prestigeScore: asset.keySpecifications?.prestigeScore || '',
                                         architectureScore: asset.keySpecifications?.architectureScore || '',
                                         locationScore: asset.keySpecifications?.locationScore || '',
                                         amenitiesScore: asset.keySpecifications?.amenitiesScore || '',
                                         investmentScore: asset.keySpecifications?.investmentScore || '',
                                         exclusivityScore: asset.keySpecifications?.exclusivityScore || '',
                                         annualAppreciation: asset.keySpecifications?.annualAppreciation || ''
                                     } : {
                                         price: priceStr || '',
                                         year: asset.specification?.yearOfConstruction || '',
                                         engine: asset.specification?.engineType || asset.keySpecifications?.engineType || '',
                                         power: asset.specification?.power || asset.keySpecifications?.power || '',
                                         topSpeed: asset.specification?.topSpeed || asset.keySpecifications?.topSpeed || '',
                                         model: asset.specification?.model || '',
                                         drivetrain: asset.specification?.drive || '',
                                         transmission: asset.specification?.transmission || '',
                                         productionUnits: '',
                                         country: asset.location?.country || asset.location || '',
                                         fuelType: asset.specification?.fuel || ''
                                     },
                                    sources: [
                                        { title: 'Listing Link', url: `https://otulia.com/assets/${asset._id || asset.id}` }
                                    ]
                                };
                            });
                            setSearchResults(formatted);
                        }
                    }
                } else {
                    // targetType === 'Dealers'
                    const response = await fetch('/api/admin/partners', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const partners = await response.json();
                        
                        const categoryMap = {
                            'Cars': 'Car',
                            'Real Estate': 'Estate',
                            'Yachts': 'Yacht',
                            'Bikes': 'Bike'
                        };
                        const selectedCat = categoryMap[formData.type];
                        
                        const filtered = partners.filter(p => {
                            const matchesSearch = 
                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                (p.company?.companyName && p.company.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                p.email.toLowerCase().includes(searchQuery.toLowerCase());
                                
                            const matchesCategory = !selectedCat || p.category === selectedCat || p.category === 'General';
                            
                            return matchesSearch && matchesCategory;
                        });

                        const formatted = filtered.map(p => ({
                            id: p.id,
                            name: p.company?.companyName || p.name,
                            detail: `${p.plan || 'Dealer'} · ${p.email} · ${p.level || 'Silver'} Level`,
                            image: p.company?.companyLogo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                            votes: 0,
                            brand: p.company?.companyName || '',
                            model: p.level || '',
                            description: p.company?.companyDescription || '',
                            listingLink: p.company?.website || '',
                            keyDetails: {
                                price: '',
                                year: p.joined ? new Date(p.joined).getFullYear().toString() : '',
                                engine: '',
                                power: '',
                                topSpeed: '',
                                model: '',
                                drivetrain: '',
                                transmission: '',
                                productionUnits: '',
                                country: '',
                                fuelType: ''
                            },
                            sources: [
                                { title: 'Website', url: p.company?.website || '' }
                            ]
                        }));
                        
                        setSearchResults(formatted);
                    }
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, formData.targetType, formData.type, token]);

    const addNominee = (nominee) => {
        if (formData.nominees.some(n => n.id === nominee.id || n._id === nominee.id)) {
            alert("This nominee is already added to this category.");
            return;
        }
        if (formData.nominees.length >= formData.nomineeLimit) {
            alert(`You have reached the limit of ${formData.nomineeLimit} nominees.`);
            return;
        }
        setFormData(prev => ({
            ...prev,
            nominees: [...prev.nominees, { ...nominee, votes: 0 }]
        }));
        setSearchQuery('');
        setShowResultsDropdown(false);
    };

    const removeNominee = (id) => {
        setFormData(prev => ({
            ...prev,
            nominees: prev.nominees.filter(n => n.id !== id && n._id !== id)
        }));
    };

    const uploadToCloudinary = async (blob, target, title, oldUrl) => {
        const uploadData = new FormData();
        uploadData.append('image', blob, `${target}_${Date.now()}.png`);
        
        let endpoint = target === 'cover' 
            ? `/api/upload/category-cover?title=${encodeURIComponent(title)}` 
            : `/api/upload/category-banner?title=${encodeURIComponent(title)}`;
            
        if (oldUrl) {
            endpoint += `&oldUrl=${encodeURIComponent(oldUrl)}`;
        }
            
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: uploadData
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.url) {
                return data.url;
            }
        }
        throw new Error(`Cloudinary upload failed for ${target}`);
    };

    const handleFormSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        
        let finalCoverUrl = formData.categoryImage;
        let finalBannerUrl = formData.bannerImage;
        
        try {
            // Upload cover if we have a cropped blob temporarily saved
            if (croppedCoverBlob) {
                finalCoverUrl = await uploadToCloudinary(croppedCoverBlob, 'cover', formData.title, initialData?.categoryImage);
            }
            
            // Upload banner if we have a cropped blob temporarily saved
            if (croppedBannerBlob) {
                finalBannerUrl = await uploadToCloudinary(croppedBannerBlob, 'banner', formData.title, initialData?.bannerImage);
            }
            
            await onSubmit({
                ...formData,
                categoryImage: finalCoverUrl,
                bannerImage: finalBannerUrl
            });
            
            // Reset form if creating new
            if (!initialData) {
                setFormData({
                    title: '',
                    slug: '',
                    type: 'Cars',
                    targetType: 'Assets',
                    shortDescription: '',
                    detailedDescription: '',
                    categoryImage: '',
                    bannerImage: '',
                    icon: carIcon,
                    votingPeriodStart: getTodayDateString(),
                    votingPeriodEnd: getFutureDateString(30),
                    nomineeLimit: 10,
                    allowMultipleVotes: true,
                    showInPopularLinks: true,
                    displayOrder: 1,
                    featuredCategory: true,
                    categoryColor: '#6366F1',
                    status: 'Active',
                    nominees: [],
                    seoTitle: '',
                    seoKeywords: ''
                });
                setCroppedCoverBlob(null);
                setCroppedBannerBlob(null);
                setStep(1);
            }
        } catch (err) {
            console.error("Error submitting category:", err);
            alert("Error saving category images. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileSelect = (e, target) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setCropImageSrc(reader.result);
            setCropTarget(target);
            setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
        
        // Reset file input value so same file can be selected again
        e.target.value = '';
    };

    const handleStepClick = (targetStep) => {
        if (targetStep < step) {
            setStep(targetStep);
            return;
        }

        // Validate Step 1
        if (step === 1) {
            if (!formData.title.trim()) {
                alert("Category title is required.");
                return;
            }
            if (!formData.slug.trim()) {
                alert("Slug is required.");
                return;
            }
            if (!formData.shortDescription.trim()) {
                alert("Short description is required.");
                return;
            }
            if (!formData.categoryImage) {
                alert("Category cover image is required.");
                return;
            }
            if (!formData.bannerImage) {
                alert("Banner image is required.");
                return;
            }
        }

        if (targetStep <= 2) {
            setStep(targetStep);
        }
    };

    const handleNextStep = () => {
        // Validate Step 1 fields
        if (step === 1) {
            if (!formData.title.trim()) {
                alert("Category title is required.");
                return;
            }
            if (!formData.slug.trim()) {
                alert("Slug is required.");
                return;
            }
            if (!formData.shortDescription.trim()) {
                alert("Short description is required.");
                return;
            }
            if (!formData.categoryImage) {
                alert("Category cover image is required.");
                return;
            }
            if (!formData.bannerImage) {
                alert("Banner image is required.");
                return;
            }
        }

        // Validate Step 2 fields
        if (step === 2) {
            if (formData.nominees.length === 0) {
                alert("Please add at least one nominee before proceeding.");
                return;
            }
        }

        if (step < 2) setStep(step + 1);
        else handleFormSubmit();
    };

    const renderKeyDetailsFields = () => {
        const type = formData.type || 'Cars';

        if (type === 'Cars') {
            return (
                <div>
                    <h4 className="text-base font-bold text-white mb-4">Key Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Price', key: 'price', placeholder: '$ 5.2M' },
                            { label: 'Year', key: 'year', placeholder: '2026' },
                            { label: 'Engine', key: 'engine', placeholder: 'W16 8.3 L' },
                            { label: 'Power', key: 'power', placeholder: '18000 HP' },
                            { label: 'Top Speed', key: 'topSpeed', placeholder: '440 Km/h' },
                            { label: 'Model', key: 'model', placeholder: 'Chiron Super Sport' },
                            { label: 'Drivetrain', key: 'drivetrain', placeholder: 'AWD' },
                            { label: 'Transmission', key: 'transmission', placeholder: '8-Speed Dual Clutch' },
                            { label: 'Production Units', key: 'productionUnits', placeholder: '250 Units' },
                            { label: 'Country', key: 'country', placeholder: 'Italy' },
                            { label: 'Fuel Type', key: 'fuelType', placeholder: 'E85 Petrol' }
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{field.label}</label>
                                <input 
                                    type="text"
                                    value={editNomineeData.keyDetails?.[field.key] || ''}
                                    onChange={(e) => setEditNomineeData({
                                        ...editNomineeData,
                                        keyDetails: { ...editNomineeData.keyDetails, [field.key]: e.target.value }
                                    })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (type === 'Real Estate') {
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Price', key: 'price', placeholder: '$12,500,000' },
                            { label: 'Living Area', key: 'livingArea', placeholder: '45,000 sqft' },
                            { label: 'Land Size', key: 'landSize', placeholder: '5 Acres' },
                            { label: 'Bedroom', key: 'bedroom', placeholder: '12' },
                            { label: 'Bathroom', key: 'bathroom', placeholder: '18' },
                            { label: 'Property Type', key: 'propertyType', placeholder: 'Mansion' },
                            { label: 'Year Built', key: 'yearBuilt', placeholder: '2024' },
                            { label: 'Architect', key: 'architect', placeholder: 'Sothebys' },
                            { label: 'Interior Design', key: 'interiorDesign', placeholder: 'Sothebys' },
                            { label: 'Garage Capacity', key: 'garageCapacity', placeholder: '20+ Cars' },
                            { label: 'Floors', key: 'floors', placeholder: '3' },
                            { label: 'Ownership', key: 'ownership', placeholder: 'Freehold' },
                            { label: 'Zoning', key: 'zoning', placeholder: 'Residential' },
                            { label: 'Availability Status', key: 'availabilityStatus', placeholder: 'For Sale' },
                            { label: 'Listing ID', key: 'listingId', placeholder: '#NJM1342000' }
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{field.label}</label>
                                <input 
                                    type="text"
                                    value={editNomineeData.keyDetails?.[field.key] || ''}
                                    onChange={(e) => setEditNomineeData({
                                        ...editNomineeData,
                                        keyDetails: { ...editNomineeData.keyDetails, [field.key]: e.target.value }
                                    })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="text-xl font-normal text-white mb-4 canela tracking-wide">Scores And Rankings</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Prestige Score ( Out Of 100 )', key: 'prestigeScore', placeholder: '80' },
                                { label: 'Architecture Score ( Out Of 100 )', key: 'architectureScore', placeholder: '50' },
                                { label: 'Location Score ( Out Of 100 )', key: 'locationScore', placeholder: '70' },
                                { label: 'Amenities Score ( Out Of 100 )', key: 'amenitiesScore', placeholder: '40' },
                                { label: 'Investment Score ( Out Of 100 )', key: 'investmentScore', placeholder: '60' },
                                { label: 'Exclusivity Score ( Out Of 100 )', key: 'exclusivityScore', placeholder: '80' },
                                { label: 'Anuual Appreciation ( % )', key: 'annualAppreciation', placeholder: '5' }
                            ].map((field) => (
                                <div key={field.key} className={field.key === 'annualAppreciation' ? 'col-span-1' : ''}>
                                    <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{field.label}</label>
                                    <input 
                                        type="text"
                                        value={editNomineeData.keyDetails?.[field.key] || ''}
                                        onChange={(e) => setEditNomineeData({
                                            ...editNomineeData,
                                            keyDetails: { ...editNomineeData.keyDetails, [field.key]: e.target.value }
                                        })}
                                        className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'Yachts') {
            return (
                <div>
                    <h4 className="text-base font-bold text-white mb-4">Yacht Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Length', key: 'length', placeholder: '40m' },
                            { label: 'Beam', key: 'beam', placeholder: '8.5m' },
                            { label: 'Draft', key: 'draft', placeholder: '2.2m' },
                            { label: 'Cabins', key: 'cabins', placeholder: '5 Cabins' },
                            { label: 'Guests', key: 'guests', placeholder: '10 Guests' },
                            { label: 'Engine', key: 'engine', placeholder: 'Twin MTU' },
                            { label: 'Max Speed', key: 'speed', placeholder: '22 knots' },
                            { label: 'Price', key: 'price', placeholder: '$22M' },
                            { label: 'Year', key: 'year', placeholder: '2026' }
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{field.label}</label>
                                <input 
                                    type="text"
                                    value={editNomineeData.keyDetails?.[field.key] || ''}
                                    onChange={(e) => setEditNomineeData({
                                        ...editNomineeData,
                                        keyDetails: { ...editNomineeData.keyDetails, [field.key]: e.target.value }
                                    })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (type === 'Bikes') {
            return (
                <div>
                    <h4 className="text-base font-bold text-white mb-4">Bike Specifications</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Price', key: 'price', placeholder: '$45K' },
                            { label: 'Year', key: 'year', placeholder: '2026' },
                            { label: 'Engine', key: 'engine', placeholder: '1000 cc' },
                            { label: 'Power', key: 'power', placeholder: '200 HP' },
                            { label: 'Top Speed', key: 'speed', placeholder: '299 Km/h' },
                            { label: 'Fuel Type', key: 'fuelType', placeholder: 'Petrol' }
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{field.label}</label>
                                <input 
                                    type="text"
                                    value={editNomineeData.keyDetails?.[field.key] || ''}
                                    onChange={(e) => setEditNomineeData({
                                        ...editNomineeData,
                                        keyDetails: { ...editNomineeData.keyDetails, [field.key]: e.target.value }
                                    })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (type === 'Content Creator') {
            return (
                <div>
                    <h4 className="text-base font-bold text-white mb-4">Creator Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Subscribers', key: 'subscribers', placeholder: '10M+' },
                            { label: 'Total Views', key: 'views', placeholder: '500M+' },
                            { label: 'Category', key: 'category', placeholder: 'Tech / Lifestyle' },
                            { label: 'Location', key: 'location', placeholder: 'United States' },
                            { label: 'Joined Date', key: 'joinDate', placeholder: '2018' }
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{field.label}</label>
                                <input 
                                    type="text"
                                    value={editNomineeData.keyDetails?.[field.key] || ''}
                                    onChange={(e) => setEditNomineeData({
                                        ...editNomineeData,
                                        keyDetails: { ...editNomineeData.keyDetails, [field.key]: e.target.value }
                                    })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Other/Fallback
        return (
            <div>
                <h4 className="text-base font-bold text-white mb-4">Key Details</h4>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Price', key: 'price', placeholder: '$1.2M' },
                        { label: 'Year', key: 'year', placeholder: '2026' },
                        { label: 'Details', key: 'details', placeholder: 'Additional details...' }
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{field.label}</label>
                            <input 
                                type="text"
                                value={editNomineeData.keyDetails?.[field.key] || ''}
                                onChange={(e) => setEditNomineeData({
                                    ...editNomineeData,
                                    keyDetails: { ...editNomineeData.keyDetails, [field.key]: e.target.value }
                                })}
                                className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handlePrevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 text-left">
            {/* Multi-step Navigation Header */}
            <div className="flex flex-wrap gap-4 items-center justify-between text-xs text-gray-400 pb-4 mb-6">
                <div className="flex items-center flex-wrap gap-4 sm:gap-8">
                    <span 
                        onClick={() => handleStepClick(1)}
                        className={`flex items-center gap-3 cursor-pointer transition-colors ${step === 1 ? 'text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-[#2E2E2E] text-white' : 'bg-[#1C253B] text-gray-300'}`}>1</span> 
                        <span className="text-sm font-medium">Basic Information</span>
                    </span>
                    
                    <span 
                        onClick={() => handleStepClick(2)}
                        className={`flex items-center gap-3 cursor-pointer transition-colors ${step === 2 ? 'text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-[#251BF5] text-white' : 'bg-[#1C253B] text-gray-500'}`}>2</span> 
                        <span className="text-sm font-medium">Nominees ( Top )</span>
                    </span>
                </div>
                {editingNomineeIndex === null && (
                    <div className="flex gap-2">
                        <button type="button" onClick={onCancel} className="px-4 py-1.5 bg-[#1C253B] text-gray-300 rounded-lg hover:bg-[#253252] transition-colors font-bold">Cancel</button>
                        {step > 1 && (
                            <button type="button" onClick={handlePrevStep} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1A2338] text-gray-300 border border-[#2B395B] rounded-lg hover:bg-[#253252] transition-colors font-bold">
                                <FiChevronLeft /> Back
                            </button>
                        )}
                        <button 
                            type="button" 
                            onClick={handleNextStep} 
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F46E5] transition-colors font-bold shadow-lg shadow-[#6366F1]/20 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>Saving...</>
                            ) : step === 2 ? (
                                <>Save & Publish <FiChevronRight /></>
                            ) : (
                                <>Next Step <FiChevronRight /></>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* STEP 1: Basic Information */}
            {step === 1 && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* LEFT BLOCK: Text Fields */}
                    <div className="xl:col-span-8 space-y-6">
                        <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-6">
                            <h3 className="text-sm font-normal text-white border-b border-[#1C253B] pb-3 canela tracking-wide">Category Description</h3>
                            
                            {/* Title input */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category Title *</label>
                                    <span className="text-[9px] font-bold text-gray-500">{formData.title.length}/100</span>
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    maxLength="100"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-gray-600 animate-in fade-in"
                                    placeholder="e.g., Best Luxury Dealers / Best Hypercars of 2026"
                                />
                            </div>

                            {/* Slug input */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Slug *</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-gray-600"
                                    placeholder="best-hypercars-of-2026"
                                />
                            </div>


                            {/* Type Selector Grid */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category Industry Type *</label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                    {types.map((t) => {
                                        const isSelected = formData.type === t.id;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: t.id, icon: t.icon })}
                                                className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                                    isSelected 
                                                    ? 'bg-[#6366F1]/10 border-[#6366F1] text-white shadow-md' 
                                                    : 'bg-[#151D30]/60 border-[#222E4A] text-gray-400 hover:border-gray-500 hover:text-white'
                                                }`}
                                            >
                                                <img src={t.icon} alt={t.label} className="w-12 h-12 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-center truncate w-full">{t.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Short Description *</label>
                                        <span className="text-[9px] font-bold text-gray-500">{formData.shortDescription.length}/200</span>
                                    </div>
                                    <textarea 
                                        rows="2"
                                        maxLength="200"
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all resize-none placeholder:text-gray-600"
                                        placeholder="Recognizing the most powerful, fastest and most innovative..."
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Description (Optional)</label>
                                        <span className="text-[9px] font-bold text-gray-500">{formData.detailedDescription.length}/1000</span>
                                    </div>
                                    <textarea 
                                        rows="4"
                                        maxLength="1000"
                                        value={formData.detailedDescription}
                                        onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all resize-none placeholder:text-gray-600"
                                        placeholder="Detailed category parameters for public display..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT BLOCK: Image uploaders */}
                    <div className="xl:col-span-4 space-y-6">
                        {/* Cover Image */}
                        <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Category Cover Image *</h3>
                            <div className="h-44 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group flex items-center justify-center">
                                {formData.categoryImage ? (
                                    <img src={formData.categoryImage} alt="Cover Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500 p-4 text-center">
                                        <FiImage className="text-3xl" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">No Image Uploaded</span>
                                    </div>
                                )}
                                
                                {formData.categoryImage && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => coverInputRef.current.click()} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Cover</button>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={coverInputRef} 
                                onChange={(e) => handleFileSelect(e, 'cover')} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                            />
                            <button type="button" onClick={() => coverInputRef.current.click()} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <FiImage /> Choose Image
                            </button>
                        </div>

                        {/* Banner Image */}
                        <div className="bg-[#101622] rounded-[2rem] p-6 border border-[#1B243B] space-y-4">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-wider border-b border-[#1C253B] pb-2">Banner Image *</h3>
                            <div className="h-24 rounded-xl overflow-hidden bg-gray-900 border border-[#222E4A] relative group flex items-center justify-center">
                                {formData.bannerImage ? (
                                    <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 text-gray-500 p-4 text-center">
                                        <FiImage className="text-2xl" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">No Image Uploaded</span>
                                    </div>
                                )}

                                {formData.bannerImage && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => bannerInputRef.current.click()} className="px-3 py-1.5 bg-[#1C253B] text-white rounded-lg text-[9px] font-bold uppercase hover:bg-black transition-colors">Change Banner</button>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={bannerInputRef} 
                                onChange={(e) => handleFileSelect(e, 'banner')} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                            />
                            <button type="button" onClick={() => bannerInputRef.current.click()} className="w-full py-2.5 bg-[#151D30] border border-[#222E4A] rounded-xl text-[10px] font-bold text-white hover:bg-[#222E4A] transition-all uppercase tracking-wider flex items-center justify-center gap-1.5">
                                <FiImage /> Choose Banner
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: Manage Nominees (List View) */}
            {step === 2 && editingNomineeIndex === null && (
                <div className="bg-[#101622] rounded-[2.5rem] p-6 sm:p-8 border border-[#1B243B] space-y-6 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1C253B] pb-4">
                        <div>
                            <h3 className="text-lg font-normal text-white canela tracking-wide">
                                Nominate {formData.targetType} in "{formData.title || 'Category'}"
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Search and add verified {formData.targetType.toLowerCase()} as official voters selections
                            </p>
                        </div>
                        <div className="px-4 py-1.5 bg-[#1C253B] border border-[#2B395B] rounded-xl text-[10px] font-bold text-gray-400">
                            Nominees Limit: <span className="text-white font-black">{formData.nominees.length} / {formData.nomineeLimit}</span>
                        </div>
                    </div>

                    {/* Add Custom Nominee button */}
                    <div className="text-left">
                        <button 
                            type="button"
                            onClick={() => {
                                const customId = 'custom-' + Date.now();
                                const isContentCreator = formData.type === 'Content Creator';
                                const slugType = isContentCreator 
                                    ? 'contentcreators' 
                                    : (formData.type === 'Real Estate' ? 'real-estate' : (formData.type ? formData.type.toLowerCase() : 'cars'));
                                const newNominee = {
                                    id: customId,
                                    name: isContentCreator ? 'New Creator Nominee' : 'New Custom Nominee',
                                    detail: isContentCreator ? 'Content Creator' : 'Custom Nominee',
                                    image: '',
                                    banner: '',
                                    channelName: '',
                                    votes: 0,
                                    fakeVotes: 0,
                                    brand: '',
                                    model: '',
                                    description: '',
                                    listingLink: '',
                                    keyDetails: isContentCreator ? {
                                        subscribers: '',
                                        views: '',
                                        category: '',
                                        location: '',
                                        joinDate: '',
                                        youtubeFollowers: '',
                                        instagramFollowers: '',
                                        twitterFollowers: '',
                                        tiktokFollowers: '',
                                        totalFollowers: ''
                                    } : {},
                                    sources: [
                                        { title: 'Listing Link', url: `https://otulia.com/ranking/${slugType}/` }
                                    ],
                                    youtube: '',
                                    instagram: '',
                                    twitter: '',
                                    tiktok: '',
                                    youtubeFollowers: '',
                                    instagramFollowers: '',
                                    twitterFollowers: '',
                                    tiktokFollowers: '',
                                    totalFollowers: ''
                                };
                                setFormData(prev => ({
                                    ...prev,
                                    nominees: [...prev.nominees, newNominee]
                                }));
                                setEditNomineeData(newNominee);
                                setEditingNomineeIndex(formData.nominees.length);
                            }}
                            className="py-3 px-4 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] hover:bg-[#6366F1]/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                        >
                            + Add Custom Nominee
                        </button>
                    </div>

                    {/* Nominees Added Listing */}
                    <div className="space-y-3 mt-6 text-left">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nominated Candidates</label>
                        {formData.nominees.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.nominees.map((nom, index) => (
                                    <div key={nom.id} className="flex items-center justify-between p-3.5 bg-[#151D30]/40 border border-[#222E4A] rounded-2xl hover:border-[#2C3B5E] transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <span className="w-6 h-6 rounded-full bg-[#1C253B] flex items-center justify-center text-[10px] text-[#D48D2A] font-bold">{index + 1}</span>
                                            <img src={nom.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt={nom.name} className="w-11 h-11 rounded-xl object-cover bg-gray-800 animate-in fade-in" />
                                            <div className="text-left">
                                                <h4 className="text-xs font-bold text-white tracking-wide">{nom.name}</h4>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{nom.detail || 'Custom Nominee Details'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingNomineeIndex(index);
                                                    setEditNomineeData(nom);
                                                }}
                                                className="px-2.5 py-1.5 bg-[#1C253B] hover:bg-[#253252] border border-[#2B395B] text-gray-300 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors"
                                            >
                                                Edit Details
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => removeNominee(nom.id)}
                                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <FiTrash2 className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#151D30]/20 rounded-2xl p-12 border border-dashed border-[#222E4A] text-center flex flex-col items-center justify-center text-gray-500">
                                <FiAward className="text-3xl text-gray-600 mb-3" />
                                <p className="text-xs font-bold uppercase tracking-wider">No nominees nominated yet</p>
                                <p className="text-[10px] text-gray-600 mt-1 max-w-xs">Use the search bar above to populate list candidates.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: Detailed Nominee Editor View (Matching Second mockup Image exactly) */}
            {step === 2 && editingNomineeIndex !== null && editNomineeData && (
                <div className="space-y-6 animate-in fade-in duration-300 text-left">
                    <div className="pb-4">
                        <h3 className="text-2xl font-normal text-white">
                            Editing Nominee #{editingNomineeIndex + 1}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Name, Brand, Model, Preview + Change Image, Listing Link */}
                        <div className="lg:col-span-4 space-y-5">
                            <div>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">Nominee Name</label>
                                <input 
                                    type="text"
                                    value={editNomineeData.name || ''}
                                    onChange={(e) => setEditNomineeData({ ...editNomineeData, name: e.target.value })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#6366F1] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">Enter Fake Votes</label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={editNomineeData.fakeVotes !== undefined && editNomineeData.fakeVotes !== null ? editNomineeData.fakeVotes : ''}
                                    onChange={(e) => setEditNomineeData({ ...editNomineeData, fakeVotes: e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0) })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#6366F1] transition-all"
                                    placeholder="0"
                                />
                            </div>

                            {formData.type === 'Content Creator' ? (
                                <div>
                                    <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">Channel Name</label>
                                    <input 
                                        type="text"
                                        value={editNomineeData.channelName || ''}
                                        onChange={(e) => setEditNomineeData({ ...editNomineeData, channelName: e.target.value })}
                                        className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#6366F1] transition-all"
                                        placeholder="e.g. MrBeast"
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">
                                            {formData.type === 'Real Estate' ? 'Property Type' : 'Brand'}
                                        </label>
                                        <input 
                                            type="text"
                                            value={editNomineeData.brand || ''}
                                            onChange={(e) => setEditNomineeData({ ...editNomineeData, brand: e.target.value })}
                                            className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#6366F1] transition-all"
                                            placeholder={formData.type === 'Real Estate' ? 'e.g. Mansion' : 'e.g. Bugatti'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">
                                            {formData.type === 'Real Estate' ? 'Location' : 'Model'}
                                        </label>
                                        <input 
                                            type="text"
                                            value={editNomineeData.model || ''}
                                            onChange={(e) => setEditNomineeData({ ...editNomineeData, model: e.target.value })}
                                            className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#6366F1] transition-all"
                                            placeholder={formData.type === 'Real Estate' ? 'e.g. Beverly Hills' : 'e.g. Tourbillon'}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'Content Creator' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Channel Logo Upload */}
                                    <div className="space-y-3">
                                        <label className="block text-[13px] text-[#A1A1AA] font-medium">Channel Logo</label>
                                        <div className="h-32 rounded-xl overflow-hidden bg-[#0D0D0E] border border-[#222E4A] relative group flex items-center justify-center">
                                            {editNomineeData.image ? (
                                                <img src={editNomineeData.image} alt="Channel Logo" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-gray-500 p-2 text-center">
                                                    <FiImage className="text-2xl" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">No Logo</span>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                const fileInput = document.createElement('input');
                                                fileInput.type = 'file';
                                                fileInput.accept = 'image/*';
                                                fileInput.onchange = (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = () => {
                                                            setCropImageSrc(reader.result);
                                                            setCropTarget(`nominee-logo-${editingNomineeIndex}`);
                                                            setCropModalOpen(true);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                };
                                                fileInput.click();
                                            }}
                                            className="w-full py-2 bg-[#251BF5] hover:bg-[#3D33FF] text-white rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider text-center"
                                        >
                                            Change Logo
                                        </button>
                                    </div>
                                    {/* Banner Upload */}
                                    <div className="space-y-3">
                                        <label className="block text-[13px] text-[#A1A1AA] font-medium">Banner Image</label>
                                        <div className="h-32 rounded-xl overflow-hidden bg-[#0D0D0E] border border-[#222E4A] relative group flex items-center justify-center">
                                            {editNomineeData.banner ? (
                                                <img src={editNomineeData.banner} alt="Banner" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-1 text-gray-500 p-2 text-center">
                                                    <FiImage className="text-2xl" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">No Banner</span>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                const fileInput = document.createElement('input');
                                                fileInput.type = 'file';
                                                fileInput.accept = 'image/*';
                                                fileInput.onchange = (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = () => {
                                                            setCropImageSrc(reader.result);
                                                            setCropTarget(`nominee-banner-${editingNomineeIndex}`);
                                                            setCropModalOpen(true);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                };
                                                fileInput.click();
                                            }}
                                            className="w-full py-2 bg-[#251BF5] hover:bg-[#3D33FF] text-white rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider text-center"
                                        >
                                            Change Banner
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="h-48 rounded-xl overflow-hidden bg-[#0D0D0E] border border-[#222E4A] relative group flex items-center justify-center">
                                        {editNomineeData.image ? (
                                            <img src={editNomineeData.image} alt="Nominee Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-500 p-4 text-center">
                                                <FiImage className="text-3xl" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">No Image Uploaded</span>
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const fileInput = document.createElement('input');
                                            fileInput.type = 'file';
                                            fileInput.accept = 'image/*';
                                            fileInput.onchange = (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setCropImageSrc(reader.result);
                                                        setCropTarget(`nominee-${editingNomineeIndex}`);
                                                        setCropModalOpen(true);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            };
                                            fileInput.click();
                                        }}
                                        className="px-5 py-2.5 bg-[#251BF5] hover:bg-[#3D33FF] text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            )}

                            <div>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">Listing Link</label>
                                <input 
                                    type="text"
                                    value={editNomineeData.listingLink || ''}
                                    onChange={(e) => setEditNomineeData({ ...editNomineeData, listingLink: e.target.value })}
                                    className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#6366F1] transition-all"
                                    placeholder="https://otulia.com/ranking/cars/car-brands"
                                />
                            </div>
                        </div>

                        {/* MIDDLE COLUMN: Description & Key Details */}
                        <div className="lg:col-span-5 space-y-5">
                            <div>
                                <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">Description</label>
                                <div className="relative">
                                    <textarea 
                                        rows="5"
                                        maxLength="1000"
                                        value={editNomineeData.description || ''}
                                        onChange={(e) => setEditNomineeData({ ...editNomineeData, description: e.target.value })}
                                        className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-[#6366F1] transition-all resize-none placeholder:text-gray-600 pb-8"
                                        placeholder="This Rankings tells about the best hypercars ranked by people..."
                                    />
                                    <span className="absolute bottom-3 right-3 text-[10px] text-gray-500 font-bold">
                                        {(editNomineeData.description || '').length}/1000
                                    </span>
                                </div>
                            </div>

                            {renderKeyDetailsFields()}

                            {formData.type === 'Content Creator' && (
                                <div className="pt-4 border-t border-[#1C253B] space-y-5">
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-3">Exact Follower Counts</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'YouTube Subscribers', key: 'youtubeFollowers', placeholder: 'e.g. 318M' },
                                                { label: 'Instagram Followers', key: 'instagramFollowers', placeholder: 'e.g. 60.9M' },
                                                { label: 'Twitter Followers', key: 'twitterFollowers', placeholder: 'e.g. 30.9M' },
                                                { label: 'TikTok Followers', key: 'tiktokFollowers', placeholder: 'e.g. 105M' }
                                            ].map((follower) => (
                                                <div key={follower.key}>
                                                    <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{follower.label}</label>
                                                    <input 
                                                        type="text"
                                                        value={editNomineeData[follower.key] || editNomineeData.keyDetails?.[follower.key] || ''}
                                                        onChange={(e) => setEditNomineeData({
                                                            ...editNomineeData,
                                                            [follower.key]: e.target.value,
                                                            keyDetails: { ...(editNomineeData.keyDetails || {}), [follower.key]: e.target.value }
                                                        })}
                                                        className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                        placeholder={follower.placeholder}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-3">Social Links</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Youtube Channel', key: 'youtube', placeholder: 'https://youtube.com/...' },
                                                { label: 'Instagram Link', key: 'instagram', placeholder: 'https://instagram.com/...' },
                                                { label: 'Twitter Link', key: 'twitter', placeholder: 'https://twitter.com/...' },
                                                { label: 'TikTok Link', key: 'tiktok', placeholder: 'https://tiktok.com/...' }
                                            ].map((social) => (
                                                <div key={social.key}>
                                                    <label className="block text-[13px] text-[#A1A1AA] mb-2 font-medium">{social.label}</label>
                                                    <input 
                                                        type="text"
                                                        value={editNomineeData[social.key] || ''}
                                                        onChange={(e) => setEditNomineeData({
                                                            ...editNomineeData,
                                                            [social.key]: e.target.value
                                                        })}
                                                        className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                        placeholder={social.placeholder}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Sources & Save/Cancel Actions */}
                        <div className="lg:col-span-3 flex flex-col justify-between min-h-[500px]">
                            <div className="space-y-5">
                                <h4 className="text-base font-bold text-white mb-4 flex items-baseline gap-2">
                                    Sources <span className="text-[10px] text-gray-500 font-medium">( Multiple Links )</span>
                                </h4>
                                
                                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                                    {(editNomineeData.sources || []).map((source, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-3 relative group">
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <label className="block text-[13px] text-[#A1A1AA] mb-1.5 font-medium">Source Title</label>
                                                    <input 
                                                        type="text"
                                                        value={source.title || ''}
                                                        onChange={(e) => {
                                                            const updatedSources = [...editNomineeData.sources];
                                                            updatedSources[sIdx].title = e.target.value;
                                                            setEditNomineeData({ ...editNomineeData, sources: updatedSources });
                                                        }}
                                                        className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                        placeholder="Listing Link"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[13px] text-[#A1A1AA] mb-1.5 font-medium">Source URL</label>
                                                    <input 
                                                        type="text"
                                                        value={source.url || ''}
                                                        onChange={(e) => {
                                                            const updatedSources = [...editNomineeData.sources];
                                                            updatedSources[sIdx].url = e.target.value;
                                                            setEditNomineeData({ ...editNomineeData, sources: updatedSources });
                                                        }}
                                                        className="w-full bg-[#0D0D0E] border border-[#222E4A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                        placeholder="https://otulia.com/ranking/cars/"
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const updatedSources = editNomineeData.sources.filter((_, idx) => idx !== sIdx);
                                                    setEditNomineeData({ ...editNomineeData, sources: updatedSources });
                                                }}
                                                className="w-9 h-9 rounded-full bg-[#DC2626] hover:bg-red-700 text-white flex items-center justify-center transition-colors shrink-0 mt-6 shadow-md"
                                                title="Delete Source"
                                            >
                                                <FiTrash2 className="text-sm" />
                                            </button>
                                        </div>
                                    ))}

                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const updatedSources = [...(editNomineeData.sources || []), { title: 'Listing Link', url: 'https://otulia.com/ranking/cars/' }];
                                            setEditNomineeData({ ...editNomineeData, sources: updatedSources });
                                        }}
                                        className="w-full py-3 bg-[#251BF5] hover:bg-[#3D33FF] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 text-center"
                                    >
                                        Add Another Source
                                    </button>
                                </div>
                            </div>

                            {/* Actions layout inside right column */}
                            <div className="flex gap-4 pt-6 border-t border-[#1C253B] mt-8 w-full">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditingNomineeIndex(null);
                                        setEditNomineeData(null);
                                    }} 
                                    className="flex-1 py-3 border border-[#2B395B] hover:border-gray-500 text-gray-300 hover:text-white rounded-xl transition-all font-bold text-xs uppercase tracking-wider text-center bg-transparent"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => {
                                            const updated = [...prev.nominees];
                                            const nomineeToSave = { ...editNomineeData };
                                            const parts = [];
                                            if (formData.type === 'Content Creator') {
                                                if (nomineeToSave.channelName) parts.push(nomineeToSave.channelName);
                                                if (nomineeToSave.keyDetails?.category) parts.push(nomineeToSave.keyDetails.category);
                                                nomineeToSave.detail = parts.join(' · ') || 'Content Creator';
                                            } else {
                                                if (nomineeToSave.brand) parts.push(nomineeToSave.brand);
                                                if (nomineeToSave.model) parts.push(nomineeToSave.model);
                                                nomineeToSave.detail = parts.join(' · ') || (formData.type === 'Real Estate' ? 'Real Estate Nominee' : 'Nominee');
                                            }
                                            
                                            updated[editingNomineeIndex] = nomineeToSave;
                                            return { ...prev, nominees: updated };
                                        });

                                        if (editingNomineeIndex < formData.nominees.length - 1) {
                                            const nextIdx = editingNomineeIndex + 1;
                                            setEditingNomineeIndex(nextIdx);
                                            setEditNomineeData(formData.nominees[nextIdx]);
                                        } else {
                                            setEditingNomineeIndex(null);
                                            setEditNomineeData(null);
                                        }
                                    }}
                                    className="flex-1 py-3 bg-[#251BF5] hover:bg-[#3D33FF] text-white rounded-xl transition-all font-bold text-xs uppercase tracking-wider text-center shadow-lg shadow-[#251BF5]/20"
                                >
                                    {editingNomineeIndex < formData.nominees.length - 1 ? 'Save & Next' : 'Save & Done'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {cropModalOpen && (
                <ImageCropModal 
                    src={cropImageSrc}
                    onCropComplete={(blob) => {
                        if (cropTarget === 'cover') {
                            setCroppedCoverBlob(blob);
                            setFormData(prev => ({ ...prev, categoryImage: URL.createObjectURL(blob) }));
                            setCropModalOpen(false);
                        } else if (cropTarget === 'banner') {
                            setCroppedBannerBlob(blob);
                            setFormData(prev => ({ ...prev, bannerImage: URL.createObjectURL(blob) }));
                            setCropModalOpen(false);
                        } else if (cropTarget.startsWith('nominee-')) {
                            setIsSubmitting(true);
                            const uploadData = new FormData();
                            const isBanner = cropTarget.startsWith('nominee-banner-');
                            const filename = isBanner ? `banner_${Date.now()}.png` : `logo_${Date.now()}.png`;
                            uploadData.append('image', blob, filename);
                            
                            const categoryTitle = formData.title || 'general';
                            const nomineeName = editNomineeData?.name || `nominee-${editingNomineeIndex}`;
                            
                            const oldUrl = isBanner 
                                ? editNomineeData?.banner 
                                : editNomineeData?.image;
                                
                            let endpoint = `/api/upload/nominee-image?category=${encodeURIComponent(categoryTitle)}&nominee=${encodeURIComponent(nomineeName)}`;
                            if (oldUrl) {
                                endpoint += `&oldUrl=${encodeURIComponent(oldUrl)}`;
                            }
                            
                            fetch(endpoint, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                },
                                body: uploadData
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success && data.url) {
                                    const fieldKey = isBanner ? 'banner' : 'image';
                                    setEditNomineeData(prev => ({ ...prev, [fieldKey]: data.url }));
                                    setFormData(prev => {
                                        const updated = [...prev.nominees];
                                        if (updated[editingNomineeIndex]) {
                                            updated[editingNomineeIndex] = {
                                                ...updated[editingNomineeIndex],
                                                [fieldKey]: data.url
                                            };
                                        }
                                        return { ...prev, nominees: updated };
                                    });
                                } else {
                                    alert("Failed to upload image. Please try again.");
                                }
                            })
                            .catch(err => {
                                console.error("Nominee image upload error:", err);
                                alert("Error uploading nominee image.");
                            })
                            .finally(() => {
                                setIsSubmitting(false);
                                setCropModalOpen(false);
                            });
                        }
                    }}
                    onClose={() => setCropModalOpen(false)}
                    isUploading={false}
                />
            )}
        </div>
    );
};

export default RankingCategoryForm;
