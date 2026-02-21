import React, { useState } from 'react';
import { FiX, FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const CreateListingModal = ({ isOpen, onClose, onCreated, editData }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: editData?.title || '',
        price: editData?.price || '',
        category: editData?.category || (editData?.itemModel === 'CarAsset' ? 'Car' : editData?.itemModel === 'EstateAsset' ? 'Estate' : editData?.itemModel === 'BikeAsset' ? 'Bike' : editData?.itemModel === 'YachtAsset' ? 'Yacht' : 'Car'),
        type: editData?.type || 'Sale',
        location: editData?.location || '',
        description: editData?.description || '',
        isPublic: editData?.status === 'Active' ? true : true, // Default to true

        // Car/Bike Common
        make: editData?.brand || (editData?.specification?.brand) || '',
        model: editData?.specification?.model || '',
        variant: editData?.specification?.variant || '',
        year: editData?.specification?.yearOfConstruction || editData?.specification?.year || new Date().getFullYear(),
        mileage: editData?.specification?.mileage || editData?.specification?.mileageKM || '',
        fuelType: editData?.specification?.fuel || editData?.specification?.fuelType || '',
        transmission: editData?.specification?.transmission || '',
        exteriorColor: editData?.specification?.exteriorColor || '',
        interiorColor: editData?.specification?.interiorColor || '',
        condition: editData?.specification?.condition || '',
        accidentHistory: editData?.specification?.accidentHistory || '',

        // Car Specific
        horsepower: editData?.specification?.power || '',
        cylinderCapacity: editData?.specification?.cylinderCapacity || '',
        topSpeed: editData?.specification?.topSpeed || '',
        steering: editData?.specification?.steering || '',
        driveType: editData?.specification?.drive || '',
        interiorMaterial: editData?.specification?.interiorMaterial || '',
        manufacturerColorCode: editData?.specification?.manufacturerColorCode || '',
        matchingNumbers: editData?.specification?.matchingNumbers || '',
        accidentFree: editData?.specification?.accidentFree || '',
        countryOfFirstDelivery: editData?.specification?.countryOfFirstDelivery || '',
        numberOfOwners: editData?.specification?.numberOfOwners || '1',
        currentCarLocation: editData?.specification?.carLocation || '',

        // Bike Specific
        brand: editData?.brand || editData?.specification?.brand || '',
        engineCapacity: editData?.specification?.engineCapacityCC || editData?.specification?.engineCapacity || '',
        color: editData?.specification?.color || '',
        ownershipCount: editData?.specification?.ownershipCount || '1',

        // Yacht Specific
        yachtName: editData?.title || '',
        builder: editData?.builder || editData?.specification?.builder || '',
        length: editData?.specification?.length || '',
        beam: editData?.specification?.beam || '',
        draft: editData?.specification?.draft || '',
        cruisingSpeed: editData?.specification?.cruisingSpeed || '',
        guestCapacity: editData?.specification?.guestCapacity || '',
        crewCapacity: editData?.specification?.crewCapacity || '',
        engineType: editData?.specification?.engineType || '',
        hullMaterial: editData?.specification?.hullMaterial || '',

        // Estate Specific
        propertyName: editData?.title || editData?.propertyName || '',
        propertyType: editData?.keySpecifications?.propertyType || editData?.specification?.propertyType || '',
        architectureStyle: editData?.specification?.architectureStyle || '',
        builtUpArea: editData?.specification?.builtUpArea || '',
        landArea: editData?.specification?.landArea || '',
        bedrooms: editData?.specification?.bedrooms || '',
        bathrooms: editData?.specification?.bathrooms || '',
        floors: editData?.specification?.floors || '',
        furnishingStatus: editData?.specification?.furnishingStatus || '',
        configuration: editData?.specification?.configuration || '',
        interiorColorTheme: editData?.specification?.interiorColorTheme || '',
        exteriorFinish: editData?.specification?.exteriorFinish || '',
        climateControl: editData?.specification?.climateControl || '',
        usageStatus: editData?.specification?.usageStatus || '',
        country: editData?.specification?.country || '',
        city: editData?.specification?.city || '',
        address: editData?.specification?.address || '',
        areaNeighborhood: editData?.specification?.areaNeighborhood || '',
        latitude: editData?.specification?.latitude || '',
        longitude: editData?.specification?.longitude || '',

        amenities: editData?.amenities || [],
        smartHomeSystems: editData?.smartHomeSystems || [],
        viewTypes: editData?.viewTypes || [],
    });

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState(editData?.images || []);
    const [registrationRC, setRegistrationRC] = useState(null);
    const [insurance, setInsurance] = useState(null);
    const [serviceHistory, setServiceHistory] = useState(null);

    const handleRemoveFile = (index, type) => {
        if (type === 'images') {
            setImages(images.filter((_, i) => i !== index));
        } else if (type === 'registrationRC') setRegistrationRC(null);
        else if (type === 'insurance') setInsurance(null);
        else if (type === 'serviceHistory') setServiceHistory(null);
    };

    // Reset form when editData changes or modal closes/opens
    React.useEffect(() => {
        if (!isOpen) {
            setImages([]);
            setRegistrationRC(null);
            setInsurance(null);
            setServiceHistory(null);
        }
        if (editData) {
            setExistingImages(editData.images || []);
            const spec = editData.specification || {};
            const keySpec = editData.keySpecifications || {};
            setFormData({
                title: editData.title || '',
                price: editData.price || '',
                category: editData.itemModel === 'CarAsset' ? 'Car' : editData.itemModel === 'EstateAsset' ? 'Estate' : editData.itemModel === 'BikeAsset' ? 'Bike' : editData.itemModel === 'YachtAsset' ? 'Yacht' : 'Car',
                type: editData.type || 'Sale',
                location: editData.location || '',
                description: editData.description || '',
                isPublic: editData.status === 'Active',

                make: editData.brand || spec.brand || '',
                model: spec.model || '',
                variant: spec.variant || '',
                year: spec.yearOfConstruction || spec.year || new Date().getFullYear(),
                mileage: spec.mileage || spec.mileageKM || '',
                fuelType: spec.fuel || spec.fuelType || '',
                transmission: spec.transmission || '',
                exteriorColor: spec.exteriorColor || '',
                interiorColor: spec.interiorColor || '',
                condition: spec.condition || '',
                accidentHistory: spec.accidentHistory || '',

                horsepower: spec.power || '',
                cylinderCapacity: spec.cylinderCapacity || '',
                topSpeed: spec.topSpeed || '',
                steering: spec.steering || '',
                driveType: spec.drive || '',
                interiorMaterial: spec.interiorMaterial || '',
                manufacturerColorCode: spec.manufacturerColorCode || '',
                matchingNumbers: spec.matchingNumbers || '',
                accidentFree: spec.accidentFree || '',
                countryOfFirstDelivery: spec.countryOfFirstDelivery || '',
                numberOfOwners: spec.numberOfOwners || '1',
                currentCarLocation: spec.carLocation || '',

                brand: editData.brand || spec.brand || '',
                engineCapacity: spec.engineCapacityCC || spec.engineCapacity || '',
                color: spec.color || '',
                ownershipCount: spec.ownershipCount || '1',

                yachtName: editData.title || '',
                builder: editData.builder || spec.builder || '',
                length: spec.length || '',
                beam: spec.beam || '',
                draft: spec.draft || '',
                cruisingSpeed: spec.cruisingSpeed || '',
                guestCapacity: spec.guestCapacity || '',
                crewCapacity: spec.crewCapacity || '',
                engineType: spec.engineType || '',
                hullMaterial: spec.hullMaterial || '',

                propertyName: editData.title || editData.propertyName || '',
                propertyType: keySpec.propertyType || spec.propertyType || '',
                architectureStyle: spec.architectureStyle || '',
                builtUpArea: spec.builtUpArea || '',
                landArea: spec.landArea || '',
                bedrooms: spec.bedrooms || '',
                bathrooms: spec.bathrooms || '',
                floors: spec.floors || '',
                furnishingStatus: spec.furnishingStatus || '',
                configuration: spec.configuration || '',
                interiorColorTheme: spec.interiorColorTheme || '',
                exteriorFinish: spec.exteriorFinish || '',
                climateControl: spec.climateControl || '',
                usageStatus: spec.usageStatus || '',
                country: spec.country || '',
                city: spec.city || '',
                address: spec.address || '',
                areaNeighborhood: spec.areaNeighborhood || '',
                latitude: spec.latitude || '',
                longitude: spec.longitude || '',

                amenities: editData.amenities || [],
                smartHomeSystems: editData.smartHomeSystems || [],
                viewTypes: editData.viewTypes || [],
            });
        } else {
            setFormData({
                title: '', price: '', category: 'Car', type: 'Sale', location: '', description: '', isPublic: true,
                make: '', model: '', variant: '', year: new Date().getFullYear(),
                mileage: '', fuelType: '', transmission: '', exteriorColor: '', interiorColor: '',
                condition: '', accidentHistory: '', horsepower: '', cylinderCapacity: '', topSpeed: '',
                steering: '', driveType: '', interiorMaterial: '', manufacturerColorCode: '',
                matchingNumbers: '', accidentFree: '', countryOfFirstDelivery: '',
                numberOfOwners: '1', currentCarLocation: '',
                brand: '', engineCapacity: '', color: '', ownershipCount: '1',
                yachtName: '', builder: '', length: '', beam: '', draft: '', cruisingSpeed: '',
                guestCapacity: '', crewCapacity: '', engineType: '', hullMaterial: '',
                propertyName: '', propertyType: '', architectureStyle: '', builtUpArea: '',
                landArea: '', bedrooms: '', bathrooms: '', floors: '', furnishingStatus: '',
                configuration: '', interiorColorTheme: '', exteriorFinish: '',
                climateControl: '', usageStatus: '', country: '', city: '', address: '',
                areaNeighborhood: '', latitude: '', longitude: '',
                amenities: [], smartHomeSystems: [], viewTypes: []
            });
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (type === 'images') {
            setImages(prev => [...prev, ...files].slice(0, 5));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construct Highlights
        let constructedHighlights = [];
        if (formData.category === 'Car') {
            constructedHighlights = [
                formData.horsepower ? `${formData.horsepower} hp` : '',
                formData.mileage ? `${formData.mileage} mi` : '',
                formData.cylinderCapacity ? `${formData.cylinderCapacity} L` : ''
            ].filter(Boolean);
        } else if (formData.category === 'Yacht') {
            constructedHighlights = [
                formData.length ? `${formData.length} M length` : '',
                formData.bathrooms ? `Bathrooms: ${formData.bathrooms}` : '',
                formData.engineType ? `Engine: ${formData.engineType}` : '',
                formData.cruisingSpeed ? `Cruising Speed: ${formData.cruisingSpeed} knots` : ''
            ].filter(Boolean);
        } else if (formData.category === 'Estate') {
            constructedHighlights = [
                formData.landArea ? `Land Area: ${formData.landArea} Sq Ft` : '',
                formData.bathrooms ? `Bathrooms: ${formData.bathrooms}` : '',
                formData.bedrooms ? `Bedrooms: ${formData.bedrooms}` : '',
                formData.builtUpArea ? `Built Area: ${formData.builtUpArea} Sq Ft` : ''
            ].filter(Boolean);
        } else if (formData.category === 'Bike') {
            constructedHighlights = [
                formData.engineCapacity ? `${formData.engineCapacity} cc` : '',
                formData.mileage ? `${formData.mileage} km` : ''
            ].filter(Boolean);
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (['amenities', 'smartHomeSystems', 'viewTypes'].includes(key)) {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        });

        data.append('highlights', JSON.stringify(constructedHighlights));

        images.forEach(file => data.append('images', file));

        // Bike Specific Documents
        if (formData.category === 'Bike') {
            if (registrationRC) data.append('registrationRC', registrationRC);
            if (insurance) data.append('insurance', insurance);
            if (serviceHistory) data.append('serviceHistory', serviceHistory);
        }

        try {
            const url = editData
                ? `/api/listings/${editData._id}`
                : '/api/listings/create';

            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                onCreated(result, !!editData);
                onClose();
            } else {
                const errData = await response.json();
                alert(errData.error || `Failed to ${editData ? 'update' : 'create'} listing`);
            }
        } catch (error) {
            console.error(error);
            alert(`Error ${editData ? 'updating' : 'creating'} listing`);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold playfair-display">{editData ? 'Edit Listing' : 'Create New Listing'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Title</label>
                            <input type="text" name="title" value={formData.title} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Price ($)</label>
                            <input type="number" name="price" value={formData.price} required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                            <select name="category" value={formData.category} disabled={!!editData} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black disabled:opacity-50" onChange={handleInputChange}>
                                <option value="Car">Car</option>
                                <option value="Bike">Bike</option>
                                <option value="Yacht">Yacht</option>
                                <option value="Estate">Real Estate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Listing Type</label>
                            <select name="type" value={formData.type} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black" onChange={handleInputChange}>
                                <option value="Sale">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                        <LocationInputField value={formData.location} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                        <textarea name="description" value={formData.description} rows="3" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange}></textarea>
                    </div>

                    {/* Category Specific Fields */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">{formData.category} Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.category === 'Car' && (
                                <>
                                    <InputField label="Make" name="make" value={formData.make} onChange={handleInputChange} />
                                    <InputField label="Model" name="model" value={formData.model} onChange={handleInputChange} />
                                    <InputField label="Variant" name="variant" value={formData.variant} onChange={handleInputChange} />
                                    <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                    <InputField label="Mileage" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} />
                                    <InputField label="Horsepower" name="horsepower" value={formData.horsepower} onChange={handleInputChange} />
                                    <InputField label="Engine Capacity (L)" name="cylinderCapacity" value={formData.cylinderCapacity} onChange={handleInputChange} />
                                    <InputField label="Top Speed" name="topSpeed" value={formData.topSpeed} onChange={handleInputChange} />
                                    <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Gasoline', 'Diesel', 'Hybrid', 'Electric']} onChange={handleInputChange} />
                                    <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Automatic', 'Manual', 'PDK', 'F1']} onChange={handleInputChange} />
                                    <SelectField label="Drive Type" name="driveType" value={formData.driveType} options={['AWD', 'RWD', 'FWD', '4WD']} onChange={handleInputChange} />
                                    <InputField label="Exterior Color" name="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} />
                                    <InputField label="Interior Color" name="interiorColor" value={formData.interiorColor} onChange={handleInputChange} />
                                    <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} onChange={handleInputChange} />
                                    <SelectField label="Condition" name="condition" value={formData.condition} options={['New', 'Used', 'Classic', 'Restored']} onChange={handleInputChange} />
                                    <InputField label="Ownership Count" name="numberOfOwners" type="number" value={formData.numberOfOwners} onChange={handleInputChange} />
                                    <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} />
                                </>
                            )}

                            {formData.category === 'Bike' && (
                                <>
                                    <InputField label="Brand" name="brand" value={formData.brand} onChange={handleInputChange} />
                                    <InputField label="Model" name="model" value={formData.model} onChange={handleInputChange} />
                                    <InputField label="Variant" name="variant" value={formData.variant} onChange={handleInputChange} />
                                    <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                    <InputField label="Engine Capacity (cc)" name="engineCapacity" type="number" value={formData.engineCapacity} onChange={handleInputChange} />
                                    <InputField label="Mileage" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} />
                                    <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Petrol', 'Electric', 'Hybrid']} onChange={handleInputChange} />
                                    <SelectField label="Transmission" name="transmission" value={formData.transmission} options={['Manual', 'Automatic', 'Semi-Automatic']} onChange={handleInputChange} />
                                    <InputField label="Color" name="color" value={formData.color} onChange={handleInputChange} />
                                    <SelectField label="Condition" name="condition" value={formData.condition} options={['New', 'Used', 'Classic']} onChange={handleInputChange} />
                                    <InputField label="Ownership Count" name="ownershipCount" type="number" value={formData.ownershipCount} onChange={handleInputChange} />
                                    <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} options={['None', 'Minor', 'Repaired']} onChange={handleInputChange} />

                                    {/* Bike Docs */}
                                    <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Documents (PDF Only)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Registration (RC)</label>
                                                <input type="file" accept=".pdf" className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                    onChange={(e) => setRegistrationRC(e.target.files[0])} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Insurance</label>
                                                <input type="file" accept=".pdf" className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                    onChange={(e) => setInsurance(e.target.files[0])} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Service History</label>
                                                <input type="file" accept=".pdf" className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                                                    onChange={(e) => setServiceHistory(e.target.files[0])} />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {formData.category === 'Yacht' && (
                                <>
                                    <InputField label="Yacht Name" name="yachtName" value={formData.yachtName} onChange={handleInputChange} />
                                    <InputField label="Builder" name="builder" value={formData.builder} onChange={handleInputChange} />
                                    <InputField label="Model" name="model" value={formData.model} onChange={handleInputChange} />
                                    <InputField label="Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                    <InputField label="Length (m)" name="length" type="number" value={formData.length} onChange={handleInputChange} />
                                    <InputField label="Beam (m)" name="beam" type="number" value={formData.beam} onChange={handleInputChange} />
                                    <InputField label="Draft (m)" name="draft" type="number" value={formData.draft} onChange={handleInputChange} />
                                    <InputField label="Engine Type" name="engineType" value={formData.engineType} onChange={handleInputChange} />
                                    <InputField label="Cruising Speed (knots)" name="cruisingSpeed" type="number" value={formData.cruisingSpeed} onChange={handleInputChange} />
                                    <InputField label="Guest Capacity" name="guestCapacity" type="number" value={formData.guestCapacity} onChange={handleInputChange} />
                                    <InputField label="Crew Capacity" name="crewCapacity" type="number" value={formData.crewCapacity} onChange={handleInputChange} />
                                    <SelectField label="Fuel Type" name="fuelType" value={formData.fuelType} options={['Diesel', 'Gasoline', 'Hybrid', 'Electric']} onChange={handleInputChange} />
                                    <SelectField label="Hull Material" name="hullMaterial" value={formData.hullMaterial} options={['Fiberglass', 'Steel', 'Aluminum', 'Carbon Fiber', 'Wood']} onChange={handleInputChange} />
                                </>
                            )}

                            {formData.category === 'Estate' && (
                                <>
                                    <InputField label="Property Name" name="propertyName" value={formData.propertyName} onChange={handleInputChange} />
                                    <SelectField label="Property Type" name="propertyType" value={formData.propertyType} options={['Villa', 'Penthouse', 'Apartment', 'Mansion', 'Estate']} onChange={handleInputChange} />
                                    <InputField label="Built-up Area (sq ft)" name="builtUpArea" type="number" value={formData.builtUpArea} onChange={handleInputChange} />
                                    <InputField label="Land Area (sq ft)" name="landArea" type="number" value={formData.landArea} onChange={handleInputChange} />
                                    <InputField label="Bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} />
                                    <InputField label="Bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} />
                                    <InputField label="Floors" name="floors" type="number" value={formData.floors} onChange={handleInputChange} />
                                    <SelectField label="Furnishing Status" name="furnishingStatus" value={formData.furnishingStatus} options={['Unfurnished', 'Partially Furnished', 'Fully Furnished', 'Designer Furnished']} onChange={handleInputChange} />
                                    <InputField label="Configuration" name="configuration" value={formData.configuration} placeholder="e.g. 5BR + Study" onChange={handleInputChange} />
                                    <InputField label="Architecture Style" name="architectureStyle" value={formData.architectureStyle} onChange={handleInputChange} />
                                    <InputField label="Interior Material" name="interiorMaterial" value={formData.interiorMaterial} onChange={handleInputChange} />
                                    <InputField label="Interior Color Theme" name="interiorColorTheme" value={formData.interiorColorTheme} onChange={handleInputChange} />
                                    <InputField label="Exterior Finish" name="exteriorFinish" value={formData.exteriorFinish} onChange={handleInputChange} />
                                    <InputField label="Climate Control" name="climateControl" value={formData.climateControl} onChange={handleInputChange} />
                                    <SelectField label="Usage Status" name="usageStatus" value={formData.usageStatus} options={['Vacant', 'Owner Occupied', 'Tenanted']} onChange={handleInputChange} />
                                    <InputField label="Construction Year" name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                    <InputField label="Country" name="country" value={formData.country} onChange={handleInputChange} />
                                    <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} />
                                    <InputField label="Address" name="address" value={formData.address} onChange={handleInputChange} />

                                </>
                            )}
                        </div>

                        {formData.category === 'Estate' && (
                            <div className="mt-8 space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Amenities</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Pool', 'Garden', 'Parking', 'Security', 'Smart Home', 'Gym', 'Wine Cellar', 'Home Theater', 'Elevator'].map(item => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => handleCheckboxToggle('amenities', item)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${formData.amenities.includes(item) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Smart Home Systems</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Lighting', 'Climate', 'Security', 'Entertainment', 'Voice Assistant', 'Blinds'].map(item => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => handleCheckboxToggle('smartHomeSystems', item)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${formData.smartHomeSystems.includes(item) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">View Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Sea', 'City', 'Marina', 'Mountain', 'Golf', 'Park', 'River'].map(item => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => handleCheckboxToggle('viewTypes', item)}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${formData.viewTypes.includes(item) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Media Upload Section */}
                    <div className="space-y-6 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">Media & Documents</h3>

                        {/* Image Upload */}
                        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                    <FiUploadCloud />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Asset Images</h4>
                                    <p className="text-xs text-gray-400">Upload high-quality images (Max 5)</p>
                                </div>
                            </div>

                            {/* Show existing images if editing */}
                            {editData && existingImages.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Current Images</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {existingImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-[8px] text-white font-bold uppercase tracking-wider">Existing</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-amber-600 mt-3 font-bold uppercase tracking-wider bg-amber-50 p-2 rounded-lg border border-amber-100">
                                        ⚠️ Uploading new images will replace all current ones.
                                    </p>
                                </div>
                            )}

                            <label className="block">
                                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'images')} />
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:border-black hover:bg-white group text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-black">
                                        <FiUploadCloud className="text-2xl" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Click to upload images</p>
                                    </div>
                                </div>
                            </label>

                            {images.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {images.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                                                <FiCheckCircle className="text-sm" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-700 truncate flex-1">{file.name}</p>
                                            <button type="button" onClick={() => handleRemoveFile(idx, 'images')} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                                                <FiX />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">                        <button disabled={loading} type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : (editData ? 'Update Listing' : 'Submit Listing')}
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, name, value, type = "text", placeholder, onChange }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors"
        />
    </div>
);

const SelectField = ({ label, name, value, options, onChange }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black cursor-pointer"
        >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const LocationInputField = ({ value, onChange }) => {
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
            <input
                type="text"
                name="location"
                value={value}
                required
                onChange={(e) => {
                    onChange(e);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors"
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
                                    onChange({ target: { name: 'location', value: labelText, type: 'text' } });
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

export default CreateListingModal;
