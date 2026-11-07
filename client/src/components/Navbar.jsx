import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "./navbar/Cart";
import Search from "./navbar/Search";
import LoginButton from "./navbar/LoginButton";
import ProfileDropdown from "./navbar/Profile_dropdown";
import NavbarMobile from "./Navbar_mobile";
import { useAuth } from "../contexts/AuthContext";

const Navbar = ({
  hideSearch = false,
  hideLogin = false,
  forceTransparent = false,
  customLogo = null,
}) => {
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
  // Override if forceTransparent is on
  const isDarkText = (!isHeroPage || isScrolled) && !forceTransparent;

  // The floating offset is only for the transparent homepage hero; every other page keeps the bar flush with the top.
  const navClasses = `fixed ${isScrolled || !isHeroPage ? "top-0" : "top-[clamp(12px,2vh,24px)]"} left-0 h-[clamp(50px,8vh,80px)] w-screen z-50 transition-all duration-200 flex items-center justify-between px-[clamp(12px,2vw,40px)] py-[clamp(8px,1vh,16px)] ${
    forceTransparent
      ? "bg-transparent text-white"
      : !isHeroPage
        ? "bg-white text-black shadow-sm"
        : isScrolled
          ? "bg-white text-black shadow-md"
          : "bg-transparent text-white"
  }`;

  // Default logo logic (can be refined based on 'isDarkText' if you have a black logo asset)
  // For now, adhere to existing unless custom provided
  const logoSrc =
    isScrolled || !isHeroPage ? "/logos/logo_inverted.png" : "/logos/logo.png";

  return (
    <nav className={navClasses}>
      <div className="w-full flex items-center justify-between relative">
        {/* 1. Logo - Left Column */}
        <div className="flex-1 flex justify-start">
          <NavLink to={"/"}>
            <img
              className="w-[clamp(100px,10vw,160px)] h-auto object-contain transition-all"
              alt="Otulia"
              src={logoSrc}
              title="Otulia"
            />
          </NavLink>
        </div>

        {/* 2. DESKTOP MENU - Center Column (Absolute centered) */}
        <ul className="hidden lg:flex items-center justify-center gap-[clamp(16px,3vw,48px)] absolute left-1/2 -translate-x-1/2 w-auto">
          <li>
            <NavLink
              to="/ranking"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              RANKINGS
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              SHOP ALL
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/rent"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              RENT
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `text-[clamp(10px,1.2vh,14px)] tracking-[0.2em] font-normal montserrat transition-colors whitespace-nowrap ${isActive ? "text-[#D48D2A]" : isDarkText ? "text-black hover:text-black/70" : "text-white hover:text-white/70"}`
              }
            >
              PLAN & PRICE
            </NavLink>
          </li>
        </ul>

        {/* 3. RIGHT ACTIONS - Right Column */}
        <div className="flex-1 flex items-center justify-end gap-[clamp(8px,1vw,24px)]">
          <NavLink
            to="/sellwithus"
            className={`hidden lg:block px-[clamp(12px,1.5vw,24px)] py-[clamp(6px,1vh,12px)] rounded-full border text-[clamp(9px,1.1vh,13px)] tracking-[0.2em] font-medium montserrat transition-all duration-500 whitespace-nowrap backdrop-blur-md shadow-lg active:scale-95 ${
              isDarkText
                ? "border-black/10 bg-black/5 text-black hover:bg-black hover:text-white hover:border-black hover:shadow-black/10"
                : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white hover:shadow-white/20"
            }`}
          >
            SELL WITH US
          </NavLink>

          {loading ? (
            <div className="w-8 h-8 bg-gray-200/20 rounded-full animate-pulse"></div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
              {!isAuthenticated && !hideLogin && (
                <LoginButton isDark={isDarkText} />
              )}
              {isAuthenticated && (
                <>
                  <div className="hidden lg:block">
                    <ProfileDropdown isDark={isDarkText} />
                  </div>
                  <Cart isDark={isDarkText} />
                </>
              )}
            </div>
          )}

          {/* 4. HAMBURGER (Visible on mobile and tablet) */}
          <button
            aria-label="Open menu"
            className={`lg:hidden focus:outline-none z-50 transition-colors ${isDarkText ? "text-black" : "text-white"}`}
            onClick={() => setpanelFlag(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 md:w-8 md:h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE PANEL */}
      <div
        className={`fixed top-0 right-0 h-dvh md:h-screen w-[80vw] overflow-y-auto bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${panelFlag ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          aria-label="Close menu"
          onClick={() => setpanelFlag(false)}
          className="absolute top-6 right-6 text-[#2C2C2C] focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="pt-20">
          <NavbarMobile onClose={() => setpanelFlag(false)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
