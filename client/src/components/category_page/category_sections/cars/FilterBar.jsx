import React, { useState, useRef, useEffect } from 'react';

// Reusable Chevron Icon
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// --- NEW COMPONENT: Auto-Width Dropdown ---
const AutoWidthDropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full xl:w-auto" ref={dropdownRef}>
      {/* TRIGGER BUTTON (Auto-width based on content) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full xl:w-auto
          flex items-center justify-between xl:justify-start gap-2
          border border-gray-300
          rounded-lg xl:rounded-full 
          py-2.5 px-4 
          bg-white hover:bg-gray-50
          transition-colors
          whitespace-nowrap
        "
      >
        <span className="text-black montserrat text-base">
          {value || label}
        </span>
        <ChevronDown />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="
          absolute z-50 mt-2 min-w-[150px] w-full xl:w-auto
          bg-white border border-gray-200 rounded-lg shadow-lg 
          max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100
        ">
          {/* Header option (Reset) */}
          <div 
            className="px-4 py-2 text-gray-400 text-sm cursor-pointer hover:bg-gray-50"
            onClick={() => handleSelect('')}
          >
            {label}
          </div>
          {/* Options */}
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`
                px-4 py-2 cursor-pointer transition-colors montserrat text-sm
                ${value === opt ? 'bg-[#9C824A]/10 text-[#9C824A] font-medium' : 'text-gray-700 hover:bg-gray-50 hover:text-black'}
              `}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterBar = () => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    model: '',
    country: '',
    price: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full flex justify-center p-4">
      
      {/* MAIN CONTAINER */}
      <form className="
        w-full max-w-[1400px]
        bg-white border border-gray-300 
        rounded-2xl xl:rounded-full 
        p-4 xl:p-2 xl:pl-8
        flex flex-col xl:flex-row items-center justify-between gap-4 xl:gap-2
        shadow-sm transition-all duration-300
      ">
        
        {/* LABEL */}
        <div className="w-full xl:w-auto text-center xl:text-left border-b xl:border-none border-gray-100 pb-2 xl:pb-0">
          <span className="montserrat text-lg xl:text-xl text-black whitespace-nowrap font-medium">
            Filter By :
          </span>
        </div>

        {/* INPUTS GROUP */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:flex xl:items-center gap-4 xl:gap-0">
          
          <AutoWidthDropdown 
            label="Category" 
            value={filters.category} 
            options={['Supercars', 'Luxury Sedans', 'Ultra-Luxury']}
            onChange={(val) => handleFilterChange('category', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-white mx-2"></div>

          <AutoWidthDropdown 
            label="Brand" 
            value={filters.brand} 
            options={['Ferrari', 'Lamborghini', 'Porsche']}
            onChange={(val) => handleFilterChange('brand', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-white mx-2"></div>

          <AutoWidthDropdown 
            label="Model" 
            value={filters.model} 
            options={['Aventador', 'Huracan', '911 GT3']}
            onChange={(val) => handleFilterChange('model', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-white mx-2"></div>

          <AutoWidthDropdown 
            label="Country" 
            value={filters.country} 
            options={['Italy', 'Germany', 'UK']}
            onChange={(val) => handleFilterChange('country', val)}
          />

          <div className="hidden xl:block h-8 w-px bg-white mx-2"></div>

          {/* Price - Spans 2 cols on mobile */}
          <div className="col-span-2 md:col-span-1 xl:col-span-auto w-full xl:w-auto">
            <AutoWidthDropdown 
              label="Price" 
              value={filters.price} 
              options={['Low to High', 'High to Low']}
              onChange={(val) => handleFilterChange('price', val)}
            />
          </div>

          {/* SEARCH BUTTON (Mobile/Tablet) */}
          <div className="xl:hidden w-full col-span-2 md:col-span-1">
             <button 
              type="button"
              className="w-full bg-[#9C824A] hover:bg-[#856d3a] text-white montserrat font-medium py-2.5 rounded-lg shadow-md transition-all"
            >
              Search
            </button>
          </div>

        </div>

        {/* SEARCH BUTTON (Desktop) */}
        <button 
          type="button"
          className="
            hidden xl:block
            w-auto 
            bg-[#9C824A] hover:bg-[#856d3a] 
            text-white montserrat text-lg 
            px-8 py-2.5 
            rounded-full 
            transition-all duration-300 
            shadow-md hover:shadow-lg
          "
        >
          Search
        </button>

      </form>
    </div>
  );
};

export default FilterBar;