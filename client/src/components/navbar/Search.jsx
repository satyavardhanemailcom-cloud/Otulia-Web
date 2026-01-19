import React from 'react'

const Search = () => {
  return (
    <>
      <form className="max-w-md mx-auto">
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
    
    /* THE FIX: TARGETING THE CROSS BUTTON */
    /* 1. cursor-pointer: Makes it look clickable */
    /* 2. brightness-0: Turns the default grey icon purely black */
    /* 3. grayscale: Removes any other color artifacts */
    [&::-webkit-search-cancel-button]:cursor-pointer
    [&::-webkit-search-cancel-button]:brightness-0
    [&::-webkit-search-cancel-button]:grayscale
  " 
  placeholder="Search" 
/>
        </div>
      </form>

    </>
  )
}

export default Search