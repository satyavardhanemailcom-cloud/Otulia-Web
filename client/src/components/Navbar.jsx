import React from 'react'
import Cart from './navbar/Cart'
import Search from './navbar/Search'

const Navbar = () => {
  return (
    <nav className='absolute top-0 left-0 w-full z-20 font-sans px-16 py-8'>
      {/* Top Row: Logo, Search, Login, Cart */}
      <div className='flex items-center justify-between pb-6'>
        {/* Logo */}
        <div className='flex items-center'>
          <img src="/logos/otulia_logo_black.png" alt="OTULIA" className="h-16 object-contain" />
        </div>

        {/* Right Actions */}
        <div className='flex items-center gap-10'>
          <div className="w-96">
            <Search />
          </div>

          {/* Log In */}
          <button className="flex items-center gap-2 text-black font-normal hover:opacity-70 transition-opacity">
            {/* Solid User Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>
            <span className="text-lg">Log In</span>
          </button>

          <Cart />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-black mt-2"></div>

      {/* Bottom Row: Navigation Links */}
      <div className='flex justify-end pt-6 gap-16'>
        {['Shop All', 'Rent', 'Community', 'Sell With Us', 'Plans & Pricing'].map((link) => (
          <a key={link} href="#" className="text-black text-xl font-normal tracking-wide hover:underline underline-offset-4 decoration-1">
            {link}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
