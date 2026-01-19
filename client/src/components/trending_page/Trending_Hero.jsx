import React from 'react'
import heroUrl from '../../assets/hero_trending.jpg'

const Trending_Hero = () => {
  return (
    <div>
        <div className='flex flex-col hero-banner h-[calc(100vh-110px)] w-full'>
                <img className='absolute top-0 -z-11 h-[83vh] md:h-screen w-screen object-cover' src={heroUrl} alt='hero_trending' />
                
            </div>
    </div>
  )
}

export default Trending_Hero