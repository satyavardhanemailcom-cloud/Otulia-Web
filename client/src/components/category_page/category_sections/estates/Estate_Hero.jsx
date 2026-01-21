import React from 'react'
import heroUrl from '../../../../assets/hero_banners/hero_estate.jpg'
import Estate_Search from './Estate_Search'

const Estate_Hero = () => {
  return (
    <div>
        <div className='flex flex-col hero-banner h-140 md:h-180 w-full pt-24'>
                <img className='absolute top-0 -z-11 h-[83vh] md:h-screen w-screen object-cover' src={heroUrl} alt='hero_car' />
                <div className='flex flex-col items-center justify-center h-[90%] p-3 gap-3'>
                  <h1 className='text-white playfair-display text-3xl md:text-5xl text-center'>Extraordinary Properties. Exceptional Living</h1>
                  <p className='text-amber-900 playfair-display text-md md:text-2xl text-center'>Homes, villas, and estates across the world.</p>
                  <div className='md:mt-20 w-full flex flex-col items-center'>
                  <Estate_Search />
                  </div>
                </div>
            </div>
    </div>
  )
}

export default Estate_Hero