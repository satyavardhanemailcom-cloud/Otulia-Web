import React, { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

// Dark/light toggle. The choice is saved in localStorage and applied as the
// "dark" class on <html>, which index.css uses to recolor every page.
//
// variant="icon" (default): round navbar button.
// variant="menu": a row for profile menus; pass the menu's row classes in className.
const ThemeToggle = ({ isDark, variant = "icon", className }) => {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  // Several toggles can be mounted at once (navbar, profile menu, mobile panel):
  // keep them all in sync.
  useEffect(() => {
    const sync = (e) => setDark(e.detail);
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
    // Ranking pages keep their own dark design, so only save the choice there.
    if (!window.location.pathname.startsWith("/ranking")) {
      document.documentElement.classList.toggle("dark", next);
    }
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage unavailable (private mode): theme still applies for this visit.
    }
  };

  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "menu") {
    return (
      <button type="button" onClick={toggleTheme} aria-label={label} className={className}>
        {dark ? <FiSun className="text-lg opacity-60" /> : <FiMoon className="text-lg opacity-60" />}
        <span>Dark Mode</span>
        {/* Small on/off switch */}
        <span
          className={`ml-auto relative w-8 h-[18px] rounded-full shrink-0 transition-colors duration-300 ${dark ? "bg-[#D48D2A]" : "bg-gray-200"}`}
        >
          <span
            className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-[#ffffff] shadow-sm transition-transform duration-300 ${dark ? "translate-x-[14px]" : ""}`}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={dark ? "Light mode" : "Dark mode"}
      className={
        className ||
        `flex items-center justify-center w-[clamp(32px,4.2vh,40px)] h-[clamp(32px,4.2vh,40px)] shrink-0 rounded-full border cursor-pointer transition-all duration-500 backdrop-blur-md active:scale-95 ${
          isDark
            ? "border-black/10 bg-black/5 text-black hover:bg-black hover:text-white hover:border-black"
            : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-black hover:border-white"
        }`
      }
    >
      {dark ? <FiSun className="w-[18px] h-[18px]" /> : <FiMoon className="w-[18px] h-[18px]" />}
    </button>
  );
};

export default ThemeToggle;
