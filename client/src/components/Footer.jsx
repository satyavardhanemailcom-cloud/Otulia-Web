import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { useSnackbar } from "../contexts/SnackbarContext";
import appStoreBadge from "../assets/App_Buttons/app_store.webp";
import playStoreBadge from "../assets/App_Buttons/play_store.webp";

const Footer = () => {
  const { showSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  // In-app hash links (e.g. "/#Category"): go to the page without a reload,
  // then scroll to the section once it has rendered.
  const goToHash = (target) => {
    const [path, hash] = target.split("#");
    const scroll = () =>
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname === (path || "/")) {
      scroll();
    } else {
      navigate(path || "/");
      setTimeout(scroll, 100);
    }
  };
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [selectedUnit, setSelectedUnit] = useState("sqft");
  const discover = [
    {
      id: 1,
      name: "Explore Categories",
      navigate: "/#Category",
    },
    {
      id: 2,
      name: "Luxury Cars",
      navigate: "/category/cars",
    },
    {
      id: 3,
      name: "Luxury Real Estate",
      navigate: "/category/estates",
    },
    {
      id: 4,
      name: "Accessories",
      navigate: "/shop",
    },
    {
      id: 5,
      name: "Exclusive Collections",
      navigate: "/shop",
    },
  ];

  const company = [
    {
      id: 1,
      page: "About",
      navigate: "/about",
    },
    {
      id: 3,
      page: "Premium Membership",
      navigate: "/pricing",
    },
  ];

  const social = [
    {
      id: 1,
      name: "Facebook",
      navigate:
        "https://www.facebook.com/people/Otulia-All-In-One-Marketplace/61584376807412/",
    },
    {
      id: 2,
      name: "Instagram",
      navigate: "https://www.instagram.com/otulia.in",
    },
    {
      id: 3,
      name: "YouTube",
      navigate: "https://youtube.com/@otulia.com13",
    },
    {
      id: 4,
      name: "Twitter",
      navigate: "https://x.com/OtuliaGlobal",
    },
    {
      id: 5,
      name: "LinkedIn",
      navigate: "https://www.linkedin.com/company/otulia/",
    },
  ];

  return (
    <footer className="w-full bg-[#151515] text-white pt-13 montserrat">
      {/* Top Section */}
      <div className="px-4 md:px-6 xl:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8 sm:gap-6 xl:gap-8 mb-8">
        {/* Logo Column */}
        <Link to="/" className="col-span-2 sm:col-span-1 flex flex-col cursor-pointer">
          <img
            className="w-[150px] xl:w-[200px] h-auto object-contain object-left"
            alt="Otulia"
            src="/logos/otulia_logo_white.png"
            title="Otulia"
          />
        </Link>

        {/* Discover */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Discover
          </h3>
          <ul className="flex flex-col gap-3">
            {discover.map((item) => (
              // <li key={item.id}><a href={`${item.navigate}`} className="text-sm text-gray-400 hover:text-white">{item.name}</a></li>
              <li key={item.id}>
                <Link
                  to={item.navigate}
                  onClick={(e) => {
                    if (
                      item.navigate.includes("yachts") ||
                      item.navigate.includes("bikes")
                    ) {
                      e.preventDefault();
                      showSnackbar("COMING SOON");
                    } else if (item.navigate.includes("#")) {
                      e.preventDefault();
                      goToHash(item.navigate);
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Company */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Our Company
          </h3>
          <ul className="flex flex-col gap-3">
            {company.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.navigate}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.page}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Connect With Us
          </h3>
          <ul className="flex flex-col gap-3">
            {social.map((item) => (
              <li key={item.id}>
                <a
                  href={item.navigate}
                  target="_blank"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience App */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Experience App
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showSnackbar("COMING SOON");
              }}
              className="inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] w-fit"
              aria-label="Download on the App Store"
            >
              <img
                src={appStoreBadge}
                alt="Download on the App Store"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showSnackbar("COMING SOON");
              }}
              className="inline-block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] w-fit"
              aria-label="Get it on Google Play"
            >
              <img
                src={playStoreBadge}
                alt="Get it on Google Play"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </a>
          </div>
        </div>

        {/* Settings */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-4 md:gap-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Settings
          </h3>
          <div className="w-full max-w-[210px] border border-[#2D2D2D] rounded bg-transparent overflow-hidden">
            {/* Language */}
            <div className="relative border-b border-[#2D2D2D]">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-200 px-3 py-2.5 pr-8 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="English" className="bg-[#151515] text-white">
                  English
                </option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
            </div>

            {/* Currency */}
            <div className="relative border-b border-[#2D2D2D]">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-200 px-3 py-2.5 pr-8 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="INR" className="bg-[#151515] text-white">
                  Indian rupee - INR ₹
                </option>
                <option value="USD" className="bg-[#151515] text-white">
                  US Dollar - USD $
                </option>
                <option value="EUR" className="bg-[#151515] text-white">
                  Euro - EUR €
                </option>
                <option value="GBP" className="bg-[#151515] text-white">
                  British Pound - GBP £
                </option>
                <option value="AED" className="bg-[#151515] text-white">
                  UAE Dirham - AED د.إ
                </option>
                <option value="JPY" className="bg-[#151515] text-white">
                  Japanese Yen - JPY ¥
                </option>
                <option value="CHF" className="bg-[#151515] text-white">
                  Swiss Franc - CHF Fr.
                </option>
                <option value="CAD" className="bg-[#151515] text-white">
                  Canadian Dollar - CAD $
                </option>
                <option value="AUD" className="bg-[#151515] text-white">
                  Australian Dollar - AUD $
                </option>
                <option value="SGD" className="bg-[#151515] text-white">
                  Singapore Dollar - SGD $
                </option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
            </div>

            {/* Measurement Unit */}
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-200 px-3 py-2.5 pr-8 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="sqft" className="bg-[#151515] text-white">
                  Square Feet — ft² / Acr
                </option>
                <option value="sqm" className="bg-[#151515] text-white">
                  Square Meters — m² / Ha
                </option>
                <option value="sqyd" className="bg-[#151515] text-white">
                  Square Yards — sq yd
                </option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-3 md:px-6">
        <div className="w-full h-px bg-white/10"></div>
      </div>

      {/* Legal Links Section */}
      <div className="px-4 md:px-8 py-8 md:py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-5 md:gap-8 items-center">
        {[
          { name: "Terms & Conditions", path: "/terms" },
          { name: "Privacy Policy", path: "/privacy-policy" },
          { name: "Shipping Information", path: "/shipping" },
          { name: "Returns & Refunds", path: "/returns" },
          { name: "Cookie Policy", path: "/cookie-policy" },
        ].map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-center"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="px-3 md:px-6">
        <div className="w-full h-px bg-white/10"></div>
      </div>

      {/* Payment Options Section */}
      <div className="px-3 md:px-6 py-12 flex flex-col items-center gap-6 hidden">
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">
          Payment Options
        </h4>
        <div className="flex items-center gap-8 justify-center grayscale opacity-70 flex-wrap">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="mastercard"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg"
            alt="unionpay"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg"
            alt="diners"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
            alt="amex"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Discover_Card_logo.svg/250px-Discover_Card_logo.svg.png"
            alt="discover"
            className="h-4"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="visa"
            className="h-4"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="px-16">
        <div className="w-full h-px bg-white/10"></div>
      </div>

      {/* Copyright Bar */}
      <div className="px-16 py-8 flex flex-col items-center gap-4">
        <p className="text-sm text-gray-400 font-medium">
          © 2026 Otulia. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
