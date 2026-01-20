import React, { useRef } from 'react'
import AssetCard from '../AssetCard'

const MostPopularAssets = () => {
    // 1. Create a Ref to access the scrollable container
    const scrollRef = useRef(null);

    // 2. Scroll Handler Function
    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            // Scroll by 350px (approx one card width)
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const assets = [
        {
            id: 1,
            title: 'Palm Crest Villa',
            price: '₹ 18,750,000,000',
            location: 'Beverly Hills, Los Angeles, USA',
            details: '6 Beds | 8 Baths | 12,400 sqft',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 2,
            title: 'Azure Ridge Estate',
            price: '₹ 14,980,000,000',
            location: 'Bel Air, Los Angeles, USA',
            details: '10 Beds | 8 Baths | 10,100 sqft',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            title: 'Monte Verde Retreat',
            price: '₹ 9,450,000,000',
            location: 'Lake Como, Lombardy, Italy',
            details: '5 Beds | 8 Baths | 7,400 sqft',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 4,
            title: 'Timberlake Grand',
            price: '₹ 11,200,000,000',
            location: 'Aspen, Colorado, USA',
            details: '15 Beds | 8 Baths | 13,400 sqft',
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 5, // Added extra item to demonstrate scrolling
            title: 'The Sky Penthouse',
            price: '₹ 22,500,000,000',
            location: 'Manhattan, NY, USA',
            details: '4 Beds | 5 Baths | 6,500 sqft',
            image: 'https://images.unsplash.com/photo-1584957292742-10a90a507d91?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2t5JTIwcGVudGhvdXNlfGVufDB8fDB8fHww',
        }
    ]

    return (
        <section className="relative md:w-[95%] md:justify-self-center px-3 md:px-16 py-6 bg-white group">
            <h2 className="text-4xl playfair-display font-normal text-black mb-12">Most Popular Assets</h2>

            {/* Container for Buttons + List */}
            <div className="relative">

                {/* LEFT BUTTON */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute cursor-pointer -left-10 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* SCROLLABLE CONTAINER */}
                {/* flex + overflow-x-auto creates the slider */}
                {/* scrollbar-hide (requires plugin) or inline style helps aesthetics */}
                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto scroll-smooth pb-4 px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for Firefox/IE
                >
                    {/* Hide scrollbar for Chrome/Safari */}
                    <style>{`
                        .scroll-smooth::-webkit-scrollbar { display: none; }
                    `}</style>

                    {assets.map((item, idx) => (
                        // min-w ensures cards don't shrink. Adjust width as needed.
                        <div key={item.id} className="min-w-[300px] md:min-w-[350px]">
                            <AssetCard item={item} idx={idx}/>
                        </div>
                    ))}
                </div>

                {/* RIGHT BUTTON */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute cursor-pointer -right-10 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

            </div>
        </section>
    )
}

export default MostPopularAssets