import React from 'react'
import numberWithCommas from '../../modules/numberwithcomma'
import { Navigate, useNavigate } from 'react-router-dom'

const CategorySection = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 1,
            image: '/images/category_car.jpg',
            alt: 'Luxury Car',
            name: 'Cars',
            navigate: 'cars',
            listing: numberWithCommas(70000)
        },
        {
            id: 2,
            image: '/images/category_house.jpg',
            alt: 'Luxury House',
            name: 'Real Estate',
            navigate: 'estates',
            listing: numberWithCommas(33)
        },
        {
            id: 3,
            image: '/images/category_yacht.jpg',
            alt: 'Luxury Yacht',
            name: 'Yachts',
            navigate: 'yachts',
            listing: numberWithCommas(1000)
        },
        {
            id: 4,
            image: '/images/category_bike.jpg',
            alt: 'Superbike',
            name: 'Bikes',
            navigate: 'bikes',
            listing: numberWithCommas(300000)
        },
    ]

    return (
        <section className='w-full px-3 md:px-16 md:pt-16 pb-6 bg-white'>
            {/* Header */}
            <div className='flex flex-col md:flex-row items-center gap-4 md:justify-between mb-12'>
                <h2 className='text-4xl md:text-5xl playfair-display font-normal text-black'>
                    Browse by Category
                </h2>
                <button onClick={() => { navigate('/category/cars') }} className='px-4 md:px-8 py-2.5 border montserrat border-black rounded-full text-black hover:bg-black hover:text-white transition-colors duration-300 md:text-lg cursor-pointer'>
                    Discover
                </button>
            </div>

            {/* Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {categories.map((cat) => (
                    <div onClick={() => { navigate(`/category/${cat.navigate}`) }} key={cat.id} className='relative group overflow-hidden aspect-[3/4] cursor-pointer'>
                        <img
                            src={cat.image}
                            alt={cat.alt}
                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                        <div className='absolute bottom-[10%] left-[7%] '>
                            <h1 className='text-white playfair-display text-2xl md:text-3xl font-medium'>{cat.name}</h1>
                            <p className='text-gray-200 text-[9px] md:text-[11px] font-medium tracking-widest'>{cat.listing} LISTINGS </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CategorySection
