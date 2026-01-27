import React from "react";
import SearchBar from "./navbar_sidepanel/SearchBar";
import LoginButton from "./navbar/LoginButton";
import { useAuth } from "../contexts/AuthContext";
import Cart from "./navbar/Cart";
import { Link, useNavigate } from "react-router-dom";
import UserURL from '../assets/user.png';
import { FiGrid, FiLogOut, FiShoppingCart } from 'react-icons/fi';

const NavbarMobile = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="px-5 py-2">
      <div className="flex flex-col gap-3 text-[#2C2C2C]">
        <SearchBar />

        {loading ? (
          <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse"></div>
        ) : (
          <>
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-4 mt-4">
                {/* Profile Info */}
                <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                  <img
                    src={user.profilePicture || UserURL}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{user.name}</span>
                    <span className="text-sm text-gray-500">{user.plan || 'Free Member'}</span>
                  </div>
                </Link>

                <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
                  <Link to="/listings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                    <FiGrid className="text-lg" />
                    <span>My Listings</span>
                  </Link>
                  <Link to="/cart" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
                    <FiShoppingCart className="text-lg" />
                    <span>Cart</span>
                  </Link>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 text-red-600 font-medium hover:bg-red-50 rounded-lg text-left"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <LoginButton />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NavbarMobile;