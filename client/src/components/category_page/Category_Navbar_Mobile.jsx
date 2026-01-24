import React from 'react';
import SearchBar from '../navbar_sidepanel/SearchBar';
import { NavLink } from 'react-router-dom';
import LoginButton from '../navbar/LoginButton';
import Cart from '../navbar/Cart';
import { useAuth } from '../../contexts/AuthContext'; 

const Category_Navbar_Mobile = ({navLinks}) => {
  // 1. Get loading state
  const { isAuthenticated, loading } = useAuth(); 

  return (
    <div className='px-5 py-2'>
      <div className='flex flex-col gap-3 text-[#2C2C2C]'>
        
        {/* Navigation Links */}
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

        {/* 2. Auth Section with Loading Check */}
        {loading ? (
           // Skeleton loader to prevent UI jump
           <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse mt-4"></div>
        ) : (
           <>
              {isAuthenticated ? (
                <div className='flex items-center justify-between p-2 montserrat text-lg'>
                  <Cart />
                </div>
              ) : (
                <div className='mt-2'>
                   <LoginButton />
                </div>
              )}
           </>
        )}
        
      </div>
    </div>
  )
}

export default Category_Navbar_Mobile;