import React, { useRef } from 'react'
import AssetCard from '../AssetCard'
import { useNavigate } from 'react-router-dom';

const TrendingListings = () => {
    const navigate = useNavigate();
    
    // 1. Create Ref for the scroll container
    const scrollRef = useRef(null);

    // 2. Scroll Handler
    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            // Scroll by approx one card width
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const listings = [
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
        // Optional: Add a 5th item to test scrolling functionality
        {
            id: 5,
            title: 'The Royal Penthouse',
            price: '₹ 25,000,000,000',
            location: 'Dubai Marina, UAE',
            details: '4 Beds | 6 Baths | 8,200 sqft',
            image: 'https://plus.unsplash.com/premium_photo-1694475027390-8fd837fb67e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm95YWwlMjBwZW50aG91c2V8ZW58MHx8MHx8fDA%3D',
        }
    ]

    return (
        <section className="relative w-full px-3 md:px-16 py-6 bg-white group">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl md:text-4xl playfair-display text-black">Trending Listings</h2>
                <button 
                    onClick={()=>{navigate('/trending')}} 
                    className="px-3 md:px-10 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                    See More
                </button>
            </div>

            {/* Slider Container */}
            <div className="relative">

                {/* LEFT ARROW */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* SCROLLABLE LIST */}
                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto scroll-smooth pb-4 px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style>{`
                        .scroll-smooth::-webkit-scrollbar { display: none; }
                    `}</style>

                    {listings.map((item, idx) => (
                        <div key={item.id} className="min-w-[300px] md:min-w-[350px]">
                            <AssetCard item={item} idx={idx}/>
                        </div>
                    ))}
                </div>

                {/* RIGHT ARROW */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

            </div>
        </section>
    )
}

export default TrendingListings