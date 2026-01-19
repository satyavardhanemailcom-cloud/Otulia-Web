import React from 'react'
import { NavLink } from 'react-router-dom'
import  Profile_dropdown from '../navbar/Profile_dropdown'
import Cart from '../navbar/Cart'

const Trending_Navbar = () => {
  return (
    <div>
      <nav className='flex items-center justify-between p-4 bg-white/40 m-7 rounded-full'>
        <img
        className="w-[110px] md:w-[170px] h-[25px] md:h-[45px] object-contain"
        alt="logo"
        src="/logos/logo.png"
        title="Otulia"
      />
        <div className='flex items-center justify-center gap-5 md:gap-17'>
        {/* Correct Usage: className takes a function with { isActive } */}
        <NavLink 
          to="/trending/cars" 
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#F8F8F8] py-2 px-3 montserrat'}
        >
          Cars
        </NavLink>

        <NavLink 
          to="/trending/estates"
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#F8F8F8] py-2 px-3 montserrat'}
        >
          Estates
        </NavLink>

        <NavLink 
          to="/trending/yachts"
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#F8F8F8] py-2 px-3 montserrat'}
        >
          Yachts
        </NavLink>
        <NavLink 
          to="/trending/bikes"
          className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'text-[#F8F8F8] py-2 px-3 montserrat'}
        >
          Bikes
        </NavLink>
        </div>

        <div className='flex items-center justify-center gap-3 mr-3'>
          <Profile_dropdown />
          <Cart />
        </div>
        
      </nav>
    </div>
  )
}

export default Trending_Navbar
