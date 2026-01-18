import React from 'react'
import Cart from './navbar/Cart'
import Search from './navbar/Search'

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between p-6'>
      <img className='w-[200px] h-[60px]' alt="logo" src="logos/logo_inverted.png" title='Otulia' />
      <ul className='flex items-center justify-center gap-8'>
        <li>
            <Search />
          </li>

          {/* Log In */}
        <li>
          <button className="flex items-center gap-2 text-black font-normal hover:opacity-70 transition-opacity">
            {/* Solid User Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>
            <span className="text-lg">Log In</span>
          </button>
        </li>
          <li>
          <Cart />
          </li>

          
        </ul>

    </nav> 
  )
}

export default Navbar
