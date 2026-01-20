import React from 'react'

const Trending_Search = () => {
  return (
    <div className='p-7'>
      
<form className="max-w-md mx-auto">   
    <label for="search" className="block mb-2.5 text-sm font-medium text-heading sr-only ">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
        </div>
        <input type="search" id="search" className="block w-80 md:w-100 p-3 ps-9 bg-neutral-secondary-medium border border-black bg-white text-heading text-sm rounded-lg focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Search" required />
        <button type="button" className="absolute end-1.5 bottom-1.5 text-white bg-blue-400 hover:bg-blue-500 montserrat bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none cursor-pointer">Search</button>
    </div>
</form>

    </div>
  )
}

export default Trending_Search
