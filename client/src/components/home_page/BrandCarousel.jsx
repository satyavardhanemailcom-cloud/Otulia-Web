import React from 'react'
import astonMartin from '../../assets/car_brands/Aston_Martin_Wings.webp'
import audi from '../../assets/car_brands/Audi.webp'
import bmw from '../../assets/car_brands/BMW.webp'
import bugatti from '../../assets/car_brands/Bugatti.webp'
import ferrari from '../../assets/car_brands/Ferrari.webp'
import koenigsegg from '../../assets/car_brands/Koenigsegg_Automotive_AB.webp'
import lexus from '../../assets/car_brands/Lexus.webp'
import mercedes from '../../assets/car_brands/Mercedes-Benz.webp'
import porsche from '../../assets/car_brands/Porsche.webp'
import shelby from '../../assets/car_brands/Shelby_American.webp'

const BrandCarousel = () => {
    const brands = [
        { name: 'Aston Martin', logo: astonMartin },
        { name: 'Audi', logo: audi },
        { name: 'BMW', logo: bmw },
        { name: 'Bugatti', logo: bugatti },
        { name: 'Ferrari', logo: ferrari }
    ]

    return (
        <section className="w-full px-3 md:px-6 py-10 md:py-12 bg-white">
            <h2 className="text-3xl canela text-black mb-8 md:mb-12">Trusted Brands We Carry</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 border border-gray-100">
                {brands.map((brand, idx) => (
                    <div 
                        key={idx} 
                        className={`h-28 md:h-40 flex items-center justify-center p-6 md:p-8 grayscale opacity-40 hover:grayscale-0 dark:hover:grayscale hover:opacity-100 transition-all duration-500 cursor-pointer bg-white
                            border-gray-100
                            ${(idx + 1) % 2 !== 0 ? 'border-r' : ''} 
                            ${idx < 4 ? 'border-b md:border-b-0' : ''}
                            ${(idx + 1) % 5 !== 0 ? 'md:border-r' : ''}
                        `}
                    >
                        <img 
                            src={brand.logo} 
                            alt={brand.name} 
                            loading="lazy"
                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default BrandCarousel
