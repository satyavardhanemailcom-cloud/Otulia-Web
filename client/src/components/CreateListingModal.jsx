import React, { useState } from 'react';
import { FiX, FiUploadCloud, FiFileText } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const CreateListingModal = ({ isOpen, onClose, onCreated }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: 'Car',
        type: 'Sale',
        location: '',
        description: ''
    });
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        if (type === 'images') {
            setImages([...e.target.files]);
        } else {
            setDocuments([...e.target.files]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        images.forEach(file => data.append('images', file));
        documents.forEach(file => data.append('documents', file));

        try {
            const response = await fetch('http://127.0.0.1:8000/api/listings/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                const newListing = await response.json();
                onCreated(newListing);
                onClose();
            } else {
                alert('Failed to create listing');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold playfair-display">Create New Listing</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FiX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Title</label>
                            <input type="text" name="title" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Price (£)</label>
                            <input type="number" name="price" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                            <select name="category" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black" onChange={handleInputChange}>
                                <option value="Car">Car</option>
                                <option value="Bike">Bike</option>
                                <option value="Yacht">Yacht</option>
                                <option value="Estate">Real Estate</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Listing Type</label>
                            <select name="type" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black" onChange={handleInputChange}>
                                <option value="Sale">For Sale</option>
                                <option value="Rent">For Rent</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                        <input type="text" name="location" required className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                        <textarea name="description" rows="3" className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-black transition-colors" onChange={handleInputChange}></textarea>
                    </div>

                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-black/20 transition-colors">
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                            <FiUploadCloud className="text-3xl text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">Upload Images (Max 5)</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'images')} />
                        </label>
                        {images.length > 0 && <p className="text-xs text-center mt-2 text-green-600">{images.length} files selected</p>}
                    </div>

                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-black/20 transition-colors bg-blue-50/30 border-blue-100">
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                            <FiFileText className="text-3xl text-blue-400" />
                            <span className="text-sm font-medium text-blue-600">Upload Documents (PDF, Docs)</span>
                            <input type="file" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileChange(e, 'documents')} />
                        </label>
                        {documents.length > 0 && <p className="text-xs text-center mt-2 text-blue-600">{documents.length} docs selected</p>}
                    </div>

                    <div className="pt-4">
                        <button disabled={loading} type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50">
                            {loading ? 'Creating...' : 'Submit Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListingModal;
