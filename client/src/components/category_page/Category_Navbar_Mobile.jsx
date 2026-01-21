import React from 'react';
import SearchBar from '../navbar_sidepanel/SearchBar';
import { NavLink } from 'react-router-dom';
import LoginButton from '../navbar/LoginButton';
import Cart from '../navbar/Cart';

const Category_Navbar_Mobile = ({navLinks}) => {
  return (
    <div className='px-5 py-2'>
      <div className='flex flex-col gap-3 text-[#2C2C2C]'>
        <div className='flex flex-col gap-3 mt-5'>
          {navLinks.map(link => (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat w-fit' : 'py-2 px-3 montserrat'}
            >
              {link.text}
            </NavLink>
          ))}
        </div>
        <div className='flex items-center justify-between p-2 montserrat text-lg'>
            <span>Cart</span>
            <span>2</span>
        </div>
        <LoginButton />
      </div>
    </div>
  )
}

export default Category_Navbar_Mobile