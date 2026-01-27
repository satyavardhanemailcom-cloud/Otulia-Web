import React from 'react';

const BikeKeyFeatures = ({ item }) => {
  // Fallback data matching your screenshot
  const specs = {
    engine: item?.keySpecifications?.engineCapacity || "803 cc",
    mileage: item?.keySpecifications?.mileage || "18–20 km/l",
    fuel: item?.keySpecifications?.fuelTankCapacity || "13.5 liters"
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-6 bg-white">
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
        
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-black whitespace-nowrap min-w-fit playfair-display">
          Key Specifications :
        </h2>

        {/* Specifications Grid */}
        <div className="flex flex-wrap gap-4 w-full montserrat">
          
          {/* 1. ENGINE CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Motorcycle Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#006d77]">
               <path d="M16.5 6a3 3 0 11-6 0 3 3 0 016 0zM19 13v-2l-3-2-2 1-3-2H7l-3 5v2l2 1v6h2v-5l2-1v6h2v-6l4-2 3 2v-3l2-1zM5 13l2-3h3l2 3H5z" /> 
               {/* Using a generic bike shape path representation */}
               <path d="M4 14h2v4H4zM18 14h2v4h-2z" />
               <path fillRule="evenodd" d="M19.5 22a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-15 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
            </svg>
            <span className="text-lg md:text-xl font-bold font-serif text-black">
              {specs.engine}
            </span>
          </div>

          {/* 2. MILEAGE CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Speedometer Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#006d77" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg md:text-xl font-bold font-serif text-black">
              {specs.mileage}
            </span>
          </div>

          {/* 3. FUEL CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Fuel Pump Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-[#006d77]">
              <path d="M19.5 2h-15A2.5 2.5 0 002 4.5v15A2.5 2.5 0 004.5 22h15a2.5 2.5 0 002.5-2.5v-15A2.5 2.5 0 0019.5 2zm-5 17H6v-2h8.5v2zm0-4H6v-2h8.5v2zm0-4H6V9h8.5v2zm3.5 8h-2v-9h2v9z" />
               <path d="M16 6h1.5v7H16z" /> 
               {/* Simple representation of a fuel pump nozzle/hose */}
               <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" d="M18 10c1.5 0 3 1.5 3 4v3" />
            </svg>
            <span className="text-lg md:text-xl font-bold font-serif text-black">
              {specs.fuel}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BikeKeyFeatures;