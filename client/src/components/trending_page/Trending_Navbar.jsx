import React from 'react'
import { NavLink } from 'react-router-dom'

const Trending_Navbar = () => {
  return (
    <div>
      <nav className='flex items-center justify-center gap-5 md:gap-17 p-7'>
        {/* Correct Usage: className takes a function with { isActive } */}
        <NavLink 
          to="/trending/cars" 
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#2C2C2C] py-2 px-3 montserrat'}
        >
          Cars
        </NavLink>

        <NavLink 
          to="/trending/estates"
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#2C2C2C] py-2 px-3 montserrat'}
        >
          Estates
        </NavLink>

        <NavLink 
          to="/trending/yachts"
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#2C2C2C] py-2 px-3 montserrat'}
        >
          Yachts
        </NavLink>

        {/* Note: 'Bikes' likely out of scope for Otulia, but kept for your code */}
        <NavLink 
          to="/trending/bikes"
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#2C2C2C] py-2 px-3 montserrat'}
        >
          Bikes
        </NavLink>
      </nav>
    </div>
  )
}

export default Trending_Navbar
