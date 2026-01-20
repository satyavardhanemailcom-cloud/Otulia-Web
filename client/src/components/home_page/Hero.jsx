import React from 'react'
import heroUrl from '../../assets/hero_banners/hero_banner.mp4'
import { NavLink } from 'react-router-dom'
const Hero = () => {
  return (
    <>
    <div className='flex flex-col hero-banner h-[calc(100vh-110px)] w-full'>
        <video className='absolute top-0 -z-11 h-[83vh] md:h-screen w-screen object-cover' src={heroUrl} muted autoPlay />
        
        <div className="w-[92%] md:w-[96%] h-px bg-black border-0 self-center"></div>
        <div className='absolute top-[5%] md:top-[9%] left-[3%] md:left-[5%] flex flex-col gap-4'>
          <h1 className='text-white text-3xl md:text-6xl playfair-display'>Discovery Luxury at Otulia</h1>
          <p className='text-white montserrat text-lg'>Find Your Dream Car, Bike, Yacht, House and More.</p>
        </div>
        <ul className='flex flex-wrap gap-6 md:gap-7 px-3 py-7 md:p-7 items-center justify-center md:justify-end montserrat text-black text-[14px] md:text-lg'>
          <li className='cursor-pointer'>
            <NavLink to={'/shop'}>
            Shop All
            </NavLink>
            </li>
          <li className='cursor-pointer'>
            <NavLink to={'/rent'}>
            Rent
            </NavLink>
            </li>
          <li className='cursor-pointer'>
            <NavLink to={'/community'}>
            Community
            </NavLink>
            </li>
          <li className='cursor-pointer'>
            <NavLink to={'/seller'}>
            Sell With Us
            </NavLink>
            </li>
          <li className='cursor-pointer'>
            <NavLink to={'/pricing'}>
            Plan & Price
            </NavLink>
            </li>
        </ul>
        
    </div>
</>
  )
}

export default Hero
