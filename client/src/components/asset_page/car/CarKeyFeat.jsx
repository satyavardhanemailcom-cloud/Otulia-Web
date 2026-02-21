import React from 'react';
import power from '../../../assets/productpage/power.png'
import speed from '../../../assets/productpage/speed.png'
import engine from '../../../assets/productpage/engine.png'

const CarKeyFeatures = ({ item }) => {
  // Fallback data matching your screenshot
  const specs = {
    power: item?.keySpecifications?.power || "518 HP",
    speed: item?.keySpecifications?.topSpeed || "300 km/h",
    engine: item?.keySpecifications?.engineType || "Inline V6"
  };

  return (
    <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-6 bg-white self-center">

      {/* Changed flex-row to flex-col to stack title on top */}
      <div className="flex flex-col items-center gap-8">

        {/* Heading - Centered and full width */}
        <h2 className="text-2xl md:text-3xl font-bold playfair-display text-black text-center w-full">
          Key Specifications
        </h2>

        {/* Specifications Grid - Justified Center */}
        <div className="flex flex-wrap justify-center gap-6 w-full montserrat">

          {/* 1. POWER CARD */}
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm min-w-[200px] hover:border-teal-600 transition-colors cursor-default">
            <img className='w-12 h-auto object-contain' src={power} alt='Power' />

            <span className="text-lg md:text-xl font-bold text-black">
              {specs.power}
            </span>
          </div>

          {/* 2. SPEED CARD */}

          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Speedometer Icon */}
            <img className='w-17 h-15' src={speed} alt='' />

            <span className="text-lg md:text-xl font-bold text-black">
              {specs.speed}
            </span>
          </div>

          {/* 3. ENGINE TYPE CARD */}

          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-6 py-3 bg-white shadow-sm min-w-[180px] hover:border-teal-600 transition-colors cursor-default">
            {/* Piston/Engine Block Icon */}
            <img className='w-17 h-15' src={engine} alt='' />

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