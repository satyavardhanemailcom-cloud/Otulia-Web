
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Profile_dropdown from '../navbar/Profile_dropdown';
import Cart from '../navbar/Cart';
import Category_Navbar_Mobile from './Category_Navbar_Mobile';
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const Category_Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [isScrolled, setIsScrolled] = useState(false);
    
      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };
    
      useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    
      const navLinks = [
        { to: "/category/cars", text: "Cars" },
        { to: "/category/estates", text: "Estates" },
        { to: "/category/yachts", text: "Yachts" },
        { to: "/category/bikes", text: "Bikes" }
      ];
    
      const navClasses = `fixed left-0 z-50 h-15 transition-all duration-200 flex items-center justify-between p-4 ${
        isScrolled ? "bg-[#2C2C2C] shadow-md text-black w-screen" : "bg-white/40 m-6 text-white w-[calc(100vw-48px)] rounded-full"
      }`;
  return (
    <div>
      <nav className={navClasses}>
        <NavLink to={'/'}>
          <img
          className="w-[135px] md:w-[180px] h-[35px] md:h-[45px] object-contain"
          alt="logo"
          src="/logos/logo.png"
          title="Otulia"
        />
        </NavLink>
        
        <div className='hidden lg:flex items-center justify-center gap-5 md:gap-17'>
          {navLinks.map(link => (
            <NavLink 
              key={link.to}
              to={link.to} 
              className={({ isActive }) => isActive ? 'bg-[#B8860B] text-white rounded-2xl py-2 px-3 montserrat' : 'py-2 px-3 montserrat text-white'}
            >
              {link.text}
            </NavLink>
          ))}
        </div>

        <div className='hidden lg:flex items-center justify-center gap-3 mr-3'>
          <Profile_dropdown />
          <div className='text-white'>
          <Cart />
          </div>
        </div>

        <div className='lg:hidden flex items-center'>
          <button onClick={toggleMenu} className='text-2xl text-white'>
            <IoMdMenu />
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-51 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-6 right-6 text-[#2C2C2C] focus:outline-none"
        >
          <IoClose className="w-8 h-8" />
        </button>
        <div className="pt-20">
          <Category_Navbar_Mobile navLinks={navLinks} />
        </div>
      </div>
    </div>
  )
}

export default Category_Navbar
