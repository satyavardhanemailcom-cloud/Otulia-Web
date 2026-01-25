import React, { useState } from 'react';

const SharedFilterBar = ({ onSearch }) => {
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ location, minPrice, maxPrice });
    };

    return (
        <div className="w-full flex justify-center p-4">
            <form onSubmit={handleSearch} className="
        w-full max-w-[1200px]
        bg-white border border-gray-200 
        rounded-2xl lg:rounded-full 
        p-4 lg:p-2 lg:pl-8
        flex flex-col lg:flex-row items-center justify-between gap-4
        shadow-sm transition-all duration-300
      ">

                {/* LABEL */}
                <div className="w-full lg:w-auto text-center lg:text-left border-b lg:border-none border-gray-100 pb-2 lg:pb-0">
                    <span className="font-playfair text-lg text-black whitespace-nowrap font-medium">
                        Filter :
                    </span>
                </div>

                {/* INPUTS GROUP */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-0 flex-1 lg:ml-8">

                    {/* Location Input */}
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Location (e.g. Dubai)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2.5 outline-none text-sm font-sans placeholder:text-gray-400"
                        />
                    </div>

                    <div className="hidden lg:block h-8 w-px bg-gray-200 mx-2"></div>

                    {/* Min Price */}
                    <div className="relative w-full">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full p-2.5 outline-none text-sm font-sans placeholder:text-gray-400"
                        />
                    </div>

                    <div className="hidden lg:block h-8 w-px bg-gray-200 mx-2"></div>

                    {/* Max Price */}
                    <div className="relative w-full">
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full p-2.5 outline-none text-sm font-sans placeholder:text-gray-400"
                        />
                    </div>

                </div>

                {/* SEARCH BUTTON */}
                <button
                    type="submit"
                    className="
            w-full lg:w-auto 
            bg-black hover:bg-gray-800 
            text-white font-sans text-sm font-bold
            px-8 py-3
            rounded-xl lg:rounded-full 
            transition-all duration-300 
            uppercase tracking-wider
          "
                >
                    Search
                </button>

            </form>
        </div>
    );
};

export default SharedFilterBar;
