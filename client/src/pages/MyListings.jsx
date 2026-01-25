import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import AssetCard from '../components/AssetCard';
import CreateListingModal from '../components/CreateListingModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { FiGrid, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import UpgradeModal from '../components/UpgradeModal';

const MyListings = () => {
    const { token, isAuthenticated, user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [editingListing, setEditingListing] = useState(null);

    // Delete Confirmation State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            if (!isAuthenticated) return;

            try {
                const response = await fetch('/api/auth/my-listings', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setListings(data);
                } else {
                    setError('Failed to fetch listings');
                }
            } catch (err) {
                console.error(err);
                setError('Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [isAuthenticated, token]);

    const handleListingCreated = (item, isUpdate) => {
        if (isUpdate) {
            setListings(listings.map(l => l._id === item._id ? item : l));
        } else {
            setListings([item, ...listings]);
        }
    };

    const handleCreateClick = () => {
        const currentCount = listings.length;
        const currentPlan = user?.plan || 'Freemium';

        const limits = {
            'Freemium': 5,
            'Premium Basic': 25,
            'Business VIP': 100
        };

        const limit = limits[currentPlan] || 5;

        if (currentCount >= limit) {
            if (currentPlan === 'Business VIP') {
                alert(`You have reached the absolute maximum listing capacity for Business VIP (${limit} listings).`);
            } else {
                setShowUpgradeModal(true);
            }
        } else {
            setEditingListing(null);
            setIsModalOpen(true);
        }
    };

    const handleEditClick = (item) => {
        setEditingListing(item);
        setIsModalOpen(true);
    };

    const getLimitText = () => {
        if (!user) return '';
        const limits = { 'Freemium': 5, 'Premium Basic': 25, 'Business VIP': 100 };
        const limit = limits[user.plan] || 5;
        return `(${listings.length}/${limit} used)`;
    };

    const confirmDelete = (id) => {
        setListingToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!listingToDelete) return;
        const id = listingToDelete;

        try {
            const response = await fetch(`/api/listings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setListings(listings.filter(item => item._id !== id));
            } else {
                const data = await response.json();
                alert(data.error || "Failed to delete listing");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Connection error while deleting");
        } finally {
            setDeleteModalOpen(false);
            setListingToDelete(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="pt-24 px-4 text-center">
                <Navbar />
                <h2 className="text-2xl font-bold mb-4">Please log in to view your listings</h2>
                <Link to="/login" className="text-blue-600 underline">Login here</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <CreateListingModal
                isOpen={isModalOpen}
                editData={editingListing}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingListing(null);
                }}
                onCreated={handleListingCreated}
            />

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this listing? This cannot be undone."
            />

            <div className="pt-28 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-gray-900 playfair-display">My Assets</h1>
                            {(user?.plan === 'Premium Basic' || user?.plan === 'Business VIP') && (
                                <Link to="/inventory" className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors">
                                    Open Dashboard
                                </Link>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">
                            Manage and view all your active listings {getLimitText()}
                        </p>
                    </div>

                    <button
                        onClick={handleCreateClick}
                        disabled={loading}
                        className={`flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all mt-4 md:mt-0 shadow-lg shadow-black/10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <FiPlus className="text-lg" />
                        <span>{loading ? 'Syncing...' : 'Create Listing'}</span>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
                ) : listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FiGrid className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No listings found</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">You haven't listed any assets yet. Start selling your premium assets today.</p>
                        <button onClick={handleCreateClick} className="text-[#D90416] font-bold uppercase text-sm tracking-widest hover:underline">
                            Create your first listing
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                        {listings.map(item => (
                            <div key={item._id} className="relative group overflow-hidden rounded-2xl">
                                <AssetCard item={item} />

                                {/* Overlay Controls */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(item);
                                        }}
                                        className="bg-white/90 backdrop-blur-md text-black p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-110"
                                        title="Edit Listing"
                                    >
                                        <FiEdit2 className="text-lg" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(item._id);
                                        }}
                                        className="bg-white/90 backdrop-blur-md text-red-600 p-2.5 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                                        title="Delete Listing"
                                    >
                                        <FiTrash2 className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListings;
