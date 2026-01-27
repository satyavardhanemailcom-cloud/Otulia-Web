import React from 'react';
import sqrtFt from '../../../assets/productpage/sqft.png'
import bathRoom from '../../../assets/productpage/bathroom.png'
import fuelCapacity from '../../../assets/productpage/fuelcapacity.png'
import power from '../../../assets/productpage/power.png'
import bedRoom from '../../../assets/productpage/bedroom.png'
import speed from '../../../assets/productpage/speed.png'

const YachtKeyFeatures = ({ item }) => {
  // Fallback data matching your screenshot
  const specs = {
    length: item?.keySpecifications?.length || "27 M length",
    bathrooms: item?.keySpecifications?.bathrooms || "6",
    fuel: item?.keySpecifications?.fuelCapacity || "9,500 L fuel capacity",
    power: item?.keySpecifications?.totalPower || "3,800 HP total",
    bedrooms: item?.keySpecifications?.bedrooms || "7",
    speed: item?.keySpecifications?.topSpeed || "28 knots"
  };

  // Helper component for a single feature card
  const FeatureCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm hover:border-[#006d77] transition-colors cursor-default montserrat">
      {/* Icon Container */}
      <div className="text-[#006d77]">
        {icon}
      </div>
      {/* Text Content */}
      <div className="flex gap-1 items-baseline">
         {label && <span className="text-lg font-bold montserrat text-black">{label}:</span>}
         <span className="text-lg font-bold montserrat text-black">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-8 bg-white">
      
      {/* Header Section */}
      <div className="flex justify-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold playfair-display text-[#8b7355] border border-[#8b7355] px-8 py-2 rounded-md inline-block">
          Key Features of Property
        </h2>
      </div>

      {/* Grid Layout: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. LENGTH CARD */}
        <FeatureCard 
          value={specs.length}
          icon={
            <img className='w-15 h-15' src={sqrtFt} alt='' />
          }
        />

        {/* 2. BATHROOMS CARD */}
        <FeatureCard 
          label="Bathrooms"
          value={specs.bathrooms}
          icon={
            <img className='w-17 h-15' src={bathRoom} alt='' />
          }
        />

        {/* 3. FUEL CAPACITY CARD */}
        <FeatureCard 
          value={specs.fuel}
          icon={
            <img className='w-15 h-15' src={fuelCapacity} alt='' />
          }
        />

        {/* 4. TOTAL POWER CARD */}
        <FeatureCard 
          value={specs.power}
          icon={
              <img className='w-19 h-15' src={power} alt='' />
          }
        />

        {/* 5. BEDROOMS CARD */}
        <FeatureCard 
          label="Bedrooms"
          value={specs.bedrooms}
          icon={
             <img className='w-16 h-15' src={bedRoom} alt='' />
          }
        />

        {/* 6. TOP SPEED CARD */}
        <FeatureCard 
          label="TopSpeed"
          value={specs.speed}
          icon={
             <img className='w-17 h-15' src={speed} alt='' />
          }
        />

      </div>
    </div>
  );
};

export default YachtKeyFeatures;