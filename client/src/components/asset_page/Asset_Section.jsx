import React from 'react'
import CarGallery from './car/CarGallery'
import CarDetails from './car/CarDetails'

const Asset_Section = () => {
  return (
    <div className='flex flex-col'>
        <div className="w-[92%] md:w-[96%] h-px bg-black border-0 self-center my-10"></div>
        <CarGallery />
        <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
        <CarDetails />
        <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
    </div>
  )
}

export default Asset_Section