import React, { useState } from 'react';
import { XCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Optional: npm install @heroicons/react

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
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
    </div>
  );
};

export default SearchBar;
