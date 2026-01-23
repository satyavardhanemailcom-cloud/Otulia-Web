import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink} from "react-router-dom";
import Cart from "./navbar/Cart";
import Search from "./navbar/Search";
import LoginButton from "./navbar/LoginButton";
import NavbarMobile from "./Navbar_mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  // Default to false (closed) so it doesn't block screen on load
  const [panelFlag, setpanelFlag] = useState(false); 

  const location = useLocation();
  const isHeroPage = location.pathname === "/";

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic Navbar Classes
  const navClasses = `fixed top-0 left-0 w-screen z-50 transition-all duration-200 flex items-center justify-between p-6 ${
    !isHeroPage
      ? "bg-white text-white"
      : isScrolled
      ? "bg-white shadow-md text-white"
      : "bg-transparent text-white"
  }`;

  return (
    <nav className={navClasses}>
      {/* 1. Logo */}
      <NavLink to={'/'}>
        <img
        className="w-[140px] md:w-[200px] h-[40px] md:h-[60px] object-contain"
        alt="logo"
        src="/logos/logo_inverted.png"
        title="Otulia"
      />

      </NavLink>
      
      {/* 2. THE HAMBURGER FIX (Inline SVG) */}
      {/* We use <button> instead of <img> for better accessibility and reliable coloring */}
      <button
        className="block md:hidden focus:outline-none z-50 text-black"
        onClick={() => setpanelFlag(true)}
      >
        {/* This SVG inherits the text color (white) automatically via 'currentColor' */}
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* 3. THE MOBILE PANEL FIX */}
      {/* Moved outside the flex flow slightly by using fixed/inset positioning */}
      {/* z-[60] ensures it sits ON TOP of the navbar (which is z-50) */}
      <div
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-51 transform transition-transform duration-300 ease-in-out ${
          panelFlag ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button (Always visible inside panel) */}
        <button
          onClick={() => setpanelFlag(false)}
          className="absolute top-6 right-6 text-[#2C2C2C] focus:outline-none"
        >
          {/* X Icon */}
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

        {/* Content Container */}
        <div className="pt-20">
            <NavbarMobile />
        </div>
      </div>

      {/* 4. Desktop Menu (Hidden on Mobile) */}
      <ul className="hidden md:flex items-center justify-center gap-8">
        <li><Search /></li>
        <li><LoginButton /></li>
        <li className="text-black"><Cart /></li>
      </ul>
    </nav>
  );
};

export default Navbar;