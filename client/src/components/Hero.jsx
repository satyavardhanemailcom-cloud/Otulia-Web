import React from 'react'
import heroUrl from '../assets/hero_banner.mp4'

const Hero = () => {
  return (
    <>
    <div className='flex flex-col hero-banner h-screen w-screen'>
        <video className='absolute top-0 -z-11 h-screen w-screen object-cover' src={heroUrl} muted autoPlay />
        <div className="w-[90%] h-px bg-black border-0 self-center"></div>
    </div>
    </>
      
  )
}

export default Hero
