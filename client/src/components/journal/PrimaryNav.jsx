import { useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../navbar/ThemeToggle";

const LOGO_SRC = "/logos/logo_inverted.png";

const primaryLinks = [
  { label: "REAL ESTATE", href: "#" },
  { label: "CARS", href: "#" },
  { label: "YACHTS", href: "#" },
  { label: "WATCHES", href: "#" },
  { label: "LIFESTYLE", href: "#" },
  { label: "GUIDES", href: "#" },
];

export default function PrimaryNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b-2 border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 w-44 h-8 flex items-center">
            <NavLink to={"/"}>
              <img
                src={LOGO_SRC}
                alt="Site Logo"
                className="h-[40px] w-auto object-contain"
              />
            </NavLink>
          </div>

          {/* Center title */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <NavLink to={"/journal"}>
              <span className="text-2xl font-serif font-normal tracking-tight text-gray-900">
                The Journal
              </span>
            </NavLink>
          </div>

          {/* Right — Advertise link + mobile hamburger */}
          <div className="flex items-center gap-6">
            <ThemeToggle isDark={true} />
            <a
              href="/pricing"
              className="hidden md:block text-xs font-medium tracking-widest text-gray-600 hover:text-gray-900 transition-colors uppercase"
            >
              Advertise With Us
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1 p-1"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-200 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-200 ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Category links — desktop */}
        {/* <div className="hidden md:flex items-center justify-center gap-8 mt-4">
          {primaryLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium tracking-widest text-gray-700 hover:text-gray-900 transition-colors uppercase pb-0.5 border-b-2 border-transparent hover:border-gray-900"
            >
              {link.label}
            </a>
          ))}
        </div> */}

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4">
            {primaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-medium tracking-widest text-gray-700 hover:text-gray-900 transition-colors uppercase"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="text-xs font-medium tracking-widest text-gray-600 hover:text-gray-900 transition-colors uppercase"
            >
              Advertise With Us
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
