import React from 'react'

const CategorySection = () => {
    const categories = [
        {
            id: 1,
            image: '/images/category_car.jpg',
            alt: 'Luxury Car',
        },
        {
            id: 2,
            image: '/images/category_house.jpg',
            alt: 'Luxury House',
        },
        {
            id: 3,
            image: '/images/category_yacht.jpg',
            alt: 'Luxury Yacht',
        },
        {
            id: 4,
            image: '/images/category_bike.jpg',
            alt: 'Superbike',
        },
    ]

    return (
        <section className='w-full px-16 py-16 bg-white'>
            {/* Header */}
            <div className='flex items-center justify-between mb-12'>
                <h2 className='text-5xl font-bodoni font-normal text-black'>
                    Browse by Category
                </h2>
                <button className='px-8 py-2.5 border border-black rounded-full text-black hover:bg-black hover:text-white transition-colors duration-300 font-sans text-lg'>
                    Discover
                </button>
            </div>

            {/* Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {categories.map((cat) => (
                    <div key={cat.id} className='relative group overflow-hidden aspect-[3/4] cursor-pointer'>
                        <img
                            src={cat.image}
                            alt={cat.alt}
                            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CategorySection
