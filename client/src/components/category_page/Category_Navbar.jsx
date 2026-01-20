
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

  const navClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center justify-between px-8 py-6 ${isScrolled ? "bg-[#2C2C2C]/90 backdrop-blur-md shadow-md" : "bg-transparent"
    }`;
  return (
    <div>
      <nav className={navClasses}>
        <NavLink to={'/'}>
          <img
            className="w-[120px] md:w-[140px] object-contain"
            alt="logo"
            src="/logos/logo.png"
            title="Otulia"
          />
        </NavLink>

        <div className='hidden lg:flex items-center justify-center gap-10'>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `text-lg font-medium tracking-wide transition-all duration-300 ${isActive ? 'text-white border-b-2 border-[#E3C16F] pb-1' : 'text-white/90 hover:text-white'}`}
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
        className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-51 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
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
