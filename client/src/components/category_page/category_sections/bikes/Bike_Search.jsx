import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Bike_Search = () => {
  const [activeType, setActiveType] = useState('Buy'); // State for Buy/Rent toggle
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const response = await fetch(`/api/assets/location-suggestions?q=${query}`);
          const data = await response.json();
          // Assuming data is an array of strings (locations)
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch location suggestions", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission if this is called from a form
    let searchLocation = query;
    if (activeSuggestion > -1 && suggestions[activeSuggestion]) {
      searchLocation = suggestions[activeSuggestion];
    }

    if (searchLocation.trim()) {
      const acquisition = activeType.toLowerCase();
      navigate(`/category/bikes?location=${searchLocation.trim()}&acquisition=${acquisition}`);
      setSuggestions([]); // Clear suggestions after search
      setQuery(searchLocation.trim()); // Update query to the selected suggestion
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      e.preventDefault(); // Prevent cursor movement in input
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0));
      e.preventDefault(); // Prevent cursor movement in input
    } else if (e.key === 'Enter') {
      handleSearch(e); // Trigger search
    }
  };

  return (
    <div className="w-full flex justify-center p-4">

      {/* MAIN CONTAINER */}
      <div className="
        w-full max-w-[900px]
        bg-white 
        border border-[#B8860B] /* Gold Border */
        rounded-2xl md:rounded-full 
        flex flex-col md:flex-row items-center 
        shadow-sm
      " ref={searchContainerRef}>

        {/* 1. INPUT SECTION */}
        <div className="w-full md:flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setActiveSuggestion(-1)}
            placeholder="Search By Location"
            className="
              w-full h-14 md:h-16 
              px-6 
              text-gray-700 placeholder-gray-400 
              montserrat text-sm md:text-base 
              focus:outline-none
              bg-transparent
            "
          />
          {suggestions.length > 0 && query.length > 0 && (
            <ul className="absolute z-10 w-full bg-[#F8F8F8] border border-gray-300 rounded-b-md shadow-lg text-black top-full left-0">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${index === activeSuggestion ? 'bg-gray-200' : ''}`}
                  onMouseDown={(e) => { // Use onMouseDown to prevent onBlur from firing before onClick
                    e.preventDefault();
                    setQuery(suggestion);
                    setSuggestions([]);
                    navigate(`/category/bikes?location=${suggestion}&acquisition=${activeType.toLowerCase()}`);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {suggestions.length === 0 && query.length > 0 && (
            <ul className="absolute z-10 w-full bg-[#F8F8F8] border border-gray-300 rounded-b-md shadow-lg text-black top-full left-0">
              <li className="p-2 text-gray-500">No location found</li>
            </ul>
          )}
        </div>

        {/* DIVIDER (Desktop Only) */}
        <div className="hidden md:block h-8 w-px bg-[#B8860B] opacity-50"></div>

        {/* 2. TOGGLE SECTION (Buy / Rent) */}
        <div className="
          w-full md:w-auto 
          flex items-center justify-center gap-1 
          p-2 md:px-4
        ">
          {/* BUY BUTTON */}
          <button
            onClick={() => setActiveType('Buy')}
            className={`
              px-6 py-2 rounded-md font-sans font-medium transition-colors duration-300
              ${activeType === 'Buy'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white text-black hover:bg-gray-50'
              }
            `}
          >
            Buy
          </button>

          {/* RENT BUTTON */}
          <button
            onClick={() => setActiveType('Rent')}
            className={`
              px-6 py-2 rounded-md font-sans font-medium transition-colors duration-300
              ${activeType === 'Rent'
                ? 'bg-[#C5A059] text-black'
                : 'bg-white text-black hover:bg-gray-50'
              }
            `}
          >
            Rent
          </button>
        </div>

        {/* 3. SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className="
          w-full md:w-auto 
          h-14 md:h-16 
          px-10 md:px-12 
          bg-[#9C824A] hover:bg-[#856d3a] /* Darker Gold/Brown */
          text-white 
          montserrat text-xl md:text-2xl 
          flex items-center justify-center
          transition-colors duration-300
          rounded-r-full
        ">
          Search
        </button>

      </div>
    </div>
  );
};

export default Bike_Search;