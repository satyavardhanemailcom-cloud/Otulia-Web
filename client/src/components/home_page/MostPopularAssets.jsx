import React, { useRef, useState, useEffect } from 'react'
import AssetCard from '../AssetCard'
import randomShuffle from "../../modules/randomShuffle";

const MostPopularAssets = () => {

    const [list, setlist] = useState([]);

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

    const datafetch = async () => {
        const url = "/api/home/popularity";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            const n = Math.floor(result.length / 2);
            setlist(randomShuffle(result))
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(() => {
        datafetch()
    }, []);

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

                    {list.map((item, idx) => (
                        // min-w ensures cards don't shrink. Adjust width as needed.
                        <div key={item._id} className="min-w-[300px] md:min-w-[350px]">
                            <AssetCard item={item} idx={idx} />
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