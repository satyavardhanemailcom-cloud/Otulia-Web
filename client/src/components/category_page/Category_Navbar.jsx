import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Profile_dropdown from '../navbar/Profile_dropdown';
import Cart from '../navbar/Cart';
import LoginButton from '../navbar/LoginButton'; 
import ThemeToggle from '../navbar/ThemeToggle';
import Category_Navbar_Mobile from './Category_Navbar_Mobile';
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
// import { useAuth } from '../../contexts/AuthContext'; 
import { useAuth } from '../../contexts/AuthContext'; 
import { useSnackbar } from '../../contexts/SnackbarContext'; 

const Category_Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { isAuthenticated, loading } = useAuth(); 
    const { showSnackbar } = useSnackbar();
    
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
    
    const navClasses = `fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 flex items-center justify-between px-6 md:px-6 ${
        isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" 
            : "bg-transparent"
    }`;
    
    const textColor = isScrolled ? 'text-black' : 'text-white';
    
    return (
        <div>
            <nav className={navClasses}>
                {/* Left Section: Logo */}
                <div className="flex-1 flex items-center justify-start">
                    <NavLink to={'/'}>
                        <img
                            className="w-[100px] md:w-[120px] h-[40px] md:h-[50px] object-contain"
                            alt="Otulia"
                            src={isScrolled ? `/logos/logo_inverted.png` : `/logos/logo.png`}
                            title="Otulia"
                        />
                    </NavLink>
                </div>
                
                {/* Center Section: Navigation Links */}
                <div className='hidden lg:flex flex-[2] items-center justify-center gap-8 md:gap-14'>
                    {navLinks.map(link => (
                        /* <NavLink 
                            key={link.to}
                            to={link.to} 
                            className={({ isActive }) => `
                                relative py-2 text-[12px] font-medium tracking-[0.2em] uppercase montserrat transition-all duration-300
                                ${isActive ? (isScrolled ? 'text-black after:w-full' : 'text-white after:w-full') : (isScrolled ? 'text-gray-400 hover:text-black after:w-0' : 'text-white/60 hover:text-white after:w-0')}
                                after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-current after:transition-all after:duration-300
                            `}
                        >
                            {link.text}
                        </NavLink> */
                        <NavLink 
                            key={link.to}
                            to={link.to} 
                            onClick={(e) => {
                                if (link.to.includes('yachts') || link.to.includes('bikes')) {
                                    e.preventDefault();
                                    showSnackbar("COMING SOON");
                                }
                            }}
                            className={({ isActive }) => `
                                relative py-2 text-[12px] font-medium tracking-[0.2em] uppercase montserrat transition-all duration-300
                                ${isActive ? (isScrolled ? 'text-black after:w-full' : 'text-white after:w-full') : (isScrolled ? 'text-gray-400 hover:text-black after:w-0' : 'text-white/60 hover:text-white after:w-0')}
                                after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-current after:transition-all after:duration-300
                            `}
                        >
                            {link.text}
                        </NavLink>
                    ))}
                </div>

                {/* Right Section: Auth & Cart */}
                <div className='hidden lg:flex flex-1 items-center justify-end gap-6'>
                    {/* Logged-in users get the toggle inside the profile menu */}
                    {!loading && !isAuthenticated && <ThemeToggle isDark={isScrolled} />}
                    {loading ? (
                        <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                    ) : (
                        <>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <Profile_dropdown isDark={isScrolled} />
                                    <Cart isDark={isScrolled} />
                                </div>
                            ) : (
                                <LoginButton isDark={isScrolled} />
                            )}
                        </>
                    )}
                </div>

                <div className='lg:hidden flex items-center gap-4'>
                    {!loading && !isAuthenticated && <ThemeToggle isDark={isScrolled} />}
                    <button onClick={toggleMenu} className={`text-2xl ${textColor}`}>
                        <IoMdMenu />
                    </button>
                </div>
            </nav>

            {/* Mobile menu logic remains same */}
            <div
                className={`fixed top-0 right-0 h-screen w-[85vw] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <button
                    onClick={toggleMenu}
                    className="absolute top-6 right-6 text-black focus:outline-none"
                >
                    <IoClose className="w-8 h-8" />
                </button>
                <div className="pt-24 px-8">
                    <Category_Navbar_Mobile navLinks={navLinks} />
                </div>
            </div>
        </div>
    );
};

export default Category_Navbar;