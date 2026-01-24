import React from 'react'
import heroUrl from '../../../../assets/hero_banners/hero_cars.jpg'
import Cars_Search from './Cars_Search'

const Cars_Hero = () => {
  return (
    <div>
      <div className='relative flex flex-col hero-banner h-[500px] md:h-[700px] w-full pt-24'>
        <img className='absolute top-0 left-0 -z-10 h-full w-full object-cover' src={heroUrl} alt='hero_car' />
        <div className='relative flex flex-col items-center justify-center h-full p-3 gap-3 z-10'>
          <h1 className='text-white playfair-display text-3xl md:text-5xl text-center drop-shadow-lg'>Discover Your Dream Cars With Us</h1>
          <p className='text-white/90 montserrat italic text-md md:text-2xl text-center drop-shadow-md'>The world’s finest cars, yachts & estates—curated.</p>
          <div className='md:mt-12 w-full flex flex-col items-center'>
            <Cars_Search />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cars_Hero