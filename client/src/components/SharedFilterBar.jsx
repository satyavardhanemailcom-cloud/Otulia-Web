import React, { useState, useEffect, useRef } from "react";
import SortDropdown from "./category_page/category_sections/SortDropdown";

const SharedFilterBar = ({ onSearch, initialLocation = "" }) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(initialLocation);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("Newest");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
    }
  }, [initialLocation]);

  // Fetch location suggestions
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (location && location.length > 0) {
        try {
          const response = await fetch(
            `/api/assets/location-suggestions?q=${location}`,
          );
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
  }, [location]);

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

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    onSearch({ q: query, location, minPrice, maxPrice, sort });
    setShowSuggestions(false);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    // Optionally trigger search immediately on sort change
    onSearch({ q: query, location, minPrice, maxPrice, sort: newSort });
  };

  return (
    <div className="w-full flex justify-center p-4">
      <form
        onSubmit={handleSearch}
        className="
        w-full max-w-[1200px]
        bg-white border border-gray-200 
        rounded-2xl lg:rounded-full 
        p-4 lg:p-2 lg:pl-8
        flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2
        shadow-md transition-all duration-300
      "
      >
        {/* LABEL */}
        <div className="w-full lg:w-auto text-center lg:text-left border-b lg:border-r lg:border-b-0 border-gray-100 pb-2 lg:pb-0 lg:pr-6">
          <span className="canela text-lg text-black whitespace-nowrap font-bold">
            Filter :
          </span>
        </div>

        {/* INPUTS GROUP */}
        <div className="w-full flex flex-col md:flex-row lg:flex-1 items-center gap-4 lg:gap-0">
          {/* Location Input with Suggestions */}
          <div className="relative w-full lg:flex-1 px-4" ref={locationRef}>
            <input
              type="text"
              placeholder="Location (e.g. Dubai)"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full p-2.5 outline-none text-sm font-sans placeholder:text-gray-400 text-black font-medium"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-2 shadow-2xl left-0 p-2 overflow-hidden">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 text-sm font-medium transition-colors"
                    onClick={() => {
                      setLocation(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hidden lg:block h-8 w-px bg-gray-100"></div>

          {/* Min Price */}
          <div className="relative w-full lg:flex-1 px-4">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2.5 outline-none text-sm font-sans placeholder:text-gray-400 text-black font-medium"
            />
          </div>

          <div className="hidden lg:block h-8 w-px bg-gray-100"></div>

          {/* Max Price */}
          <div className="relative w-full lg:flex-1 px-4">
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2.5 outline-none text-sm font-sans placeholder:text-gray-400 text-black font-medium"
            />
          </div>

          <div className="hidden lg:block h-8 w-px bg-gray-100"></div>

          {/* Sort */}
          <div className="relative w-full lg:flex-1 px-4 flex justify-center lg:justify-start">
            <SortDropdown currentSort={sort} onSortChange={handleSortChange} />
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="submit"
          className="
            w-full lg:w-auto 
            bg-black hover:bg-gray-800 
            text-white font-sans text-xs font-bold
            px-10 py-3.5
            rounded-xl lg:rounded-full 
            transition-all duration-300 
            uppercase tracking-widest
          "
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SharedFilterBar;
