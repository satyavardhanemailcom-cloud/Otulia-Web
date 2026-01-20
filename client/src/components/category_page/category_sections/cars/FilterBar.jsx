import React, { useState } from 'react';

// Reusable Chevron Icon
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const FilterBar = () => {
  const [filters, setFilters] = useState({
    category: 'Supercars',
    brand: '',
    model: '',
    country: '',
    price: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full flex justify-center p-4">
      
      {/* MAIN CONTAINER */}
      {/* RESPONSIVE LOGIC:
         - Mobile/Tablet: Rounded Rect (flex-col)
         - Desktop (xl): Long Pill (flex-row) 
      */}
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
        {/* RESPONSIVE GRID:
           - Mobile: grid-cols-2 (2 items per row)
           - Tablet (md): grid-cols-3 (3 items per row, fits nicely)
           - Desktop (xl): flex (Single line)
        */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:flex xl:items-center gap-4 xl:gap-0">
          
          {/* 1. Category */}
          <div className="relative group w-full xl:w-auto">
            <select 
              name="category" 
              value={filters.category}
              onChange={handleChange}
              className="w-full xl:w-auto appearance-none border border-gray-200 xl:border-transparent rounded-lg xl:rounded-full py-2.5 px-4 bg-gray-50 xl:bg-white text-black montserrat text-base focus:outline-none focus:border-[#B8860B] focus:bg-white cursor-pointer hover:bg-gray-100 xl:hover:bg-transparent transition-colors"
            >
              <option>Supercars</option>
              <option>Luxury Sedans</option>
              <option>Ultra-Luxury</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>

          {/* DIVIDER (Desktop Only) */}
          <div className="hidden xl:block h-8 w-px bg-gray-300 mx-2"></div>

          {/* 2. Brand */}
          <div className="relative group w-full xl:w-auto">
            <select 
              name="brand" 
              className="w-full xl:w-auto appearance-none border border-gray-200 xl:border-transparent rounded-lg xl:rounded-full py-2.5 px-4 bg-gray-50 xl:bg-white text-black montserrat text-base focus:outline-none focus:border-[#B8860B] focus:bg-white cursor-pointer hover:bg-gray-100 xl:hover:bg-transparent transition-colors"
            >
              <option value="" disabled selected>Brand</option>
              <option>Ferrari</option>
              <option>Lamborghini</option>
              <option>Porsche</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>

          {/* DIVIDER (Desktop Only) */}
          <div className="hidden xl:block h-8 w-px bg-gray-300 mx-2"></div>

          {/* 3. Model */}
          <div className="relative group w-full xl:w-auto">
            <select 
              name="model" 
              className="w-full xl:w-auto appearance-none border border-gray-200 xl:border-transparent rounded-lg xl:rounded-full py-2.5 px-4 bg-gray-50 xl:bg-white text-black montserrat text-base focus:outline-none focus:border-[#B8860B] focus:bg-white cursor-pointer hover:bg-gray-100 xl:hover:bg-transparent transition-colors"
            >
              <option value="" disabled selected>Model</option>
              <option>Aventador</option>
              <option>Huracan</option>
              <option>911 GT3</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>

          {/* DIVIDER (Desktop Only) */}
          <div className="hidden xl:block h-8 w-px bg-gray-300 mx-2"></div>

          {/* 4. Country */}
          <div className="relative group w-full xl:w-auto">
            <select 
              name="country" 
              className="w-full xl:w-auto appearance-none border border-gray-200 xl:border-transparent rounded-lg xl:rounded-full py-2.5 px-4 bg-gray-50 xl:bg-white text-black montserrat text-base focus:outline-none focus:border-[#B8860B] focus:bg-white cursor-pointer hover:bg-gray-100 xl:hover:bg-transparent transition-colors"
            >
              <option value="" disabled selected>Country</option>
              <option>Italy</option>
              <option>Germany</option>
              <option>UK</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>

          {/* DIVIDER (Desktop Only) */}
          <div className="hidden xl:block h-8 w-px bg-gray-300 mx-2"></div>

          {/* 5. Price */}
          {/* Spans 2 cols on mobile, 1 on tablet/desktop */}
          <div className="relative group w-full xl:w-auto col-span-2 md:col-span-1">
            <select 
              name="price" 
              className="w-full xl:w-auto appearance-none border border-gray-200 xl:border-transparent rounded-lg xl:rounded-full py-2.5 px-4 bg-gray-50 xl:bg-white text-black montserrat text-base focus:outline-none focus:border-[#B8860B] focus:bg-white cursor-pointer hover:bg-gray-100 xl:hover:bg-transparent transition-colors"
            >
              <option value="" disabled selected>Price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>

          {/* SEARCH BUTTON (Mobile/Tablet Only Placement) */}
          {/* On Tablet, this moves to the last grid cell to fill the space */}
          <div className="xl:hidden w-full col-span-2 md:col-span-1">
             <button 
              type="button"
              className="w-full bg-[#9C824A] hover:bg-[#856d3a] text-white montserrat font-medium py-2.5 rounded-lg shadow-md transition-all"
            >
              Search
            </button>
          </div>

        </div>

        {/* SEARCH BUTTON (Desktop Only Placement) */}
        {/* Keeps the 'Pill' look clean on large screens */}
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