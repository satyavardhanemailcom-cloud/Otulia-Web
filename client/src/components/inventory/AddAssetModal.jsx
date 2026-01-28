import React, { useState, useEffect } from 'react';
import {
    FiX, FiArrowLeft, FiImage, FiPlus,
    FiTrash2, FiVideo, FiCheck, FiChevronRight,
    FiCheckCircle, FiInfo, FiMapPin, FiFileText
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

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
        price: '', type: 'Sale', location: '', description: '',
        videoUrl: '', isPublic: true,

        // Fixed Highlights Keys
        highlight_hp: '', highlight_km: '', highlight_cc: '',
        highlight_length: '', highlight_baths: '', highlight_beds: '',
        highlight_area: '', highlight_kml: '', highlight_fuel: '',

        // Car Specific
        mileage: '', fuelType: '', transmission: '',
        engine: '', exteriorColor: '', interiorColor: '', condition: '',
        ownershipCount: '1', accidentHistory: '', horsepower: '',
        topSpeed: '', engineType: '', bodyType: '', series: '',
        cylinderCapacity: '', driveType: '', steering: '',
        interiorMaterial: '', manufacturerColorCode: '',
        matchingNumbers: '', accidentFree: '', numberOfOwners: '1',
        countryOfFirstDelivery: '', currentCarLocation: '',

        // Yacht Specific
        yachtName: '', builder: '', length: '', beam: '', draft: '',
        cruisingSpeed: '', guestCapacity: '', crewCapacity: '',
        hullMaterial: '',

        // Real Estate Specific
        propertyName: '', propertyType: '', country: '', city: '', address: '',
        builtUpArea: '', landArea: '', bedrooms: '', bathrooms: '', floors: '',
        furnishingStatus: '', architectureStyle: '', configuration: '',
        interiorMaterial: '', interiorColorTheme: '', exteriorFinish: '',
        climateControl: '', usageStatus: '',
        areaNeighborhood: '', latitude: '', longitude: '',
        amenities: [], smartHomeSystems: [], viewTypes: [],

        // Bike Specific
        brand: '', engineCapacity: '', color: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [coverImage, setCoverImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            setAssetType(null);
            setCoverImage(null);
            setGalleryImages([]);
            setDocuments([]);
            setFormData(initialFormState);
        } else if (editData) {
            setStep(1);
            setAssetType(editData.category?.replace('Asset', ''));
            const spec = editData.specification || {};
            const keySpec = editData.keySpecifications || {};

            // Extract existing highlights if available to populate fields (best effort)
            // This part is tricky if we don't know which index maps to which field. 
            // For now, we might leave them empty or user has to re-enter if editing old data that didn't have this structure.

            setFormData({
                ...initialFormState,
                // Common
                price: editData.price || '',
                type: editData.type || 'Sale',
                location: editData.location || '',
                description: editData.description || '',
                videoUrl: editData.videoUrl || '',
                isPublic: editData.status === 'Active',

                // Specifics mapping (same as before)
                make: editData.brand || '',
                model: spec.model || '',
                variant: spec.variant || '',
                year: spec.year || '',
                mileage: spec.mileage || '',
                fuelType: spec.fuelType || '',
                transmission: spec.transmission || '',
                exteriorColor: spec.exteriorColor || '',
                interiorColor: spec.interiorColor || '',
                condition: spec.condition || '',
                yachtName: spec.yachtName || '',
                builder: spec.builder || '',
                length: spec.length || '',
                beam: spec.beam || '',
                propertyName: editData.title || '',
                propertyType: keySpec.propertyType || '',
                builtUpArea: spec.builtUpArea || '',
                landArea: spec.landArea || '',
                bedrooms: spec.bedrooms || '',
                bathrooms: spec.bathrooms || '',
                brand: editData.brand || '',
                engineCapacity: spec.engineCapacity || '',
            });
        }
    }, [isOpen, editData]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const handleFileUpload = (e, type) => {
        if (type === 'cover') setCoverImage(e.target.files[0]);
        else if (type === 'gallery') setGalleryImages([...galleryImages, ...Array.from(e.target.files)]);
        else if (type === 'document') setDocuments([...documents, ...Array.from(e.target.files)]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();

        // Construct Fixed Highlights based on Asset Type
        let constructedHighlights = [];
        if (assetType === 'Car') {
            if (!formData.highlight_hp || !formData.highlight_km || !formData.highlight_cc) {
                alert('Please fill in all Car Highlights (HP, Mileage, Engine)');
                setLoading(false);
                return;
            }
            constructedHighlights = [`${formData.highlight_hp} hp`, `${formData.highlight_km} km`, `${formData.highlight_cc} cc`];
        } else if (assetType === 'Yacht') {
            if (!formData.highlight_length || !formData.highlight_baths || !formData.highlight_beds) {
                alert('Please fill in all Yacht Highlights (Length, Baths, Beds)');
                setLoading(false);
                return;
            }
            constructedHighlights = [`${formData.highlight_length} M length`, `Bathrooms: ${formData.highlight_baths}`, `Bedrooms: ${formData.highlight_beds}`];
        } else if (assetType === 'Estate') {
            if (!formData.highlight_area || !formData.highlight_baths || !formData.highlight_beds) {
                alert('Please fill in all Real Estate Highlights (Area, Baths, Beds)');
                setLoading(false);
                return;
            }
            constructedHighlights = [`Land Area: ${formData.highlight_area} Acres`, `Bathrooms: ${formData.highlight_baths}`, `Bedrooms: ${formData.highlight_beds}`];
        } else if (assetType === 'Bike') {
            if (!formData.highlight_cc || !formData.highlight_kml || !formData.highlight_fuel) {
                alert('Please fill in all Bike Highlights (Engine, Mileage, Fuel)');
                setLoading(false);
                return;
            }
            constructedHighlights = [`${formData.highlight_cc} cc`, `${formData.highlight_kml} km/l`, `${formData.highlight_fuel} liters`];
        }

        // Append to FormData
        Object.keys(formData).forEach(key => {
            // Skip separate highlight keys and internal lists, handle them explicitly
            if (key.startsWith('highlight_') || ['highlights', 'amenities', 'smartHomeSystems', 'viewTypes'].includes(key)) {
                return;
            }
            data.append(key, formData[key]);
        });

        // Append constructed highlights and arrays
        data.append('highlights', JSON.stringify(constructedHighlights));
        if (formData.amenities) data.append('amenities', JSON.stringify(formData.amenities));
        if (formData.smartHomeSystems) data.append('smartHomeSystems', JSON.stringify(formData.smartHomeSystems));
        if (formData.viewTypes) data.append('viewTypes', JSON.stringify(formData.viewTypes));

        data.append('category', assetType);
        if (coverImage) data.append('images', coverImage);
        galleryImages.forEach(img => data.append('images', img));
        documents.forEach(doc => data.append('documents', doc));

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
                onCreated(result);
                onClose();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to list asset');
            }
        } catch (error) {
            console.error(error);
            alert('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const types = [
        { id: 'Car', label: 'Car', icon: '🚗' },
        { id: 'Yacht', label: 'Yacht', icon: '⛵' },
        { id: 'Estate', label: 'Real Estate', icon: '🏠' },
        { id: 'Bike', label: 'Bike', icon: '🏍️' },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        {step === 1 && (
                            <button onClick={() => setStep(0)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                                <FiArrowLeft className="text-xl" />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold playfair-display text-gray-900">
                            {step === 0 ? 'Select Asset Type' : `${assetType} Details`}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
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
                                    className="group bg-white border border-gray-100 p-10 rounded-[2rem] hover:border-[#D48D2A] hover:bg-[#F2E8DB]/20 hover:shadow-xl transition-all duration-300 text-center"
                                >
                                    <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 duration-500">
                                        {type.icon}
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 font-playfair">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP 1: FORM DETAILS */}
                    {step === 1 && (
                        <div className="space-y-16 animate-in slide-in-from-bottom-5 duration-500">

                            {/* Section Header */}
                            <div className="flex justify-between items-center pb-8 border-b border-gray-50">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-[#FDF8F0] border border-[#F2E8DB] rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                                        {assetType === 'Car' ? '🚗' : assetType === 'Yacht' ? '⛵' : assetType === 'Estate' ? '🏠' : assetType === 'Bike' ? '🏍️' : '📦'}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 font-playfair">{assetType} Details</h3>
                                        <p className="text-sm text-gray-400">Fill in the details for your luxury listing</p>
                                    </div>
                                </div>
                                <button onClick={() => setStep(0)} className="px-6 py-2.5 bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 border border-gray-100 transition-all">
                                    Change Type
                                </button>
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                                {assetType === 'Car' && (
                                    <>
                                        <InputField label="Make" name="make" value={formData.make} placeholder="e.g., Ferrari" onChange={handleInputChange} />
                                        <InputField label="Model" name="model" value={formData.model} placeholder="e.g., SF90 Stradale" onChange={handleInputChange} />
                                        <InputField label="Variant" name="variant" value={formData.variant} placeholder="e.g., Assetto Fiorano" onChange={handleInputChange} />
                                        <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                        <InputField label={formData.type === 'Rent' ? "Price per Day (£)" : "Price (£)"} name="price" type="number" value={formData.price} placeholder="625000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <InputField label="Location" name="location" value={formData.location} placeholder="Beverly Hills, CA" onChange={handleInputChange} />
                                        <InputField label="Mileage" name="mileage" type="number" value={formData.mileage} placeholder="1500" onChange={handleInputChange} />
                                        <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Gasoline', 'Diesel', 'Hybrid', 'Electric']} onChange={handleInputChange} />
                                        <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Automatic', 'Manual', 'PDK', 'F1']} onChange={handleInputChange} />
                                        <InputField label="Engine" name="engine" value={formData.engine} placeholder="e.g., 4.0L V8 Twin-Turbo" onChange={handleInputChange} />
                                        <InputField label="Exterior Color" name="exteriorColor" value={formData.exteriorColor} placeholder="e.g., Rosso Corsa" onChange={handleInputChange} />
                                        <InputField label="Interior Color" name="interiorColor" value={formData.interiorColor} placeholder="e.g., Black Leather" onChange={handleInputChange} />
                                        <SelectField label="Condition" name="condition" value={formData.condition} options={['New', 'Used', 'Classic', 'Restored']} onChange={handleInputChange} />
                                        <InputField label="Ownership Count" name="ownershipCount" type="number" value={formData.ownershipCount} onChange={handleInputChange} />
                                        <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} />
                                    </>
                                )}
                                {assetType === 'Yacht' && (
                                    <>
                                        <InputField label="Yacht Name" name="yachtName" value={formData.yachtName} placeholder="e.g., Sea Legend" onChange={handleInputChange} />
                                        <InputField label="Builder" name="builder" value={formData.builder} placeholder="e.g., Azimut" onChange={handleInputChange} />
                                        <InputField label="Model" name="model" value={formData.model} placeholder="e.g., Grande 32 Metri" onChange={handleInputChange} />
                                        <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                        <InputField label={formData.type === 'Rent' ? "Price per Day (£)" : "Price (£)"} name="price" type="number" value={formData.price} placeholder="8500000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <InputField label="Location / Marina" name="location" value={formData.location} placeholder="e.g., Monaco, Port Hercules" onChange={handleInputChange} />
                                        <InputField label="Length (m)" name="length" type="number" value={formData.length} placeholder="32" onChange={handleInputChange} />
                                        <InputField label="Beam (m)" name="beam" type="number" value={formData.beam} placeholder="7.5" onChange={handleInputChange} />
                                        <InputField label="Draft (m)" name="draft" type="number" value={formData.draft} placeholder="2.2" onChange={handleInputChange} />
                                        <InputField label="Engine Type" name="engineType" value={formData.engineType} placeholder="e.g., Twin MTU 16V 2000" onChange={handleInputChange} />
                                        <InputField label="Cruising Speed (knots)" name="cruisingSpeed" type="number" value={formData.cruisingSpeed} placeholder="22" onChange={handleInputChange} />
                                        <InputField label="Guest Capacity" name="guestCapacity" type="number" value={formData.guestCapacity} placeholder="12" onChange={handleInputChange} />
                                        <InputField label="Crew Capacity" name="crewCapacity" type="number" value={formData.crewCapacity} placeholder="6" onChange={handleInputChange} />
                                    </>
                                )}
                                {assetType === 'Estate' && (
                                    <>
                                        <InputField label="Property Name" name="propertyName" value={formData.propertyName} placeholder="e.g., Monaco Penthouse Suite" onChange={handleInputChange} />
                                        <SelectField label="Property Type" name="propertyType" value={formData.propertyType} options={['Villa', 'Penthouse', 'Apartment', 'Mansion', 'Estate']} onChange={handleInputChange} />
                                        <InputField label={formData.type === 'Rent' ? "Price per Day (£)" : "Price (£)"} name="price" type="number" value={formData.price} placeholder="28000000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <InputField label="Country" name="country" value={formData.country} placeholder="e.g., Monaco" onChange={handleInputChange} />
                                        <InputField label="City" name="city" value={formData.city} placeholder="e.g., Monte Carlo" onChange={handleInputChange} />
                                        <InputField label="Address (Optional)" name="address" value={formData.address} placeholder="e.g., Avenue Princess Grace" onChange={handleInputChange} />
                                        <InputField label="Built-up Area (sq ft)" name="builtUpArea" type="number" value={formData.builtUpArea} placeholder="5500" onChange={handleInputChange} />
                                        <InputField label="Land Area (sq ft)" name="landArea" type="number" value={formData.landArea} placeholder="8000" onChange={handleInputChange} />
                                        <InputField label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms} placeholder="5" onChange={handleInputChange} />
                                        <InputField label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms} placeholder="6" onChange={handleInputChange} />
                                        <InputField label="Floors" name="floors" type="number" value={formData.floors} placeholder="2" onChange={handleInputChange} />
                                        <SelectField label="Furnishing Status" name="furnishingStatus" value={formData.furnishingStatus} options={['Unfurnished', 'Partially Furnished', 'Fully Furnished', 'Designer Furnished']} onChange={handleInputChange} />
                                    </>
                                )}
                                {assetType === 'Bike' && (
                                    <>
                                        <InputField label="Brand" name="brand" value={formData.brand} placeholder="e.g., Ducati" onChange={handleInputChange} />
                                        <InputField label="Model" name="model" value={formData.model} placeholder="e.g., Panigale V4" onChange={handleInputChange} />
                                        <InputField label="Variant" name="variant" value={formData.variant} placeholder="e.g., S" onChange={handleInputChange} />
                                        <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                        <InputField label={formData.type === 'Rent' ? "Price per Day (£)" : "Price (£)"} name="price" type="number" value={formData.price} placeholder="28000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <InputField label="Location" name="location" value={formData.location} placeholder="e.g., Miami, FL" onChange={handleInputChange} />
                                    </>
                                )}
                            </div>

                            {/* Section for Estate Amenities - stays original flow */}
                            {assetType === 'Estate' && (
                                <div className="space-y-6">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amenities</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Pool', 'Garden', 'Parking', 'Security', 'Smart Home', 'Gym', 'Wine Cellar', 'Home Theater'].map(amenity => (
                                            <button
                                                key={amenity}
                                                onClick={() => handleCheckboxToggle('amenities', amenity)}
                                                className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${formData.amenities.includes(amenity) ? 'bg-[#D48D2A] border-[#D48D2A] text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-[#D48D2A]'}`}
                                            >
                                                {amenity}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Key Highlights Section - Fixed Fields Only */}
                            <section className="bg-[#FAFBFB] p-10 rounded-[2.5rem] border border-gray-100">
                                <div className="max-w-4xl mx-auto space-y-10">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 font-playfair mb-2">Description</h4>
                                        <p className="text-sm text-gray-400 mb-6">Main asset description for the listing page</p>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border border-gray-200 rounded-[1.5rem] p-8 text-sm focus:outline-none focus:border-[#D48D2A] transition-all min-h-[200px] shadow-sm"
                                            placeholder="Provide a detailed description of your asset..."
                                            required
                                        ></textarea>
                                        <div className="flex justify-between mt-3 px-2">
                                            <p className="text-[10px] text-gray-400 font-bold">Minimum 150 characters</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{formData.description.length}/2000</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-orange-400 text-xl font-bold">✨</span>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 font-playfair">Key Highlights</h4>
                                                <p className="text-xs text-gray-400 italic">These specific details will be highlighted on your listing</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Render Fixed Highlights based on Asset Type */}
                                            {assetType === 'Car' && (
                                                <>
                                                    <InputField label="Horsepower (hp) *" name="highlight_hp" value={formData.highlight_hp || ''} placeholder="e.g. 986" onChange={handleInputChange} />
                                                    <InputField label="Mileage (km) *" name="highlight_km" value={formData.highlight_km || ''} placeholder="e.g. 1,200" onChange={handleInputChange} />
                                                    <InputField label="Engine (cc) *" name="highlight_cc" value={formData.highlight_cc || ''} placeholder="e.g. 3990" onChange={handleInputChange} />
                                                </>
                                            )}
                                            {assetType === 'Yacht' && (
                                                <>
                                                    <InputField label="Length (M) *" name="highlight_length" value={formData.highlight_length || ''} placeholder="e.g. 27" onChange={handleInputChange} />
                                                    <InputField label="Bathrooms *" name="highlight_baths" value={formData.highlight_baths || ''} placeholder="e.g. 6" onChange={handleInputChange} />
                                                    <InputField label="Bedrooms *" name="highlight_beds" value={formData.highlight_beds || ''} placeholder="e.g. 5" onChange={handleInputChange} />
                                                </>
                                            )}
                                            {assetType === 'Estate' && (
                                                <>
                                                    <InputField label="Land Area (Acres) *" name="highlight_area" value={formData.highlight_area || ''} placeholder="e.g. 2" onChange={handleInputChange} />
                                                    <InputField label="Bathrooms *" name="highlight_baths" value={formData.highlight_baths || ''} placeholder="e.g. 8" onChange={handleInputChange} />
                                                    <InputField label="Bedrooms *" name="highlight_beds" value={formData.highlight_beds || ''} placeholder="e.g. 6" onChange={handleInputChange} />
                                                </>
                                            )}
                                            {assetType === 'Bike' && (
                                                <>
                                                    <InputField label="Engine (cc) *" name="highlight_cc" value={formData.highlight_cc || ''} placeholder="e.g. 803" onChange={handleInputChange} />
                                                    <InputField label="Mileage (km/l) *" name="highlight_kml" value={formData.highlight_kml || ''} placeholder="e.g. 20" onChange={handleInputChange} />
                                                    <InputField label="Fuel Capacity (L) *" name="highlight_fuel" value={formData.highlight_fuel || ''} placeholder="e.g. 13.5" onChange={handleInputChange} />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bike Specific Sections */}
                                    {assetType === 'Bike' && (
                                        <div className="space-y-12">
                                            <div className="pt-10 border-t border-gray-100">
                                                <h4 className="text-lg font-bold text-gray-900 font-playfair mb-8">Specifications</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    <InputField label="Engine Capacity (cc)" name="engineCapacity" type="number" value={formData.engineCapacity} placeholder="e.g., 1000" onChange={handleInputChange} />
                                                    <InputField label="Mileage (km)" name="mileage" type="number" value={formData.mileage} placeholder="e.g., 5000" onChange={handleInputChange} />
                                                    <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Petrol', 'Electric', 'Hybrid']} onChange={handleInputChange} />
                                                    <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Manual', 'Automatic', 'Semi-Automatic']} onChange={handleInputChange} />
                                                    <InputField label="Color" name="color" value={formData.color} placeholder="e.g., Midnight Black" onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-100">
                                                <h4 className="text-lg font-bold text-gray-900 font-playfair mb-8">Condition</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    <SelectField label="New / Used" name="condition" value={formData.condition} options={['New', 'Used', 'Pre-Owned', 'Classic']} onChange={handleInputChange} />
                                                    <InputField label="Ownership Count" name="ownershipCount" type="number" value={formData.ownershipCount} placeholder="e.g., 1" onChange={handleInputChange} />
                                                    <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-100">
                                                <h4 className="text-lg font-bold text-gray-900 font-playfair mb-8">Documents</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration (RC)</label>
                                                        <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-white transition-all">
                                                            <FiFileText className="text-gray-400" />
                                                            <span className="text-xs font-bold text-gray-500">CHOOSE FILE</span>
                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />
                                                        </label>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Insurance</label>
                                                        <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-white transition-all">
                                                            <FiFileText className="text-gray-400" />
                                                            <span className="text-xs font-bold text-gray-500">CHOOSE FILE</span>
                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />
                                                        </label>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service History</label>
                                                        <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-white transition-all">
                                                            <FiFileText className="text-gray-400" />
                                                            <span className="text-xs font-bold text-gray-500">CHOOSE FILE</span>
                                                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Yacht Specific Sections */}
                                    {assetType === 'Yacht' && (
                                        <div className="space-y-12">
                                            {/* (Already implemented in previous steps, just making sure it stays inside description section as per current flow) */}
                                        </div>
                                    )}

                                    {/* Real Estate Specific Sections */}
                                    {assetType === 'Estate' && (
                                        <div className="space-y-12">
                                            {/* (Already implemented in previous steps) */}
                                            <div className="pt-10 border-t border-gray-100">
                                                <div className="flex items-center gap-2 mb-8">
                                                    <FiInfo className="text-[#D48D2A] text-xl" />
                                                    <h4 className="text-lg font-bold text-gray-900 font-playfair">Property Specifications</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    <InputField label="Year of Construction" name="year" type="number" value={formData.year} placeholder="e.g., 2020" onChange={handleInputChange} />
                                                    <SelectField label="Architecture Style" name="architectureStyle" value={formData.architectureStyle} options={['Modern', 'Contemporary', 'Classical', 'Colonial', 'Mediterranean', 'Industrial']} onChange={handleInputChange} />
                                                    <InputField label="Configuration" name="configuration" value={formData.configuration} placeholder="e.g., 5BR + Study + Media Room" onChange={handleInputChange} />
                                                    <SelectField label="Condition" name="condition" value={formData.condition} options={['Brand New', 'Excellent', 'Renovated', 'Good', 'Premium Shell']} onChange={handleInputChange} />
                                                    <SelectField label="Usage Status" name="usageStatus" value={formData.usageStatus} options={['Vacant', 'Owner Occupied', 'Tenanted', 'Short-term Rental']} onChange={handleInputChange} />
                                                </div>
                                                <div className="mt-8">
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">View Type</label>
                                                    <div className="flex flex-wrap gap-3">
                                                        {['Sea', 'City', 'Marina', 'Mountain', 'Golf', 'Park', 'River'].map(view => (
                                                            <button
                                                                key={view}
                                                                onClick={() => handleCheckboxToggle('viewTypes', view)}
                                                                className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${formData.viewTypes.includes(view) ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900'}`}
                                                            >
                                                                {view}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-100">
                                                <div className="flex items-center gap-2 mb-8">
                                                    <FiCheckCircle className="text-[#D48D2A] text-xl" />
                                                    <h4 className="text-lg font-bold text-gray-900 font-playfair">Materials & Finish</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} placeholder="e.g., Italian Marble, Hardwood" onChange={handleInputChange} />
                                                    <InputField label="Interior Color Theme" name="interiorColorTheme" value={formData.interiorColorTheme} placeholder="e.g., Neutral Tones, White & Gold" onChange={handleInputChange} />
                                                    <InputField label="Exterior Finish" name="exteriorFinish" value={formData.exteriorFinish} placeholder="e.g., Glass & Concrete" onChange={handleInputChange} />
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-100">
                                                <div className="flex items-center gap-2 mb-8">
                                                    <FiVideo className="text-[#D48D2A] text-xl" />
                                                    <h4 className="text-lg font-bold text-gray-900 font-playfair">Comfort & Tech</h4>
                                                </div>
                                                <div className="grid grid-cols-1 gap-8">
                                                    <InputField label="Climate Control" name="climateControl" value={formData.climateControl} placeholder="e.g., Central AC with Zoned Control" onChange={handleInputChange} />
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Smart Home Systems</label>
                                                        <div className="flex flex-wrap gap-3">
                                                            {['Lighting Control', 'Climate Control', 'Security System', 'Entertainment', 'Voice Assistant', 'Automated Blinds'].map(system => (
                                                                <button
                                                                    key={system}
                                                                    onClick={() => handleCheckboxToggle('smartHomeSystems', system)}
                                                                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${formData.smartHomeSystems.includes(system) ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-white'}`}
                                                                >
                                                                    {system}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-100">
                                                <div className="flex items-center gap-2 mb-8">
                                                    <FiMapPin className="text-[#D48D2A] text-xl" />
                                                    <h4 className="text-lg font-bold text-gray-900 font-playfair">Location Details</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <InputField label="Area / Neighborhood" name="areaNeighborhood" value={formData.areaNeighborhood} placeholder="e.g., Palm Jumeirah" onChange={handleInputChange} />
                                                    <InputField label="Latitude" name="latitude" value={formData.latitude} placeholder="e.g., 25.1124" onChange={handleInputChange} />
                                                    <InputField label="Longitude" name="longitude" value={formData.longitude} placeholder="e.g., 55.1390" onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Media Section - Common to all */}
                                    <div className="pt-10 border-t border-gray-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-8 font-playfair">Media</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Cover Image *</p>
                                                <label className="block w-full h-48 border-2 border-dashed border-gray-100 rounded-[2rem] hover:bg-white hover:border-[#D48D2A] transition-all cursor-pointer overflow-hidden group bg-white/50">
                                                    {coverImage ? (
                                                        <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full gap-2">
                                                            <FiImage className="text-3xl text-gray-200 group-hover:text-[#D48D2A] transition-colors" />
                                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Click to upload cover</span>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                                                </label>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Gallery Images (min 5)</p>
                                                <label className="block w-full h-48 border-2 border-dashed border-gray-100 rounded-[2rem] hover:bg-white hover:border-[#D48D2A] transition-all cursor-pointer overflow-hidden group bg-white/50">
                                                    <div className="flex flex-col items-center justify-center h-full gap-2">
                                                        <FiPlus className="text-3xl text-gray-200 group-hover:text-[#D48D2A] transition-colors" />
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{galleryImages.length} images added</span>
                                                    </div>
                                                    <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mt-10">
                                            <InputField label="Video URL (YouTube/Vimeo)" name="videoUrl" value={formData.videoUrl} placeholder="https://youtube.com/watch?v=..." onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Footer / Visibility - Common to all */}
                            <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                                        className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${formData.isPublic ? 'bg-[#D48D2A]' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${formData.isPublic ? 'left-8' : 'left-1'}`}></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Public Visibility</p>
                                        <p className="text-[11px] text-gray-400 font-medium">Make this listing visible on the public marketplace</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <button onClick={onClose} className="px-8 py-4 bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all flex-1 md:flex-none">Cancel</button>
                                    <button
                                        disabled={loading}
                                        onClick={handleSubmit}
                                        className="px-10 py-4 bg-[#D48D2A] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#B5751C] shadow-lg shadow-[#D48D2A]/30 transition-all flex-1 md:flex-none disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Asset'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
            `}} />
        </div>
    );
};

const InputField = ({ label, name, value, type = "text", placeholder, onChange }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all placeholder:text-gray-300"
        />
    </div>
);

const SelectField = ({ label, name, value, options, onChange }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all appearance-none cursor-pointer"
        >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default AddAssetModal;
