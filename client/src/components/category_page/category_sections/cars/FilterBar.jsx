import React, { useState } from 'react';

// Reusable Chevron Icon
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const FilterBar = () => {
  // State to handle filter values
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
      {/* Mobile: Rounded rectangle with padding. Desktop: Long pill shape. */}
      <form className="
        w-full max-w-[1200px]
        bg-white border border-gray-400 
        rounded-2xl md:rounded-full 
        p-4 md:p-2 md:pl-8
        flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2
        shadow-sm
      ">
        
        {/* LABEL: "Filter By :" */}
        <div className="w-full md:w-auto text-center md:text-left">
          <span className="font-serif text-xl md:text-2xl text-black whitespace-nowrap">
            Filter By :
          </span>
        </div>

        {/* INPUTS GROUP */}
        {/* Mobile: Grid layout. Desktop: Flex row. */}
        <div className="w-full grid grid-cols-2 md:flex md:items-center gap-3 md:gap-0">
          
          {/* 1. Category (Supercars) */}
          <div className="relative group w-full md:w-auto">
            <select 
              name="category" 
              value={filters.category}
              onChange={handleChange}
              className="w-full md:w-auto appearance-none border border-gray-400 rounded-full py-2 pl-4 pr-10 bg-white text-black font-serif text-base focus:outline-none focus:border-[#B8860B] cursor-pointer hover:border-gray-600 transition-colors"
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
          <div className="hidden md:block h-8 w-px bg-gray-300 mx-3"></div>

          {/* 2. Brand */}
          <div className="relative group w-full md:w-auto">
            <select 
              name="brand" 
              className="w-full md:w-auto appearance-none border border-gray-400 rounded-full py-2 pl-4 pr-10 bg-white text-black font-serif text-base focus:outline-none focus:border-[#B8860B] cursor-pointer hover:border-gray-600 transition-colors"
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
          <div className="hidden md:block h-8 w-px bg-gray-300 mx-3"></div>

          {/* 3. Model */}
          <div className="relative group w-full md:w-auto">
            <select 
              name="model" 
              className="w-full md:w-auto appearance-none border border-gray-400 rounded-full py-2 pl-4 pr-10 bg-white text-black font-serif text-base focus:outline-none focus:border-[#B8860B] cursor-pointer hover:border-gray-600 transition-colors"
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
          <div className="hidden md:block h-8 w-px bg-gray-300 mx-3"></div>

          {/* 4. Country */}
          <div className="relative group w-full md:w-auto">
            <select 
              name="country" 
              className="w-full md:w-auto appearance-none border border-gray-400 rounded-full py-2 pl-4 pr-10 bg-white text-black font-serif text-base focus:outline-none focus:border-[#B8860B] cursor-pointer hover:border-gray-600 transition-colors"
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
          <div className="hidden md:block h-8 w-px bg-gray-300 mx-3"></div>

          {/* 5. Price (Spans 2 columns on mobile to fill gap) */}
          <div className="relative group w-full md:w-auto col-span-2 md:col-span-1">
            <select 
              name="price" 
              className="w-full md:w-auto appearance-none border border-gray-400 rounded-full py-2 pl-4 pr-10 bg-white text-black font-serif text-base focus:outline-none focus:border-[#B8860B] cursor-pointer hover:border-gray-600 transition-colors"
            >
              <option value="" disabled selected>Price</option>
              <option>Low to High</option>
              <option>High to Low</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown />
            </div>
          </div>

        </div>

        {/* SEARCH BUTTON */}
        <button 
          type="button"
          className="
            w-full md:w-auto 
            bg-[#9C824A] hover:bg-[#856d3a] 
            text-white font-serif text-lg 
            px-8 py-2 md:py-2.5 
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