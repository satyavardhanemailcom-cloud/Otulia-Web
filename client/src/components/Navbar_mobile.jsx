import React from "react";
import SearchBar from "./navbar_sidepanel/SearchBar";
import LoginButton from "./navbar/LoginButton";
import { useAuth } from "../contexts/AuthContext";
import Cart from "./navbar/Cart";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./navbar/ThemeToggle";
import UserURL from "../assets/user.png";
import { FiGrid, FiLogOut, FiShoppingCart, FiTag, FiKey, FiPlusCircle } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";

const NavbarMobile = ({ onClose }) => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate("/");
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="px-5 py-2">
      <div className="flex flex-col gap-3 text-[#2C2C2C]">
        <SearchBar />

        {/* Navigation Menu Links */}
        <div className="border-t border-gray-200 pt-3 mt-1 flex flex-col gap-1">
          {/* Option to go to Rankings Page */}
          <Link
            to="/ranking"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-3 rounded-lg text-[#161618] hover:bg-amber-50/80 hover:text-[#D48D2A] transition duration-200 font-semibold"
          >
            <FaTrophy className="text-[#D48D2A] text-lg shrink-0" />
            <span className="tracking-wide text-[15px]">Rankings</span>
            <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#D48D2A]/15 text-[#D48D2A]">
              Top 2026
            </span>
          </Link>

          <Link
            to="/rent"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-3 rounded-lg text-[#161618] hover:bg-gray-100 transition duration-200 font-medium"
          >
            <FiKey className="text-gray-500 text-lg shrink-0" />
            <span className="tracking-wide text-[15px]">Rent</span>
          </Link>

          <Link
            to="/pricing"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-3 rounded-lg text-[#161618] hover:bg-gray-100 transition duration-200 font-medium"
          >
            <FiTag className="text-gray-500 text-lg shrink-0" />
            <span className="tracking-wide text-[15px]">Plan & Price</span>
          </Link>

          <Link
            to="/sellwithus"
            onClick={handleLinkClick}
            className="flex items-center gap-3 p-3 rounded-lg text-[#161618] hover:bg-gray-100 transition duration-200 font-medium"
          >
            <FiPlusCircle className="text-gray-500 text-lg shrink-0" />
            <span className="tracking-wide text-[15px]">Sell With Us</span>
          </Link>
        </div>

        {loading ? (
          <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse"></div>
        ) : (
          <>
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-3 mt-1 border-t border-gray-200 pt-3">
                {/* Profile Info */}
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={optimizeCloudinaryUrl(user.profilePicture || UserURL, 100, 100)}
                    alt="user"
                    className="w-11 h-11 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-base">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.plan || "Free Member"}</span>
                  </div>
                </Link>

                <div className="flex flex-col gap-1">
                  <Link
                    to="/listings"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-sm font-medium"
                  >
                    <FiGrid className="text-lg text-gray-500" />
                    <span>My Listings</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-sm font-medium"
                  >
                    <FiShoppingCart className="text-lg text-gray-500" />
                    <span>Cart</span>
                  </Link>
                  {/* Ranking pages keep their own dark design */}
                  {!location.pathname.startsWith("/ranking") && (
                    <ThemeToggle
                      variant="menu"
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-100 text-sm font-medium text-left cursor-pointer"
                    />
                  )}
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 text-red-600 font-medium hover:bg-red-50 rounded-lg text-left text-sm"
                  >
                    <FiLogOut className="text-lg" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 border-t border-gray-200 pt-3">
                <LoginButton isDark={true} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NavbarMobile;
