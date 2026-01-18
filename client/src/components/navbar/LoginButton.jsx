import React from 'react'

const LoginButton = () => {
  return (
    <div>
       <button className="flex items-center cursor-pointer bg-black py-2 px-3 rounded-full gap-2 text-white font-normal hover:opacity-70 transition-opacity">
        {/* Solid User Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
        <span className="text-md">Log In</span>
        </button>
    </div>
  )
}

export default LoginButton
