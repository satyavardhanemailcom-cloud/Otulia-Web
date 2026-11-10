import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import Cart from "./navbar/Cart";
import Search from "./navbar/Search";
import LoginButton from "./navbar/LoginButton";
import ThemeToggle from "./navbar/ThemeToggle";
import ProfileDropdown from "./navbar/Profile_dropdown";
import { useAuth } from "../contexts/AuthContext";
import NavbarSellwithus_mobile from "./NavbarSellwithus_mobile";
import { FaArrowRightLong } from "react-icons/fa6";

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
  const isHeroPage = location.pathname === "/sellwithus";
  const isProductPage = location.pathname.startsWith("/asset/");

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

  const navClasses = `fixed ${isScrolled || isProductPage ? "top-0" : "top-[clamp(12px,2vh,24px)]"} left-0 h-[clamp(50px,8vh,80px)] w-screen z-50 transition-all duration-200 flex items-center justify-between px-[clamp(12px,2vw,40px)] py-[clamp(8px,1vh,16px)] ${
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
        <ul className="hidden lg:flex items-center justify-center gap-[clamp(24px,4vw,64px)] absolute left-1/2 -translate-x-1/2 w-auto">
          <li>
            <NavLink
              to="/sellwithus"
              className={({ isActive }) =>
                `text-[clamp(9px,1.1vh,11px)] tracking-[0.35em] font-medium montserrat transition-all whitespace-nowrap ${isActive ? "text-[#C8922A]" : isDarkText ? "text-black hover:opacity-70" : "text-white hover:opacity-70"}`
              }
            >
              FEATURES
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rent"
              className={({ isActive }) =>
                `text-[clamp(9px,1.1vh,11px)] tracking-[0.35em] font-medium montserrat transition-all whitespace-nowrap ${isActive ? "text-[#C8922A]" : isDarkText ? "text-black hover:opacity-70" : "text-white hover:opacity-70"}`
              }
            >
              CATEGORIES
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `text-[clamp(9px,1.1vh,11px)] tracking-[0.35em] font-medium montserrat transition-all whitespace-nowrap ${isActive ? "text-[#C8922A]" : isDarkText ? "text-black hover:opacity-70" : "text-white hover:opacity-70"}`
              }
            >
              PRICING
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `text-[clamp(9px,1.1vh,11px)] tracking-[0.35em] font-medium montserrat transition-all whitespace-nowrap ${isActive ? "text-[#C8922A]" : isDarkText ? "text-black hover:opacity-70" : "text-white hover:opacity-70"}`
              }
            >
              FAQ
            </NavLink>
          </li>
        </ul>

        {/* 3. RIGHT ACTIONS - Right Column */}
        <div className="flex-1 flex items-center justify-end gap-[clamp(8px,1vw,24px)]">
          {/* <NavLink
            to="/signup"
            className={`hidden lg:flex items-center gap-2.5 px-[clamp(12px,1.5vw,24px)] py-[clamp(6px,1vh,12px)] border text-[clamp(9px,1.1vh,13px)] tracking-[0.2em] font-medium montserrat transition-all duration-500 whitespace-nowrap backdrop-blur-md shadow-lg active:scale-95 ${
              isDarkText
                ? "border-black/10 bg-black/5 text-black hover:bg-black hover:text-white hover:border-black hover:shadow-black/10"
                : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white hover:shadow-white/20"
            }`}
          >
            JOIN WAITLIST
            <FaArrowRightLong />
          </NavLink> */}

          <ThemeToggle isDark={isDarkText} />

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
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${panelFlag ? "translate-x-0" : "translate-x-full"}`}
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
          <NavbarSellwithus_mobile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
