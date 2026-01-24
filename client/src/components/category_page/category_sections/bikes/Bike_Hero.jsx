import React from 'react'
import Bike_Search from './Bike_Search'

const Bike_Hero = () => {
    const heroUrl = 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=2070'

    return (
        <div>
            <div className='relative flex flex-col hero-banner h-[500px] md:h-[700px] w-full pt-24'>
                <img className='absolute top-0 left-0 -z-10 h-full w-full object-cover' src={heroUrl} alt='hero_bike' />
                <div className='relative flex flex-col items-center justify-center h-full p-3 gap-3 z-10'>
                    <h1 className='text-white playfair-display text-3xl md:text-5xl text-center drop-shadow-lg'>Discover Your Dream Bike With Us</h1>
                    <p className='text-white/90 montserrat italic text-md md:text-2xl text-center drop-shadow-md'>The world’s fastest and finest bikes—expertly curated.</p>
                    <div className='md:mt-12 w-full flex flex-col items-center'>
                        <Bike_Search />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bike_Hero
