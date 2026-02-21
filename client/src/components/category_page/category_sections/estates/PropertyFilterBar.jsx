import React, { useState, useEffect, useRef } from 'react';

const PropertyFilterBar = ({ onFilter, initialLocation = '' }) => {
  // State to track which filter is currently open (e.g., 'Price Range')
  const [activeFilter, setActiveFilter] = useState(null);

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    q: '',
    location: initialLocation,
    priceRange: 'Any Price',
    type: 'Any',
    bedrooms: 'Any',
    sizeLand: 'Any SqFt',
    bathrooms: 'Any',
    architecture: 'Any',
    amenities: 'Any',
    sort: 'Newest'
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  // Sync internal location with prop
  useEffect(() => {
    setSelectedFilters(prev => ({ ...prev, location: initialLocation }));
  }, [initialLocation]);

  // Fetch location suggestions
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (selectedFilters.location && selectedFilters.location.length > 0) {
        try {
          const response = await fetch(`/api/assets/location-suggestions?q=${selectedFilters.location}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch location suggestions", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [selectedFilters.location]);

  // Handle click outside for suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filters = [
    { label: 'Price Range', key: 'priceRange', options: ['Any Price', '$1M - $5M', '$5M - $10M', '$10M+'] },
    { label: 'Type', key: 'type', options: ['Any', 'Villa', 'Penthouse', 'Mansion', 'Estate'] },
    { label: 'Bedrooms', key: 'bedrooms', options: ['Any', '3+', '4+', '5+'] },
    { label: 'Size & Land', key: 'sizeLand', options: ['Any SqFt', '5000+ sqft', '10,000+ sqft'] },
    { label: 'Bathrooms', key: 'bathrooms', options: ['Any', '2+', '3+', '4+'] },
    { label: 'Architecture', key: 'architecture', options: ['Any', 'Modern', 'Classic', 'Mediterranean', 'Colonial'] },
    { label: 'Amenities', key: 'amenities', options: ['Any', 'Pool', 'Gym', 'Helipad', 'Theater'] },
    { label: 'Sort', key: 'sort', options: ['Newest', 'Oldest', 'Low to High', 'High to Low'] }
  ];

  const toggleFilter = (label) => {
    setActiveFilter(activeFilter === label ? null : label);
  };

  const handleSelect = (key, value) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
    setActiveFilter(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({ ...prev, [name]: value }));
    if (name === 'location') setShowSuggestions(true);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (onFilter) {
      onFilter(selectedFilters);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="w-full py-6 px-4 bg-white flex flex-col items-center relative z-20">
      
      <form onSubmit={handleSearch} className="flex flex-wrap items-center justify-center gap-4 w-full max-w-[1400px]">
        
        {/* Location Input with Suggestions */}
        <div className="relative min-w-[240px]" ref={locationRef}>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={selectedFilters.location}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-6 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base font-medium focus:outline-none focus:border-black transition-all montserrat"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-2 shadow-2xl left-0 p-2 overflow-hidden">
              {suggestions.map((s, idx) => (
                <li key={idx} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 text-sm font-medium transition-colors" onClick={() => {
                  setSelectedFilters(prev => ({ ...prev, location: s }));
                  setShowSuggestions(false);
                }}>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {filters.map((filter, index) => (
          <div key={index} className="relative">
            <button
              type="button"
              onClick={() => toggleFilter(filter.label)}
              className={`
                px-6 py-2.5
                border rounded-lg
                text-sm montserrat md:text-base font-medium
                transition-all duration-300
                whitespace-nowrap
                ${(selectedFilters[filter.key] && selectedFilters[filter.key] !== 'Any' && selectedFilters[filter.key] !== 'Any Price' && selectedFilters[filter.key] !== 'Any SqFt') || activeFilter === filter.label
                  ? 'bg-black text-white border-black shadow-md' 
                  : 'bg-white text-black border-gray-300 hover:border-black'
                }
              `}
            >
              {selectedFilters[filter.key] && selectedFilters[filter.key] !== 'Any' && selectedFilters[filter.key] !== 'Any Price' && selectedFilters[filter.key] !== 'Any SqFt'
                ? selectedFilters[filter.key]
                : filter.label}
            </button>

            {activeFilter === filter.label && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setActiveFilter(null)}
                ></div>

                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {filter.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 text-sm cursor-pointer transition-colors ${selectedFilters[filter.key] === option ? 'bg-[#9C824A]/10 text-[#9C824A] font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-black'}`}
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

        <button
          type="submit"
          className="
            px-10 py-3
            bg-black hover:bg-gray-800
            rounded-lg
            text-white montserrat text-xs font-bold
            shadow-lg hover:shadow-xl
            transition-all duration-300
            whitespace-nowrap
            uppercase tracking-widest
          "
        >
          Search
        </button>

      </form>
    </div>
  );
};

export default PropertyFilterBar;
