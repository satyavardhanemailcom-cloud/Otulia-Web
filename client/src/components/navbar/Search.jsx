import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length > 0) {
        try {
          const response = await fetch(`/api/assets/suggestions?q=${query}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch suggestions", error);
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
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${query.trim()}`);
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (activeSuggestion > -1 && suggestions[activeSuggestion]) {
        setQuery(suggestions[activeSuggestion]);
        handleSearch(e);
      }
    }
  };

  return (
    <div className="relative max-w-md mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearch}>
        <label htmlFor="search" className="block mb-2.5 text-sm font-medium sr-only">Search</label>
        
        <div className="relative">
          {/* Search Icon - Forced Black */}
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg 
              className="w-4 h-4 text-black" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
            </svg>
          </div>

          {/* Input Field */}
          <input 
            type="search" 
            id="search" 
            className="
              block w-full p-2 ps-9 text-sm rounded-md
              bg-transparent 
              text-black 
              border border-black
              placeholder-[#2C2C2C]
              
              /* Focus State */
              focus:outline-none 
              focus:border-black 
              focus:ring-1 
              focus:ring-black
              
              [&::-webkit-search-cancel-button]:cursor-pointer
              [&::-webkit-search-cancel-button]:brightness-0
              [&::-webkit-search-cancel-button]:grayscale
            " 
            placeholder="Search" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        </div>
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-[#F8F8F8] border border-gray-300 rounded-md mt-1 shadow-lg text-black">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${index === activeSuggestion ? 'bg-gray-200' : ''}`}
              onClick={() => {
                setQuery(suggestion);
                setSuggestions([]);
                navigate(`/shop?q=${suggestion}`);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Search;