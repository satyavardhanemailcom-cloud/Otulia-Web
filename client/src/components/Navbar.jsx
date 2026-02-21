import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "./navbar/Cart";
import Search from "./navbar/Search";
import LoginButton from "./navbar/LoginButton";
import ProfileDropdown from "./navbar/Profile_dropdown";
import NavbarMobile from "./Navbar_mobile";
import { useAuth } from "../contexts/AuthContext";

const Navbar = ({ hideSearch = false, hideLogin = false, forceTransparent = false, customLogo = null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [panelFlag, setpanelFlag] = useState(false);

  // 1. Get Loading State
  // We need 'loading' to prevent the UI from checking "isAuthenticated" too early
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();
  const isHeroPage = location.pathname === "/";
  const isProductPage = location.pathname.startsWith("/asset/")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Determine Text/Icon Color
  // If we are NOT on Hero, OR if we have Scrolled -> Dark Text
  // Override if forceTransparent is on
  const isDarkText = (!isHeroPage || isScrolled) && !forceTransparent;

  const navClasses = `fixed top-0 left-0 h-[40px] md:h-[80px] w-screen z-50 transition-all duration-200 flex items-center justify-between p-6 ${forceTransparent
      ? "bg-transparent text-white"
      : !isHeroPage
        ? "bg-white text-black"
        : isScrolled
          ? "bg-white text-black"
          : "bg-transparent text-white"
    }`;

  // Default logo logic (can be refined based on 'isDarkText' if you have a black logo asset)
  // For now, adhere to existing unless custom provided
  const logoSrc = customLogo || "/logos/logo_inverted.png";

  return (
    <nav className={navClasses}>
      {/* 1. Logo */}
      <NavLink to={"/"}>
        <img
          className="w-[100px] md:w-[120px] h-[40px] md:h-[50px] object-contain"
          alt="logo"
          src={logoSrc}
          title="Otulia"
        />
      </NavLink>

      {/* 2. HAMBURGER (Dynamic Color) */}
      <button
        // Use 'isDarkText' to swap color so it is visible on white backgrounds
        className={`block md:hidden focus:outline-none z-50 text-black`}
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
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${panelFlag ? "translate-x-0" : "translate-x-full"
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
        {!hideSearch && (
          <li>
            <Search />
          </li>
        )}

        {/* 5. AUTH STATE HANDLING */}
        {loading ? (
          // Show a placeholder or nothing while checking token
          // This prevents the "flash" of the Login button or crashes
          <li className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></li>
        ) : (
          <>
            {!isAuthenticated && !hideLogin && (
              <li>
                <LoginButton />
              </li>
            )}
            {isAuthenticated && (
              // Added text-inherit to ensure it follows the navbar color logic
              <li className="flex gap-3 items-center justify-center text-inherit">
                <ProfileDropdown text={'text-black'} />
                <Cart text={'text-black'} />
              </li>
            )}
          </>
        )
        }
      </ul >

      {((isHeroPage || isProductPage) && !isScrolled) && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[96%] h-[1px] bg-black"></div>
      )}
    </nav >
  );
};

export default Navbar;