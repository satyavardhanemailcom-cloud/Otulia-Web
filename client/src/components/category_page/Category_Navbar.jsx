import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Profile_dropdown from '../navbar/Profile_dropdown';
import Cart from '../navbar/Cart';
import LoginButton from '../navbar/LoginButton'; 
import Category_Navbar_Mobile from './Category_Navbar_Mobile';
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useAuth } from '../../contexts/AuthContext'; 

const Category_Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // 1. Get Loading State
    const { isAuthenticated, loading } = useAuth(); 
    
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
        isScrolled 
            ? "bg-[#2C2C2C] text-white w-screen" // NOTE: I changed text-black to text-white for visibility on dark bg
            : "bg-white/40 m-6 text-white w-[calc(100vw-48px)] rounded-full"
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

                {/* 2. AUTH SECTION WITH LOADING STATE */}
                {/* Removed 'text-white' class here so it inherits from navClasses */}
                <div className='hidden lg:flex items-center justify-center gap-3 mr-3'>
                    {loading ? (
                        // Placeholder skeleton while loading
                        <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                    ) : (
                        <>
                            {isAuthenticated ? (
                                <>
                                    <Profile_dropdown text={'text-white'} />
                                    {/* Removed 'text-white' wrapper so Cart takes nav color */}
                                    <div className='text-inherit'> 
                                        <Cart text={'text-white'}/>
                                    </div>
                                </>
                            ) : (
                                <LoginButton />
                            )}
                        </>
                    )}
                </div>

                <div className='lg:hidden flex items-center'>
                    <button onClick={toggleMenu} className='text-2xl text-inherit'>
                        <IoMdMenu />
                    </button>
                </div>
            </nav>

            <div
                className={`fixed top-0 right-0 h-screen w-[80vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${
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
    );
};

export default Category_Navbar;