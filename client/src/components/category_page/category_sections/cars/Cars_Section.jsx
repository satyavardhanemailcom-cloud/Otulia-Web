import React from 'react'
import Cars_Hero from './cars_hero'
import FilterBar from './FilterBar'

const Cars_Section = () => {

    const brands = [
        {
            id: 1,
            name: 'Bugatti',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Bugatti_logo.svg'
        },
        {
            id: 2,
            name: 'Mercedes-Benz',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mercedes-Benz_Logo_2010.svg'
        },
        {
            id: 3,
            name: 'BMW',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg'
        },
        {
            id: 4,
            name: 'Aston Martin Wings',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Aston_Martin_wordmark.svg'
        },
        {
            id: 5,
            name: 'Audi',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg'
        },
    ]

  return (
    <div className=''>
        <Cars_Hero />

        <div className='bg-white'>
            <section className="w-full px-3 md:px-16 py-12 bg-white">
            <div className="flex flex-col items-center justify-center mb-10">
                <h2 className="text-3xl md:text-4xl playfair-display text-black mb-12 text-center">
                    Popular Brands
                </h2>
                
                <div className='grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 w-full items-center justify-center'>
                    {brands.map((item) => (
                        <div key={item.id} className="w-full flex justify-center group">
                            <img 
                                src={item.logo} 
                                alt={item.name} 
                                
                                className='h-16 md:h-20 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer mix-blend-multiply' 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 justify-self-center"></div>
        
         <section className="w-full px-3 md:px-16 py-12 bg-white">
         <FilterBar />
         </section>
        </div>
        

    </div>
  )
}

export default Cars_Section