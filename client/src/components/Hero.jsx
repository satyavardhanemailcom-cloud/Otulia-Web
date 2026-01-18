import React from 'react'
import heroUrl from '../assets/hero_banner.mp4'

const Hero = () => {
  return (
    <>
    <div className='flex flex-col hero-banner h-[calc(100vh-110px)] w-screen'>
        <video className='absolute top-0 -z-11 h-screen w-screen object-cover' src={heroUrl} muted autoPlay />
        <div className='absolute top-0 -z-10 h-screen w-screen bg-black opacity-40'></div>
        <div className="w-[96%] h-px bg-black border-0 self-center"></div>
        <ul className='flex gap-4 p-7 items-center justify-end montserrat text-white'>
          <li>Shop All</li>
          <li>Rent</li>
          <li>Community</li>
          <li>Sell With Us</li>
          <li>Plan & Price</li>
        </ul>
        <div className='absolute top-[70%] left-[5%]'>
        <h1 className='text-white text-5xl playfair-display'>Discovery Luxury at Otulia</h1>
        <p className='text-white montserrat'>Find Your Dream Car, Bike, Yacht, House and More.</p>
        </div>
    </div>
    </>
      
  )
}

export default Hero
