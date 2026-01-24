import React, { useState } from 'react';

const Bike_Search = () => {
    const [activeType, setActiveType] = useState('Buy'); // State for Buy/Rent toggle
    const [query, setQuery] = useState('');

    return (
        <div className="w-full flex justify-center p-4">

            {/* MAIN CONTAINER */}
            <div className="
        w-full max-w-[900px]
        bg-white 
        border border-[#B8860B] /* Gold Border */
        rounded-2xl md:rounded-full 
        flex flex-col md:flex-row items-center 
        overflow-hidden 
        shadow-sm
      ">

                {/* 1. INPUT SECTION */}
                <div className="w-full md:flex-1 relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search By Model, Brand or Type"
                        className="
              w-full h-14 md:h-16 
              px-6 
              text-gray-700 placeholder-gray-400 
              montserrat text-sm md:text-base 
              focus:outline-none
              bg-transparent
            "
                    />
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
                <button className="
          w-full md:w-auto 
          h-14 md:h-16 
          px-10 md:px-12 
          bg-[#9C824A] hover:bg-[#856d3a] /* Darker Gold/Brown */
          text-white 
          montserrat text-xl md:text-2xl 
          flex items-center justify-center
          transition-colors duration-300
        ">
                    Search
                </button>

            </div>
        </div>
    );
};

export default Bike_Search;
