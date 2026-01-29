import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import UserURL from '../../assets/user.png'
import { FiUser, FiCreditCard, FiGrid, FiLogOut, FiActivity, FiHeart, FiSettings } from 'react-icons/fi';

const ProfileDropdown = ({text}) => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="relative montserrat" ref={dropdownRef}>
            {/* TRIGGER */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 cursor-pointer group p-1.5 rounded-full transition-all duration-300 ${text} hover:bg-gray-500/50`}
            >
                <div className="relative">
                    <img
                        src={user.profilePicture || UserURL}
                        alt="user"
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col items-start leading-none hidden md:flex pr-2">
                    <span className="text-sm font-bold uppercase tracking-tight truncate max-w-[100px]">
                        {user.name}
                    </span>
                    <span className="text-[10px] opacity-80 font-medium mt-1">
                        {user.plan || 'Free Member'}
                    </span>
                </div>
            </div>

            {/* DROPDOWN MENU */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-3 z-[100] animate-fade-in montserrat">

                    {/* Header Info */}
                    <div className="px-5 py-3 border-b border-gray-50 mb-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Logged in as</p>
                        <p className="text-sm font-bold text-black truncate">{user.email}</p>
                    </div>

                    <div className="flex flex-col py-1">
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FiUser className="text-lg" />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            to="/pricing"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FiCreditCard className="text-lg" />
                            <div className="flex flex-col">
                                <span>Membership Plan</span>
                                <span className="text-[10px] text-gray-400">Current: {user.plan}</span>
                            </div>
                        </Link>

                        <Link
                            to="/favorites"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FiHeart className="text-lg" />
                            <span>My Favorites</span>
                        </Link>

                        <Link
                            to="/listings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FiGrid className="text-lg" />
                            <span>My Listings</span>
                        </Link>

                        {user.role === 'admin' && (
                            <Link
                                to="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FiSettings className="text-lg" />
                                <span>Admin Dashboard</span>
                            </Link>
                        )}

                        {(user.plan === 'Premium Basic' || user.plan === 'Business VIP') && (
                            <Link
                                to="/inventory"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FiActivity className="text-lg" />
                                <div className="flex flex-col">
                                    <span>Inventory Management</span>
                                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                                        {user.plan === 'Business VIP' ? 'Advanced' : 'Professional'}
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>

                    <div className="h-px bg-gray-100 my-2"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors text-left"
                    >
                        <FiLogOut className="text-lg" />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;