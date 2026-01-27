import React from 'react';

const CarKeyFeatures = ({ item }) => {
  // Fallback data matching your screenshot
  const specs = {
    power: item?.keySpecifications?.power || "518 HP",
    speed: item?.keySpecifications?.mileage || "300 km/h", // Mapping mileage/speed based on your schema
    engine: item?.keySpecifications?.cylinderCapacity || "Inline V6"
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-6 bg-white">
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
        
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold playfair-display text-black whitespace-nowrap min-w-fit">
          Key Specifications :
        </h2>

        {/* Specifications Grid */}
        <div className="flex flex-wrap gap-4 w-full montserrat">
          
          {/* 1. POWER CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Engine Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#006d77" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span className="text-lg md:text-xl font-bold text-black">
              {specs.power}
            </span>
          </div>

          {/* 2. SPEED CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Speedometer Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#006d77" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg md:text-xl font-bold text-black">
              {specs.speed}
            </span>
          </div>

          {/* 3. ENGINE TYPE CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Piston/Engine Block Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#006d77" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            <span className="text-lg md:text-xl font-bold text-black">
              {specs.engine}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CarKeyFeatures;