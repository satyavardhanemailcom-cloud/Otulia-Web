import React from 'react';
import fuelCapacity from '../../../assets/productpage/fuelcapacity.png'
import speed from '../../../assets/productpage/speed.png'
import bikecc from '../../../assets/productpage/bikecc.png'

const BikeKeyFeatures = ({ item }) => {
  // Fallback data matching your screenshot
  const specs = {
    engine: item?.keySpecifications?.engineCapacity || "803 cc",
    mileage: item?.keySpecifications?.mileage || "18–20 km/l",
    fuel: item?.keySpecifications?.fuelTankCapacity || "13.5 liters"
  };

  return (
    <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-6 bg-white">
      
      {/* Changed layout to flex-col and items-center to stack and center */}
      <div className="flex flex-col items-center gap-8 montserrat">
        
        {/* Heading - Centered and Full Width */}
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-black text-center w-full playfair-display">
          Key Specifications
        </h2>

        {/* Specifications Grid - Justified Center */}
        <div className="flex flex-wrap justify-center gap-6 w-full montserrat">
          
          {/* 1. ENGINE CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm min-w-[200px] hover:border-teal-600 transition-colors cursor-default">
            {/* Motorcycle Icon */}
             <img className='w-16 h-auto object-contain' src={bikecc} alt='' />
            <span className="text-lg md:text-xl font-bold text-black">
              {specs.engine}
            </span>
          </div>

          {/* 2. MILEAGE CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm min-w-[200px] hover:border-teal-600 transition-colors cursor-default">
            {/* Speedometer Icon */}
            <img className='w-16 h-auto object-contain' src={speed} alt='' />
            <span className="text-lg md:text-xl font-bold text-black">
              {specs.mileage}
            </span>
          </div>

          {/* 3. FUEL CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm min-w-[200px] hover:border-teal-600 transition-colors cursor-default">
            {/* Fuel Pump Icon */}
            <img className='w-12 h-auto object-contain' src={fuelCapacity} alt='' />
            <span className="text-lg md:text-xl font-bold text-black">
              {specs.fuel}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BikeKeyFeatures;