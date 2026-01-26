import React, { useState } from 'react';

const PropertyFilterBar = ({ onFilter }) => {
  // State to track which filter is currently open (e.g., 'Price Range')
  const [activeFilter, setActiveFilter] = useState(null);

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'Any Price',
    type: 'Any',
    bedrooms: 'Any',
    sizeLand: 'Any SqFt',
    bathrooms: 'Any',
    architecture: 'Any',
    amenities: 'Any'
  });

  const filters = [
    { label: 'Price Range', key: 'priceRange', options: ['Any Price', '£1M - £5M', '£5M - £10M', '£10M+'] },
    { label: 'Type', key: 'type', options: ['Any', 'Villa', 'Penthouse', 'Mansion', 'Estate'] },
    { label: 'Bedrooms', key: 'bedrooms', options: ['Any', '3+', '4+', '5+'] },
    { label: 'Size & Land', key: 'sizeLand', options: ['Any SqFt', '5000+ sqft', '10,000+ sqft'] },
    { label: 'Bathrooms', key: 'bathrooms', options: ['Any', '2+', '3+', '4+'] },
    { label: 'Architecture', key: 'architecture', options: ['Any', 'Modern', 'Classic', 'Mediterranean', 'Colonial'] },
    { label: 'Amenities', key: 'amenities', options: ['Any', 'Pool', 'Gym', 'Helipad', 'Theater'] }
  ];

  const toggleFilter = (label) => {
    // If clicking the same button, close it. Otherwise, open the new one.
    setActiveFilter(activeFilter === label ? null : label);
  };

  const handleSelect = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
    setActiveFilter(null);
  };

  const handleSearch = () => {
    if (onFilter) {
      onFilter(selectedFilters);
    }
  };

  return (
    <div className="w-full py-6 px-4 bg-white flex justify-center relative z-20">

      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-[1400px]">

        {filters.map((filter, index) => (
          <div key={index} className="relative">
            {/* THE BUTTON */}
            <button
              onClick={() => toggleFilter(filter.label)}
              className={`
                px-6 py-2.5
                border rounded-lg
                text-sm montserrat md:text-base font-medium
                transition-all duration-300
                whitespace-nowrap
                ${(selectedFilters[filter.key] && selectedFilters[filter.key] !== 'Any' && selectedFilters[filter.key] !== 'Any Price' && selectedFilters[filter.key] !== 'Any SqFt') || activeFilter === filter.label
                  ? 'bg-black text-white border-black' // Active Style
                  : 'bg-white text-black border-gray-300 hover:border-[#B8860B] hover:text-[#B8860B]' // Inactive Style
                }
              `}
            >
              {selectedFilters[filter.key] && selectedFilters[filter.key] !== 'Any' && selectedFilters[filter.key] !== 'Any Price' && selectedFilters[filter.key] !== 'Any SqFt'
                ? selectedFilters[filter.key]
                : filter.label}
            </button>

            {/* THE DROPDOWN MENU (Only shows if active) */}
            {activeFilter === filter.label && (
              <>
                {/* Backdrop to close when clicking outside */}
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setActiveFilter(null)}
                ></div>

                {/* The Menu Box */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {filter.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${selectedFilters[filter.key] === option ? 'bg-gray-100 text-[#B8860B] font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-[#B8860B]'}`}
                      onClick={() => handleSelect(filter.key, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="
            px-8 py-2.5
            bg-[#C5A059] hover:bg-[#9C824A]
            border border-[#C5A059] hover:border-[#9C824A]
            rounded-lg
            text-white montserrat text-sm md:text-base font-medium
            shadow-sm hover:shadow-md
            transition-all duration-300
            whitespace-nowrap
          "
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default PropertyFilterBar;