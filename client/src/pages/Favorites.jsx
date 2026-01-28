import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import AssetCard from '../components/AssetCard';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { token, isAuthenticated, user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated) return;

            try {
                const response = await fetch('/api/auth/favorites', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                } else {
                    setError('Failed to fetch favorites');
                }
            } catch (err) {
                console.error(err);
                setError('Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [isAuthenticated, token, user]);

    if (!isAuthenticated) {
        return (
            <div className="pt-24 px-4 text-center">
                <Navbar />
                <h2 className="text-2xl font-bold mb-4">Please log in to view your favorites</h2>
                <Link to="/login" className="text-blue-600 underline">Login here</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-28 max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-bold text-gray-900 playfair-display">My Favorites</h1>
                            <FiHeart className="text-red-500 text-2xl fill-current" />
                        </div>
                        <p className="text-gray-500 text-sm">
                            View and manage your saved items
                        </p>
                    </div>
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
                ) : favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <FiHeart className="text-2xl text-red-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">Start exploring and save items you love!</p>
                        <Link to="/" className="text-black font-bold uppercase text-sm tracking-widest hover:underline">
                            Explore Collections
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                        {favorites.map((item, idx) => (
                            <div key={item._id || idx} className="relative group overflow-hidden rounded-2xl">
                                <AssetCard item={item} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
