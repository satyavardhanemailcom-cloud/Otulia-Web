import React from 'react'
import heroUrl from '../../../../assets/hero_banners/hero_cars.jpg'
import Cars_Search from './Cars_Search'

const Cars_Hero = () => {
  return (
    <div>
        <div className='flex flex-col hero-banner h-120 md:h-160 w-full pt-24'>
                <img className='absolute top-0 -z-11 h-[83vh] md:h-screen w-screen object-cover' src={heroUrl} alt='hero_car' />
                <div className='flex flex-col items-center justify-center h-[90%] p-3 gap-3'>
                  <h1 className='text-white playfair-display text-3xl md:text-5xl text-center'>Discover Your Dream Cars With Us</h1>
                  <p className='text-white montserrat italic text-md md:text-2xl text-center'>The world’s finest cars, yachts & estates—curated.</p>
                  <Cars_Search />
                </div>
            </div>
    </div>
  )
}

export default Cars_Hero