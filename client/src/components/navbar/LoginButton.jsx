import React from 'react';
import { Link } from 'react-router-dom';


const LoginButton = ({ isDark }) => {
    return (
        <Link to="/login">
            <button className={`
                flex items-center cursor-pointer py-2 px-6 rounded-full gap-2 font-bold transition-all duration-300 active:scale-95
                ${isDark ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-100'}
            `}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                <span className="text-[13px] uppercase tracking-widest montserrat whitespace-nowrap">Log In</span>
            </button>
        </Link>
    );
};

export default LoginButton;
