import React, { useState, useEffect } from 'react';
import {
    FiX, FiArrowLeft, FiImage, FiPlus,
    FiTrash2, FiVideo, FiCheck, FiChevronRight,
    FiCheckCircle, FiInfo, FiMapPin, FiFileText, FiUploadCloud
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import carIcon from '../../assets/icons/car_icon.png'
import estateIcon from '../../assets/icons/estate_icon.png'
import bikeIcon from '../../assets/icons/bike_icon.png'
import yachtIcon from '../../assets/icons/yacht_icon.png'
import otherassetIcon from '../../assets/icons/other_asset_icon.png'

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

        // Yacht Specific
        yachtName: '', builder: '', length: '', beam: '', draft: '',
        cruisingSpeed: '', guestCapacity: '', crewCapacity: '',
        hullMaterial: '',

        // Real Estate Specific
        propertyName: '', propertyType: '', country: '', city: '', address: '',
        builtUpArea: '', landArea: '', bedrooms: '', bathrooms: '', floors: '',
        furnishingStatus: '', architectureStyle: '', configuration: '',
        interiorColorTheme: '', exteriorFinish: '',
        climateControl: '', usageStatus: '',
        areaNeighborhood: '', latitude: '', longitude: '',
        amenities: [], smartHomeSystems: [], viewTypes: [],

        // Bike Specific
        brand: '', engineCapacity: '', color: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [coverImage, setCoverImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [documents, setDocuments] = useState([]); // General docs
    const [registrationRC, setRegistrationRC] = useState(null);
    const [insurance, setInsurance] = useState(null);
    const [serviceHistory, setServiceHistory] = useState(null);

    const handleRemoveFile = (index, type) => {
        if (type === 'cover') setCoverImage(null);
        else if (type === 'gallery') setGalleryImages(galleryImages.filter((_, i) => i !== index));
        else if (type === 'document') setDocuments(documents.filter((_, i) => i !== index));
        else if (type === 'registrationRC') setRegistrationRC(null);
        else if (type === 'insurance') setInsurance(null);
        else if (type === 'serviceHistory') setServiceHistory(null);
    };

    const handleFileUpload = (e, type) => {
        const files = Array.from(e.target.files);

        // Image validation
        if (type === 'cover' || type === 'gallery') {
            const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
            const invalidFiles = files.filter(f => !allowed.includes(f.type));
            if (invalidFiles.length > 0) {
                alert('Only .jpg, .png and .jpeg are allowed for images');
                return;
            }
        }

        // PDF validation for bike specific docs
        if (['registrationRC', 'insurance', 'serviceHistory'].includes(type)) {
            if (files[0] && files[0].type !== 'application/pdf') {
                alert('Only PDF files are allowed for these documents.');
                return;
            }
        }

        if (type === 'cover') setCoverImage(files[0]);
        else if (type === 'gallery') setGalleryImages(prev => [...prev, ...files].slice(0, 10));
        else if (type === 'document') setDocuments(prev => [...prev, ...files].slice(0, 5));
        else if (type === 'registrationRC') setRegistrationRC(files[0]);
        else if (type === 'insurance') setInsurance(files[0]);
        else if (type === 'serviceHistory') setServiceHistory(files[0]);
    };

    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            setAssetType(null);
            setCoverImage(null);
            setGalleryImages([]);
            setExistingImages([]);
            setDocuments([]);
            setRegistrationRC(null);
            setInsurance(null);
            setServiceHistory(null);
            setFormData(initialFormState);
        } else if (editData) {
            setStep(1);

            // Map model or category string to assetType
            let type = 'Car';
            const model = editData.itemModel || '';
            const cat = editData.category || '';

            // Check for exact category match (e.g., 'CarAsset', 'YachtAsset', 'EstateAsset', 'BikeAsset')
            if (cat === 'CarAsset' || model === 'CarAsset') type = 'Car';
            else if (cat === 'YachtAsset' || model === 'YachtAsset') type = 'Yacht';
            else if (cat === 'EstateAsset' || model === 'EstateAsset') type = 'Estate';
            else if (cat === 'BikeAsset' || model === 'BikeAsset') type = 'Bike';
            // Fallback to string contains check for backwards compatibility
            else if (model.includes('Car') || cat.includes('car')) type = 'Car';
            else if (model.includes('Bike') || cat.includes('bike')) type = 'Bike';
            else if (model.includes('Yacht') || cat.includes('yacht')) type = 'Yacht';
            else if (model.includes('Estate') || cat.includes('estate')) type = 'Estate';

            setAssetType(type);
            setExistingImages(editData.images || []);
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
                configuration: spec.configuration || '',
                cylinderCapacity: spec.cylinderCapacity || '',
                interiorMaterial: spec.interiorMaterial || '',
                countryOfFirstDelivery: spec.countryOfFirstDelivery || '',
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

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();

        // Sync highlights to main fields to ensure backend keySpecs are populated
        if (assetType === 'Car') {
            if (!formData.horsepower) formData.horsepower = formData.highlight_hp;
            if (!formData.topSpeed) formData.topSpeed = formData.highlight_speed;
            if (!formData.engineType) formData.engineType = formData.highlight_engine_type;
        }

        // Construct Fixed Highlights based on Asset Type (Validation Removed)
        let constructedHighlights = [];
        if (assetType === 'Car') {
            constructedHighlights = [
                formData.highlight_speed ? `${formData.highlight_speed} mph` : '',
                formData.highlight_engine_type ? `${formData.highlight_engine_type}` : '',
                formData.highlight_hp ? `${formData.highlight_hp} hp` : ''
            ].filter(Boolean);
        } else if (assetType === 'Yacht') {
            constructedHighlights = [
                formData.highlight_length ? `${formData.highlight_length} M length` : '',
                formData.highlight_baths ? `Bathrooms: ${formData.highlight_baths}` : '',
                formData.highlight_fuel ? `${formData.highlight_fuel} L fuel capacity` : '',
                formData.highlight_engine_hp ? `${formData.highlight_engine_hp} HP total` : '',
                formData.highlight_beds ? `Bedrooms: ${formData.highlight_beds}` : '',
                formData.highlight_speed ? `TopSpeed: ${formData.highlight_speed} knots` : ''
            ].filter(Boolean);
        } else if (assetType === 'Estate') {
            constructedHighlights = [
                formData.highlight_area ? `Land Area: ${formData.highlight_area} Acres` : '',
                formData.highlight_baths ? `Bathrooms: ${formData.highlight_baths}` : '',
                formData.highlight_garage ? `Garage: ${formData.highlight_garage} Cars` : '',
                formData.highlight_built_area ? `Built Area: ${formData.highlight_built_area} Sq Ft` : '',
                formData.highlight_beds ? `Bedrooms: ${formData.highlight_beds}` : '',
                formData.highlight_floors ? `Floors: ${formData.highlight_floors}` : ''
            ].filter(Boolean);
        } else if (assetType === 'Bike') {
            constructedHighlights = [
                formData.highlight_cc ? `${formData.highlight_cc} cc` : '',
                formData.highlight_speed ? `${formData.highlight_speed} km/h` : '',
                formData.highlight_fuel ? `${formData.highlight_fuel} liters` : ''
            ].filter(Boolean);
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

        // Bike Specific Documents
        if (assetType === 'Bike') {
            if (registrationRC) data.append('registrationRC', registrationRC);
            if (insurance) data.append('insurance', insurance);
            if (serviceHistory) data.append('serviceHistory', serviceHistory);
        }

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
                onCreated(result, !!editData);
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
        { id: 'Car', label: 'Car', icon: carIcon },
        { id: 'Yacht', label: 'Yacht', icon: yachtIcon },
        { id: 'Estate', label: 'Real Estate', icon: estateIcon },
        { id: 'Bike', label: 'Bike', icon: bikeIcon },
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
                                    className="group bg-white border border-gray-100 p-8 rounded-[2rem] hover:border-[#D48D2A] hover:bg-[#F2E8DB]/20 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between min-h-[260px]"
                                >
                                    <div className="flex-1 w-full flex justify-center items-center grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 duration-500">
                                        <img className="max-w-[140px] max-h-[100px] object-contain" src={type.icon} alt="icon" title={type.label} />
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 font-playfair mt-6">{type.label}</span>
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
                                    <div className="w-16 h-16 bg-[#FDF8F0] border border-[#F2E8DB] rounded-2xl flex items-center justify-center text-3xl shadow-sm p-1">
                                        <img className='w-fit object-contain' src={assetType === 'Car' ? carIcon : assetType === 'Yacht' ? yachtIcon : assetType === 'Estate' ? estateIcon : assetType === 'Bike' ? bikeIcon : otherassetIcon} alt={assetType} />
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
                                        <InputField label={formData.type === 'Rent' ? "Price per Day ($)" : "Price ($)"} name="price" type="number" value={formData.price} placeholder="625000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <LocationInputField label="Location" name="location" value={formData.location} placeholder="Beverly Hills, CA" onChange={handleInputChange} />
                                        <InputField label="Mileage" name="mileage" type="number" value={formData.mileage} placeholder="1500" onChange={handleInputChange} />
                                        <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Gasoline', 'Diesel', 'Hybrid', 'Electric']} onChange={handleInputChange} />
                                        <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Automatic', 'Manual', 'PDK', 'F1']} onChange={handleInputChange} />
                                        <InputField label="Engine" name="engine" value={formData.engine} placeholder="e.g., 4.0L V8 Twin-Turbo" onChange={handleInputChange} />
                                        <InputField label="Exterior Color" name="exteriorColor" value={formData.exteriorColor} placeholder="e.g., Rosso Corsa" onChange={handleInputChange} />
                                        <InputField label="Interior Color" name="interiorColor" value={formData.interiorColor} placeholder="e.g., Black Leather" onChange={handleInputChange} />
                                        <SelectField label="Condition" name="condition" value={formData.condition} options={['New', 'Used', 'Classic', 'Restored']} onChange={handleInputChange} />
                                        <InputField label="Ownership Count" name="ownershipCount" type="number" value={formData.ownershipCount} onChange={handleInputChange} />
                                        <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} />
                                        <InputField label="Configuration" name="configuration" value={formData.configuration} placeholder="e.g., LHD" onChange={handleInputChange} />
                                        <InputField label="Cylinder Capacity" name="cylinderCapacity" type="number" value={formData.cylinderCapacity} placeholder="e.g., 3990" onChange={handleInputChange} />
                                        <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} placeholder="e.g., Alcantara" onChange={handleInputChange} />
                                        <InputField label="Country of First Delivery" name="countryOfFirstDelivery" value={formData.countryOfFirstDelivery} placeholder="e.g., Germany" onChange={handleInputChange} />
                                    </>
                                )}
                                {assetType === 'Yacht' && (
                                    <>
                                        <InputField label="Yacht Name" name="yachtName" value={formData.yachtName} placeholder="e.g., Sea Legend" onChange={handleInputChange} />
                                        <InputField label="Builder" name="builder" value={formData.builder} placeholder="e.g., Azimut" onChange={handleInputChange} />
                                        <InputField label="Model" name="model" value={formData.model} placeholder="e.g., Grande 32 Metri" onChange={handleInputChange} />
                                        <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                        <InputField label={formData.type === 'Rent' ? "Price per Day ($)" : "Price ($)"} name="price" type="number" value={formData.price} placeholder="8500000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <LocationInputField label="Location / Marina" name="location" value={formData.location} placeholder="e.g., Monaco, Port Hercules" onChange={handleInputChange} />
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
                                        <InputField label={formData.type === 'Rent' ? "Price per Day ($)" : "Price ($)"} name="price" type="number" value={formData.price} placeholder="28000000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <LocationInputField label="Location" name="location" value={formData.location} placeholder="e.g., Miami, FL" onChange={handleInputChange} />
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
                                        <InputField label={formData.type === 'Rent' ? "Price per Day ($)" : "Price ($)"} name="price" type="number" value={formData.price} placeholder="28000" onChange={handleInputChange} />
                                        <SelectField label="Listing Type" name="type" value={formData.type} options={['Sale', 'Rent']} onChange={handleInputChange} />
                                        <LocationInputField label="Location" name="location" value={formData.location} placeholder="e.g., Miami, FL" onChange={handleInputChange} />
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

                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 font-playfair">Key Highlights</h4>
                                                <p className="text-xs text-gray-400 italic">These specific details will be highlighted on your listing</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Render Fixed Highlights based on Asset Type */}
                                            {assetType === 'Car' && (
                                                <>
                                                    <InputField label="Top Speed (mph) *" name="highlight_speed" value={formData.highlight_speed || ''} placeholder="e.g. 211" onChange={handleInputChange} />
                                                    <InputField label="Engine Type *" name="highlight_engine_type" value={formData.highlight_engine_type || ''} placeholder="e.g. V12" onChange={handleInputChange} />
                                                    <InputField label="Horsepower (hp) *" name="highlight_hp" value={formData.highlight_hp || ''} placeholder="e.g. 789" onChange={handleInputChange} />
                                                </>
                                            )}
                                            {assetType === 'Yacht' && (
                                                <>
                                                    <InputField label="Length (M) *" name="highlight_length" value={formData.highlight_length || ''} placeholder="e.g. 27" onChange={handleInputChange} />
                                                    <InputField label="Bathrooms *" name="highlight_baths" value={formData.highlight_baths || ''} placeholder="e.g. 6" onChange={handleInputChange} />
                                                    <InputField label="Fuel Capacity (L) *" name="highlight_fuel" value={formData.highlight_fuel || ''} placeholder="e.g. 9500" onChange={handleInputChange} />
                                                    <InputField label="Engine (HP total) *" name="highlight_engine_hp" value={formData.highlight_engine_hp || ''} placeholder="e.g. 3800" onChange={handleInputChange} />
                                                    <InputField label="Bedrooms *" name="highlight_beds" value={formData.highlight_beds || ''} placeholder="e.g. 7" onChange={handleInputChange} />
                                                    <InputField label="Top Speed (knots) *" name="highlight_speed" value={formData.highlight_speed || ''} placeholder="e.g. 28" onChange={handleInputChange} />
                                                </>
                                            )}
                                            {assetType === 'Estate' && (
                                                <>
                                                    <InputField label="Land Area (Acres) *" name="highlight_area" value={formData.highlight_area || ''} placeholder="e.g. 0.5" onChange={handleInputChange} />
                                                    <InputField label="Bathrooms *" name="highlight_baths" value={formData.highlight_baths || ''} placeholder="e.g. 6" onChange={handleInputChange} />
                                                    <InputField label="Garage (Cars) *" name="highlight_garage" value={formData.highlight_garage || ''} placeholder="e.g. 3" onChange={handleInputChange} />
                                                    <InputField label="Built Area (Sq Ft) *" name="highlight_built_area" value={formData.highlight_built_area || ''} placeholder="e.g. 6500" onChange={handleInputChange} />
                                                    <InputField label="Bedrooms *" name="highlight_beds" value={formData.highlight_beds || ''} placeholder="e.g. 5" onChange={handleInputChange} />
                                                    <InputField label="Floors *" name="highlight_floors" value={formData.highlight_floors || ''} placeholder="e.g. 3" onChange={handleInputChange} />
                                                </>
                                            )}
                                            {assetType === 'Bike' && (
                                                <>
                                                    <InputField label="Engine (cc) *" name="highlight_cc" value={formData.highlight_cc || ''} placeholder="e.g. 803" onChange={handleInputChange} />
                                                    <InputField label="Top Speed (km/h) *" name="highlight_speed" value={formData.highlight_speed || ''} placeholder="e.g. 175" onChange={handleInputChange} />
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
                                                <h4 className="text-lg font-bold text-gray-900 font-playfair mb-8">Documents (PDF Only)</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration (RC)</label>
                                                        <label className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${registrationRC ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                                                            <FiFileText className={registrationRC ? 'text-emerald-500' : 'text-gray-400'} />
                                                            <span className="text-xs font-bold text-gray-500 truncate">{registrationRC ? registrationRC.name : 'CHOOSE PDF'}</span>
                                                            <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'registrationRC')} />
                                                        </label>
                                                        {registrationRC && <button onClick={() => handleRemoveFile(null, 'registrationRC')} className="text-[10px] text-red-500 font-bold hover:underline">Remove</button>}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Insurance</label>
                                                        <label className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${insurance ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                                                            <FiFileText className={insurance ? 'text-emerald-500' : 'text-gray-400'} />
                                                            <span className="text-xs font-bold text-gray-500 truncate">{insurance ? insurance.name : 'CHOOSE PDF'}</span>
                                                            <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'insurance')} />
                                                        </label>
                                                        {insurance && <button onClick={() => handleRemoveFile(null, 'insurance')} className="text-[10px] text-red-500 font-bold hover:underline">Remove</button>}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service History</label>
                                                        <label className={`flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all ${serviceHistory ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:bg-white'}`}>
                                                            <FiFileText className={serviceHistory ? 'text-emerald-500' : 'text-gray-400'} />
                                                            <span className="text-xs font-bold text-gray-500 truncate">{serviceHistory ? serviceHistory.name : 'CHOOSE PDF'}</span>
                                                            <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'serviceHistory')} />
                                                        </label>
                                                        {serviceHistory && <button onClick={() => handleRemoveFile(null, 'serviceHistory')} className="text-[10px] text-red-500 font-bold hover:underline">Remove</button>}
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


                                        </div>
                                    )}

                                    {/* Media Section - Common to all */}
                                    <div className="pt-10 border-t border-gray-100 space-y-10">
                                        <h3 className="text-xl font-bold text-gray-900 mb-8 font-playfair">Media</h3>

                                        {/* Show existing images if editing */}
                                        {editData && existingImages.length > 0 && (
                                            <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100">
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-4">Current Asset Images</label>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    {existingImages.map((img, idx) => (
                                                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-amber-200 group shadow-sm">
                                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Existing</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-amber-700 mt-4 font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <FiInfo className="text-sm" />
                                                    Uploading any new photo (Cover or Gallery) will replace all existing images.
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            {/* Cover Image */}
                                            <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#D48D2A]">
                                                        <FiImage />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">Cover Image</h4>
                                                        <p className="text-xs text-gray-400">Primary display image for this asset</p>
                                                    </div>
                                                </div>

                                                <label className="block">
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                                                    <div className={`border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all text-center ${coverImage ? 'border-emerald-200 bg-white' : 'border-gray-200 bg-white hover:border-[#D48D2A]'}`}>
                                                        {coverImage ? (
                                                            <div className="relative group">
                                                                <img src={URL.createObjectURL(coverImage)} className="w-full h-40 object-cover rounded-xl" />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                                    <p className="text-white text-xs font-bold uppercase tracking-widest">Click to Replace</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                                <FiUploadCloud className="text-3xl" />
                                                                <p className="text-xs font-bold uppercase tracking-widest">Select Cover Photo</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>

                                                {coverImage && (
                                                    <div className="mt-4 flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                            <FiCheck />
                                                        </div>
                                                        <p className="text-xs font-bold text-gray-700 truncate flex-1">{coverImage.name}</p>
                                                        <button type="button" onClick={() => handleRemoveFile(null, 'cover')} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all">
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Gallery Images */}
                                            <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#D48D2A]">
                                                        <FiPlus />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">Gallery</h4>
                                                        <p className="text-xs text-gray-400">Additional interior and detail shots (Max 10)</p>
                                                    </div>
                                                </div>

                                                <label className="block">
                                                    <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} />
                                                    <div className="border-2 border-dashed border-gray-200 bg-white rounded-2xl p-8 cursor-pointer transition-all hover:border-[#D48D2A] text-center">
                                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                                            <FiUploadCloud className="text-3xl" />
                                                            <p className="text-xs font-bold uppercase tracking-widest">Add Gallery Photos</p>
                                                        </div>
                                                    </div>
                                                </label>

                                                <div className="mt-6 grid grid-cols-2 gap-3">
                                                    {galleryImages.map((file, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                                                            <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                                <FiCheck className="text-[10px]" />
                                                            </div>
                                                            <p className="text-[10px] font-bold text-gray-700 truncate flex-1">{file.name}</p>
                                                            <button type="button" onClick={() => handleRemoveFile(idx, 'gallery')} className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <FiX className="text-sm" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
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

const LocationInputField = ({ label, name, value, placeholder, onChange }) => {
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
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={(e) => {
                    onChange(e);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all placeholder:text-gray-300"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-2 shadow-2xl left-0 p-2 overflow-hidden max-h-64 overflow-y-auto">
                    {suggestions.map((s, idx) => {
                        const labelText = typeof s === 'string' ? s : s.value;
                        return (
                            <li
                                key={idx}
                                className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 text-sm font-medium transition-colors"
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

export default AddAssetModal;
