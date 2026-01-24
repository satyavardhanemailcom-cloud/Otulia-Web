import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "./navbar/Cart";
import Search from "./navbar/Search";
import LoginButton from "./navbar/LoginButton";
import ProfileDropdown from "./navbar/Profile_dropdown";
import NavbarMobile from "./Navbar_mobile";
import { useAuth } from "../contexts/AuthContext"; 

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [panelFlag, setpanelFlag] = useState(false);
  
  // 1. Get Loading State
  // We need 'loading' to prevent the UI from checking "isAuthenticated" too early
  const { isAuthenticated, loading } = useAuth(); 

  const location = useLocation();
  const isHeroPage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Determine Text/Icon Color
  // If we are NOT on Hero, OR if we have Scrolled -> Dark Text
  const isDarkText = !isHeroPage || isScrolled;

  const navClasses = `fixed top-0 left-0 w-screen z-50 transition-all duration-200 flex items-center justify-between p-6 ${
    !isHeroPage
      ? "bg-white text-black shadow-sm" // FIXED: Changed text-white to text-black
      : isScrolled
      ? "bg-white shadow-md text-black"
      : "bg-transparent text-white"
  }`;

  return (
    <nav className={navClasses}>
      {/* 1. Logo */}
      <NavLink to={"/"}>
        <img
          className="w-[140px] md:w-[200px] h-[40px] md:h-[60px] object-contain"
          alt="logo"
          src="/logos/logo_inverted.png"
          title="Otulia"
        />
      </NavLink>

      {/* 2. HAMBURGER (Dynamic Color) */}
      <button
        // Use 'isDarkText' to swap color so it is visible on white backgrounds
        className={`block md:hidden focus:outline-none z-50 ${isDarkText ? "text-black" : "text-white"}`}
        onClick={() => setpanelFlag(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* 3. MOBILE PANEL */}
      {/* Changed z-51 to z-[60] to ensure it sits on top of the navbar */}
      <div
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${
          panelFlag ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setpanelFlag(false)}
          className="absolute top-6 right-6 text-[#2C2C2C] focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="pt-20">
          <NavbarMobile />
        </div>
      </div>

      {/* 4. DESKTOP MENU */}
      <ul className="hidden md:flex items-center justify-center gap-8">
        <li>
          <Search />
        </li>

        {/* 5. AUTH STATE HANDLING */}
        {loading ? (
           // Show a placeholder or nothing while checking token
           // This prevents the "flash" of the Login button or crashes
           <li className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></li>
        ) : (
           <>
              {!isAuthenticated && (
                <li>
                  <LoginButton />
                </li>
              )}
              {isAuthenticated && (
                // Added text-inherit to ensure it follows the navbar color logic
                <li className="flex gap-3 items-center justify-center text-inherit">
                  <ProfileDropdown />
                  <Cart />
                </li>
              )}
           </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;