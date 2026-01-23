import React from 'react'
import CarGallery from './car/CarGallery'

const Asset_Section = () => {
  return (
    <div className='flex flex-col'>
        <div className="w-[92%] md:w-[96%] h-px bg-black border-0 self-center my-10"></div>
        <CarGallery />
    </div>
  )
}

export default Asset_Section