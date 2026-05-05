<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';

const SortDropdown = ({ onSortChange, currentSort = 'Newest' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Updated options list
  const options = ['Newest', 'Oldest', 'Low to High', 'High to Low'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-5
          bg-white 
          border border-gray-200 
          rounded-full 
          pl-6 pr-5 py-3 
          hover:border-black hover:shadow-sm transition-all duration-300
          cursor-pointer
          group
        "
      >
        <div className="flex flex-col items-start leading-none">
           <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 montserrat mb-1">Sort by</span>
           <span className="text-[15px] font-medium text-black canela">{currentSort}</span>
        </div>
        
        <div className={`
          flex items-center justify-center transition-transform duration-300
          ${isOpen ? 'rotate-180' : ''}
        `}>
          <svg 
            className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 md:left-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-50 overflow-hidden py-2 animate-fade-in origin-top">
          <div className="px-6 py-2 mb-1 border-b border-gray-50">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 montserrat">Select Order</span>
          </div>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                if (onSortChange) onSortChange(option);
                setIsOpen(false);
              }}
              className={`
                w-full px-6 py-3.5 text-left text-[13px] montserrat transition-all duration-200 flex items-center justify-between
                ${currentSort === option 
                  ? 'bg-black text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black'}
              `}
            >
              <span className={currentSort === option ? "font-semibold" : "font-normal"}>{option}</span>
              {currentSort === option && (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

=======
import React, { useState } from 'react';

const SortDropdown = ({ onSortChange, currentSort = 'Newest' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Updated options list
  const options = ['Newest', 'Oldest', 'Low to High', 'High to Low'];

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
          <span>{currentSort}</span>
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

          <div className="absolute left mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  if (onSortChange) onSortChange(option);
                  setIsOpen(false);
                }}
                className={`
                  px-4 py-3 text-sm montserrat cursor-pointer transition-colors
                  ${currentSort === option ? 'bg-gray-100 font-bold text-black' : 'text-gray-700 hover:bg-gray-50'}
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

>>>>>>> 3edc3346474f28c49f8469b1ffb519a670809c77
export default SortDropdown;