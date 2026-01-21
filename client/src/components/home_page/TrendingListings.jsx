import React, { useRef, useEffect, useState } from "react";
import AssetCard from "../AssetCard";
import { useNavigate } from "react-router-dom";
import randomShuffle from "../../modules/randomShuffle";

const TrendingListings = () => {
  const navigate = useNavigate();

  const [list, setlist] = useState([]);

  // 1. Create Ref for the scroll container
  const scrollRef = useRef(null);

  // 2. Scroll Handler
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      // Scroll by approx one card width
      const scrollAmount = direction === "left" ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Fetch data
  const datafetch = async ()=> {
    const url = "http://localhost:8000/api/home/trending";
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
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-4xl playfair-display text-black">
          Trending Listings
        </h2>
        <button
          onClick={() => {
            navigate("/trending");
          }}
          className="px-3 md:px-10 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          See More
        </button>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute cursor-pointer -left-10 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* SCROLLABLE LIST */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth pb-4 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
                        .scroll-smooth::-webkit-scrollbar { display: none; }
                    `}</style>

          {list.map((item, idx) => (
            <div key={item.id} className="min-w-[300px] md:min-w-[350px]">
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute cursor-pointer -right-10 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none hidden md:block border border-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default TrendingListings;
