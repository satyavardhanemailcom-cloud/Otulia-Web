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
        className="block w-full p-3 pl-10 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
          <XCircleIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
