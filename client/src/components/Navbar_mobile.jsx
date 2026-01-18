import React from 'react'
import SearchBar from '../components/navbar_sidepanel/SearchBar'
import LoginButton from '../components/navbar/LoginButton'

const NavbarMobile = () => {
  return (
    <div className='px-3 py-2'>

      <button
          type="button"
          
          className="flex items-center p-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>

        </button>
      
      <div className='flex flex-col gap-3'>
      <SearchBar />
      <div className='flex items-center justify-between p-2'>
      <span>Cart</span>
      <span>2</span>
      </div>
      <LoginButton />
      </div>
      
    </div>
  )
}

export default NavbarMobile
