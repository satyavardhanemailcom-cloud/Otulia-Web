import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";

const Category_Section = ({ type }) => {

  const [activeTab, setActiveTab] = useState('Buy');

  // Dynamic Content based on Category Type
  const content = {
    Estate: {
      title: "Extraordinary Properties. Exceptional Living",
      subtitle: "Homes, villas, and estates across the world.",
      bgImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
      searchPlaceholder: "Search By Location ( Country Or State )",
      tabs: ["Buy", "Rent"]
    },
    Yacht: {
      title: "Set Sail into Luxury",
      subtitle: "Discover the finest yachts for ocean adventures.",
      bgImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=2070",
      searchPlaceholder: "Search by Port or Region",
      tabs: ["Charter", "Buy"]
    },
    Bike: {
      title: "Ride the Extraordinary",
      subtitle: "Superbikes engineered for speed and style.",
      bgImage: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=2070",
      searchPlaceholder: "Search by Model or Brand",
      tabs: ["New", "Used"]
    },
    // Fallback or Generic
    Generic: {
      title: "Explore Luxury",
      subtitle: "Find what you are looking for.",
      bgImage: "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80&w=2070",
      searchPlaceholder: "Search...",
      tabs: ["Buy", "Rent"]
    }
  };

  const data = content[type] || content['Generic'];

  // Mock Data for Listings (Specific to styling request)
  const listingsData = {
    Estate: [
      {
        id: 1,
        title: "Castiglione della Pescaia",
        price: "$15,468,000",
        location: "Grosseto, 58043, Italy",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800",
        agent: { name: "Fernando Colleri", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        beds: 8, baths: 10, sqft: 12000
      },
      {
        id: 2,
        title: "Beverly Hills Mansion",
        price: "$25,000,000",
        location: "Beverly Hills, CA, USA",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        agent: { name: "Sarah Jenkins", image: "https://randomuser.me/api/portraits/women/44.jpg" },
        beds: 6, baths: 8, sqft: 9500
      },
      {
        id: 3,
        title: "Lake Como Villa",
        price: "$18,500,000",
        location: "Lombardy, Italy",
        image: "https://images.unsplash.com/photo-1600596542815-6ad4c1277855?auto=format&fit=crop&q=80&w=800",
        agent: { name: "Marco Rossi", image: "https://randomuser.me/api/portraits/men/85.jpg" },
        beds: 10, baths: 12, sqft: 15000
      },
      {
        id: 4,
        title: "French Riviera Estate",
        price: "$30,000,000",
        location: "Nice, France",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
        agent: { name: "Amelie Poulain", image: "https://randomuser.me/api/portraits/women/65.jpg" },
        beds: 12, baths: 14, sqft: 18000
      }
    ],
    Yacht: [
      // ... placeholders for Yacht if needed
    ],
    Bike: [],
    Generic: []
  };

  const currentListings = listingsData[type] || [];

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <div className="relative w-full h-[100vh]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={data.bgImage}
            alt={type}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-20">
          <h1 className="text-4xl md:text-6xl text-white font-normal playfair-display mb-6 drop-shadow-lg tracking-wide">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-serif mb-16 tracking-wider drop-shadow-md">
            {data.subtitle}
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-sm shadow-2xl flex flex-col md:flex-row items-center p-1 md:p-1 max-w-4xl w-full">
            <div className="flex-grow w-full md:w-auto px-4 py-3 md:py-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3">
                <IoSearch className="text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder={data.searchPlaceholder}
                  className="w-full text-gray-600 outline-none placeholder-gray-400 text-sm md:text-base bg-transparent font-medium"
                />
              </div>
            </div>
            {data.tabs && (
              <div className="flex w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-200">
                {data.tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 md:w-24 py-3 md:py-4 text-sm md:text-base font-semibold transition-colors duration-200
                                            ${activeTab === tab
                        ? 'bg-[#B08D55] text-white hover:bg-[#967745]'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
            <button className="w-full md:w-40 bg-[#967945] hover:bg-[#856a3b] text-white font-medium py-3 md:py-4 px-6 transition-colors duration-300 flex items-center justify-center gap-2 text-lg">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* LISTINGS SECTION */}
      {currentListings.length > 0 && (
        <section className="px-6 md:px-16 py-20 bg-gray-50">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl playfair-display text-black">Latest Listings</h2>
            <button className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#967945] hover:border-[#967945] transition-colors">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentListings.map(item => (
              <div key={item.id} className="bg-white group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                    For Sale
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-serif font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                  </div>
                  <p className="text-2xl font-bold text-[#967945]">{item.price}</p>

                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-2">
                    <span>📍</span>
                    <span>{item.location}</span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium py-3 border-t border-gray-100 mt-auto">
                    <span>{item.beds} BEDS</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span>{item.baths} BATHS</span>
                    <span className="w-px h-3 bg-gray-300"></span>
                    <span>{item.sqft.toLocaleString()} SQFT</span>
                  </div>

                  {/* Agent Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <img src={item.agent.image} alt={item.agent.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-tight">Agent</span>
                        <span className="text-xs font-bold text-gray-800">{item.agent.name}</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold uppercase text-[#967945] border border-[#967945] px-3 py-1.5 rounded-sm hover:bg-[#967945] hover:text-white transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Category_Section