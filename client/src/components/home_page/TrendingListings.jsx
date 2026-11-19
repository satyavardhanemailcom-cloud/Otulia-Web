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
  const datafetch = async () => {
    const url = "/api/home/trending";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setlist(randomShuffle(result));
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    datafetch();
  }, []);

  return (
    <section className="relative px-4 md:px-6 pt-12 md:pt-16 pb-2 bg-[#f9f9f9] group w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-normal canela text-black mb-2">
            Trending Cars
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-sans">
            Discover cars that are trending this week.
          </p>
        </div>

        {/* Top Right Arrows */}
        <div className="flex items-center gap-3 hidden md:flex">
          <button
            onClick={() => scroll("left")}
            className="bg-white text-black p-3.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer border border-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-white text-black p-3.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer border border-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* SCROLLABLE LIST */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory md:snap-none pb-8 pt-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.scroll-smooth::-webkit-scrollbar { display: none; }`}</style>

          {list.map((item, idx) => (
            <div
              key={item._id}
              className="w-[85vw] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.66px)] shrink-0 snap-start group-hover:opacity-100"
            >
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingListings;
