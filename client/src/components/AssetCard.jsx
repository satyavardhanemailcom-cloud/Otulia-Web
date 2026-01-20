import React from 'react'
import { useNavigate } from 'react-router-dom'

const AssetCard = ({item, idx}) => {
  const navigate = useNavigate()
  return (
    <>
      <div
        key={item.id}
        onClick={()=>{navigate(`/asset/${item.id}`)}}
        className="group border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Pagination Dots Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`w-1.5 h-1.5 rounded-full ${dot === 1 ? "bg-white" : "bg-white/50"}`}
              ></div>
            ))}
          </div>

          {/* Heart Button with specific colors */}
          <button className="absolute top-2 right-3 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={
                idx === 0 || idx === 2
                  ? "#ef4444"
                  : idx === 1
                    ? "#3b82f6"
                    : "rgba(255,255,255,0.5)"
              }
              stroke={idx === 3 ? "white" : "none"}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <h3 className="text-xl playfair-display text-black mb-1 font-sans truncate">
            {item.title}
          </h3>
          <p className="text-md font-bold text-black mb-1 font-sans">
            {item.price}
          </p>
          <p className="text-[10px] text-gray-400 mb-2 font-normal uppercase tracking-widest">
            {item.location}
          </p>

          <div className="w-full h-px bg-gray-100 mb-2"></div>

          {/* Footer details */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {item.details}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AssetCard
