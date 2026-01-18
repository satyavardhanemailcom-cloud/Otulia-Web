import React from 'react'
import heroUrl from '../../assets/hero_banner.mp4'

const Hero = () => {
  return (
    <>
    <div className='flex flex-col hero-banner h-[calc(100vh-110px)] w-screen'>
        <video className='absolute top-0 -z-11 h-[83vh] md:h-screen w-screen object-cover' src={heroUrl} muted autoPlay />
        <div className='absolute top-0 -z-10 h-[83vh] md:h-screen w-screen bg-black opacity-60'></div>
        <div className="w-[92%] md:w-[96%] h-px bg-white border-0 self-center"></div>
        <div className='absolute top-[4%] md:top-[8%] left-[3%] md:left-[5%] flex flex-col gap-4'>
          <h1 className='text-white text-3xl md:text-6xl playfair-display'>Discovery Luxury at Otulia</h1>
          <p className='text-white montserrat text-lg'>Find Your Dream Car, Bike, Yacht, House and More.</p>
        </div>
        <ul className='flex flex-wrap gap-6 md:gap-7 px-3 py-7 md:p-7 items-center justify-center md:justify-end montserrat text-white text-[14px] md:text-lg'>
          <li className='cursor-pointer'>Shop All</li>
          <li className='cursor-pointer'>Rent</li>
          <li className='cursor-pointer'>Community</li>
          <li className='cursor-pointer'>Sell With Us</li>
          <li className='cursor-pointer'>Plan & Price</li>
        </ul>
        
    </div>
</>
  )
}

export default Hero
