import React, { useState } from 'react';

const SortDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Newest');

  // Updated options list
  const options = ['Newest', 'Oldest'];

  return (
    <div className="relative inline-block text-left">
      
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 
          bg-white 
          border border-gray-400 
          rounded-xl 
          px-4 py-2 
          hover:bg-gray-50 transition-colors
          cursor-pointer
        "
      >
        {/* ICON: Sort Descending */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-black"
        >
          <path d="M4 12l4 4 4-4" />
          <path d="M8 4v12" />
          <path d="M16 6h6" />
          <path d="M16 10h4" />
          <path d="M16 14h2" />
        </svg>

        {/* TEXT LABEL */}
        <div className="text-[13px] md:text-lg text-black select-none montserrat">
          <span className="font-bold">Sort : </span>
          <span>{selectedSort}</span>
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <>
          {/* Transparent backdrop to handle closing */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute -right-1 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  setSelectedSort(option);
                  setIsOpen(false);
                  // Add your actual sort logic function here later
                  // e.g., onSortChange(option);
                }}
                className={`
                  px-4 py-3 text-sm cursor-pointer transition-colors
                  ${selectedSort === option ? 'bg-gray-100 font-bold text-black' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                {option}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;