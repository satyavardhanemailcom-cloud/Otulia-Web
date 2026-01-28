import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Optional: npm install @heroicons/react

const SearchBar = () => {
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

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

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
    <div className="relative w-full max-w-md mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSearch}>
        {/* Search Icon (Left) */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>

        <input
          type="text"
          className="block w-[95%] p-3 pl-10 pr-10 text-sm text-gray-900 border-b border-b-gray-300 focus:bg-gray-50"
          placeholder="Search for items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Clear Button (Right) - Only visible if there is text */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${index === activeSuggestion ? 'bg-gray-100' : ''}`}
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
  );
};

export default SearchBar;
