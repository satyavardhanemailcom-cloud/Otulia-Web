import React, { useState } from 'react'

const FeaturedProducts = () => {
    const products = [
        {
            id: 1,
            image: '/images/rolex_watch.jpg',
            title: 'Rolex Diamond',
            price: '£125,000.00',
            sale: false,
            bestSeller: false,
        },
        {
            id: 2,
            image: '/images/category_yacht.jpg',
            title: '2022 Yamaha WaveRunner',
            price: '£13,680.00',
            oldPrice: '£15,200.00',
            sale: true,
            bestSeller: false,
        },
        {
            id: 3,
            image: '/images/ducati_panigale.jpg',
            title: 'Ducati Panigale V4 R',
            price: '£42,300.00',
            oldPrice: '£47,000.00',
            sale: true,
            bestSeller: false,
        },
        {
            id: 4,
            image: '/images/category_bike.jpg',
            title: 'Kawasaki 2023 Ultra 310LX',
            price: '£19,800.00',
            sale: false,
            bestSeller: false,
        },
        {
            id: 5,
            image: '/images/category_car.jpg', // Using car as helicopter stand-in or just a luxury car
            title: 'Bell LongRanger 206',
            price: '£840,000.00',
            sale: false,
            bestSeller: true,
        },
        {
            id: 6,
            image: '/images/rolex_watch.jpg',
            title: 'Rolex Submariner',
            price: '£35,000.00',
            sale: false,
            bestSeller: true,
        },
        // Duplicates
        {
            id: 7,
            image: '/images/category_yacht.jpg',
            title: 'Superyacht Charter',
            price: '£150,000.00 / week',
            sale: false,
            bestSeller: false,
        },
        {
            id: 8,
            image: '/images/ducati_panigale.jpg',
            title: 'Ducati Superleggera V4',
            price: '£85,000.00',
            sale: false,
            bestSeller: true,
        },
        {
            id: 9,
            image: '/images/category_bike.jpg',
            title: 'Jet Ski Performance',
            price: '£22,000.00',
            sale: true,
            bestSeller: false,
            oldPrice: '£25,000.00'
        },
        {
            id: 10,
            image: '/images/category_car.jpg',
            title: 'Bugatti Chiron',
            price: '£2,500,000.00',
            sale: false,
            bestSeller: true,
        },
        {
            id: 11,
            image: '/images/rolex_watch.jpg',
            title: 'Patek Philippe Nautilus',
            price: '£110,000.00',
            sale: false,
            bestSeller: true,
        },
        {
            id: 12,
            image: '/images/category_house.jpg',
            title: 'Miami Waterfront Mansion',
            price: '£12,500,000.00',
            sale: false,
            bestSeller: true,
        }
    ]

    const [currentIndex, setCurrentIndex] = useState(0)
    const itemsPerPage = 4

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 >= products.length - itemsPerPage + 1 ? 0 : prevIndex + 1
        )
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - itemsPerPage : prevIndex - 1
        )
    }

    return (
        <section className='w-full px-16 py-20 bg-white overflow-hidden'>
            {/* Headlines */}
            <h2 className='text-5xl font-sans font-bold text-black mb-10'>
                Featured Products
            </h2>
            <h3 className='text-2xl font-serif font-bold text-black mb-8'>
                Best sellers
            </h3>

            {/* Carousel Container */}
            <div className='relative w-full'>
                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className='absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 text-black/50 hover:text-black transition-colors'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Slides Track */}
                <div className='overflow-hidden'>
                    <div
                        className='flex gap-6 transition-transform duration-500 ease-out'
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                    >
                        {products.map((product) => (
                            <div key={product.id} className='min-w-[calc(25%-18px)] flex-shrink-0 flex flex-col'>
                                {/* Image Card */}
                                <div className='relative aspect-square mb-4 bg-gray-50 overflow-hidden group'>
                                    {/* Badges */}
                                    <div className='absolute top-2 left-2 z-10 flex flex-col gap-2'>
                                        {product.sale && (
                                            <span className='bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase'>Sale</span>
                                        )}
                                        {product.bestSeller && (
                                            <span className='bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase'>Best Seller</span>
                                        )}
                                    </div>

                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                    />
                                </div>

                                {/* Details */}
                                <div className='flex flex-col flex-grow'>
                                    <h4 className='text-lg font-medium text-black mb-1'>{product.title}</h4>
                                    <div className='flex items-center gap-2 mb-4'>
                                        {product.oldPrice && (
                                            <span className='text-gray-500 line-through text-sm'>{product.oldPrice}</span>
                                        )}
                                        <span className='text-gray-900 font-normal'>{product.price}</span>
                                    </div>

                                    <button className='w-full mt-auto py-2.5 border border-black rounded-full font-sans text-sm font-medium hover:bg-black hover:text-white transition-all duration-300'>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className='absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2 text-black/50 hover:text-black transition-colors'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

        </section>
    )
}

export default FeaturedProducts
