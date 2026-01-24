import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import UserURL from '../../assets/user.png'

const ProfileDropdown = () => {
    const { user, logout } = useAuth();

    return (
        <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer">
                <img src={user.photo || UserURL} alt="user" className="w-8 h-8 rounded-full" />
                <span className="">{user.name}</span>
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;