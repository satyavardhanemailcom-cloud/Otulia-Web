import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import UserURL from "../../assets/user.png";
import {
  FiUser,
  FiCreditCard,
  FiGrid,
  FiLogOut,
  FiActivity,
  FiHeart,
  FiSettings,
} from "react-icons/fi";
import { optimizeCloudinaryUrl } from "../../utils/imageUtils";

const ProfileDropdown = ({ isDark }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const textColor = isDark ? "text-black" : "text-white";

  return (
    <div className="relative montserrat" ref={dropdownRef}>
      {/* TRIGGER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 cursor-pointer group p-1.5 rounded-full transition-all duration-300 ${textColor} hover:bg-white/10`}
      >
        <div className="relative shrink-0">
          <img
            src={optimizeCloudinaryUrl(
              user.profilePicture || UserURL,
              100,
              100,
            )}
            alt="user"
            className={`w-9 h-9 rounded-full object-cover border ${isDark ? "border-gray-200" : "border-white/20"}`}
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex flex-col items-start leading-[1.1] hidden md:flex min-w-[70px]">
          <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[120px]">
            {user.name}
          </span>
          <span className="text-[9px] opacity-60 font-medium uppercase tracking-tighter">
            {user.plan || "Free Member"}
          </span>
        </div>
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 py-3 z-[100] animate-fade-in montserrat">
          {/* Header Info */}
          <div className="px-5 py-3 border-b border-gray-50 mb-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
              Logged in as
            </p>
            <p className="text-[13px] font-normal text-gray-800 truncate">
              {user.email}
            </p>
          </div>

          <div className="flex flex-col py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors uppercase font-normal"
            >
              <FiUser className="text-lg opacity-60" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors uppercase  font-normal"
            >
              <FiCreditCard className="text-lg opacity-60" />
              <div className="flex flex-col">
                <span>Membership Plan</span>
                <span className="text-[10px] text-gray-400 font-normal tracking-normal pt-0.5">
                  Current: {user.plan}
                </span>
              </div>
            </Link>

            <Link
              to="/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors uppercase  font-normal"
            >
              <FiHeart className="text-lg opacity-60" />
              <span>My Favorites</span>
            </Link>

            <Link
              to="/listings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors uppercase  font-normal"
            >
              <FiGrid className="text-lg opacity-60" />
              <span>My Listings</span>
            </Link>

            {user.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors uppercase  font-normal"
              >
                <FiSettings className="text-lg opacity-60" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {(user.plan === "Premium Basic" ||
              user.plan === "Business VIP") && (
              <Link
                to="/inventory"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors uppercase  font-normal"
              >
                <FiActivity className="text-lg opacity-60" />
                <div className="flex flex-col">
                  <span>Inventory Management</span>
                  <span className="text-[10px] text-blue-500 font-medium tracking-normal pt-0.5">
                    {user.plan === "Business VIP" ? "Advanced" : "Professional"}
                  </span>
                </div>
              </Link>
            )}

            {/* Ranking pages keep their own dark design */}
            {!location.pathname.startsWith("/ranking") && (
              <ThemeToggle
                variant="menu"
                className="flex items-center gap-3 w-full px-5 py-3 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors uppercase font-normal text-left cursor-pointer"
              />
            )}
          </div>

          <div className="h-px bg-gray-100 my-2"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-3 text-[13px] text-red-500 font-normal hover:bg-red-50 transition-colors text-left uppercase "
          >
            <FiLogOut className="text-lg opacity-60" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
