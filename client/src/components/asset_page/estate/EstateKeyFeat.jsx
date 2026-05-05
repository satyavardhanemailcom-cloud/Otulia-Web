import React from 'react';
import bedRoom from '../../../assets/productpage/bedroom.png'
import sqrtFt from '../../../assets/productpage/sqft.png'
import bathRoom from '../../../assets/productpage/bathroom.png'
import land from '../../../assets/productpage/land.png'
import floor from '../../../assets/productpage/floor.png'
import garage from '../../../assets/productpage/garage.png'


const EstateKeyFeatures = ({ item }) => {
  const kSpecs = item?.keySpecifications || {};

  const specItems = [
    { label: 'Bedrooms', value: kSpecs.bedrooms, icon: bedRoom },
    { label: 'Bathrooms', value: kSpecs.bathrooms, icon: bathRoom },

    { label: 'Built Area', value: kSpecs.builtUpArea, icon: sqrtFt },
    { label: 'Land Area', value: kSpecs.landArea, icon: land },
    { label: 'Floors', value: kSpecs.floors, icon: floor },
    { label: 'Garage', value: kSpecs.garageCapacity, icon: garage }
  ].filter(spec => spec.value && spec.value !== "0" && spec.value !== "-");

  if (specItems.length === 0) return null;

  // Helper Component for a Feature Card
  const FeatureCard = ({ icon, label, value }) => (
    <div className="flex items-center w-9/10 gap-4 border border-gray-100 rounded-lg px-4   py-4 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-default font-poppins-light">
      {/* Icon Container */}
      <div className="w-8 h-8 flex justify-center items-center opacity-80 shrink-0">
        {icon}
      </div>
      {/* Text Content */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-poppins-light font-light text-gray-400 uppercase tracking-[0.2em]">{label}</span>
         <span className="text-lg font-poppins-light font-light text-black">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full px-[2%] py-10 bg-white font-poppins-light">

      {/* Header Box - Line with Centered Text */}
      <div className="mb-12">

        {/* Heading */}
        <div className="flex items-center justify-center gap-6">
          <div className="flex-1 h-px bg-gray-300"></div>

          <h2 className="text-2xl md:text-3xl font-normal canela text-black">
            Key Features
          </h2>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Highlights row */}
        <div className="grid grid-cols-3 items-center mt-3">

          {/* Left */}
          <span className="text-[10px] font-bold text-[#B58252] uppercase tracking-[0.2em]">
            Highlights
          </span>

          {/* Center */}
          <div className="flex justify-center">
            <span className="text-[#B58252] text-[10px]">♦</span>
          </div>

          {/* Right (empty for balance) */}
          <div></div>

        </div>

      </div>
      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 w-full font-poppins-light">
        {specItems.map((spec, index) => (
          <FeatureCard
            key={index}
            label={spec.label}
            value={spec.value}
            icon={<img className='w-full h-full object-contain' style={{ filter: 'grayscale(100%) opacity(80%)' }} src={spec.icon} alt={spec.label} />}
          />
        ))}
      </div>
    </div>
  );
};

export default EstateKeyFeatures;