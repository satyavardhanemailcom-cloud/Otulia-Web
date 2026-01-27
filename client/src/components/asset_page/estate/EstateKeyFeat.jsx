import React from 'react';
import bedRoom from '../../../assets/productpage/bedroom.png'
import sqrtFt from '../../../assets/productpage/sqft.png'
import bathRoom from '../../../assets/productpage/bathroom.png'
import land from '../../../assets/productpage/land.png'
import floor from '../../../assets/productpage/floor.png'
import garage from '../../../assets/productpage/garage.png'


const EstateKeyFeatures = ({ item }) => {
  // Map data from your schema to match the image fields
  // Fallbacks provided for preview
  const specs = {
    landArea: item?.keySpecifications?.landArea || "1.8 acres",
    bathrooms: item?.keySpecifications?.bathrooms || "13",
    garage: item?.keySpecifications?.garage_capacity || "6 cars",
    area: item?.keySpecifications?.builtUpArea || "12,400 sqft",
    bedrooms: item?.keySpecifications?.bedrooms || "9",
    floors: item?.keySpecifications?.floors || "3"
  };

  // Helper Component for a Feature Card
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
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-8 bg-white font-sans">
      
      {/* Header Box - Centered with Gold Border */}
      <div className="flex justify-center mb-10">
        <div className="border border-[#B8860B] rounded-lg px-8 py-3 inline-block">
          <h2 className="text-2xl md:text-3xl font-bold playfair-display text-[#8B7355] text-center">
            Key Features of Property
          </h2>
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        
        {/* ROW 1 */}
        {/* 1. Land Area */}
        <FeatureCard 
          label="Land Area"
          value={specs.landArea}
          icon={
            <img className='w-19 h-15' src={land} alt='' />
          }
        />

        {/* 2. Bathrooms */}
        <FeatureCard 
          label="Bathrooms"
          value={specs.bathrooms}
          icon={
             <img className='w-17 h-15' src={bathRoom} alt='' />
          }
        />

        {/* 3. Garage */}
        <FeatureCard 
          label="Garage"
          value={specs.garage}
          icon={
             <img className='w-18 h-15' src={garage} alt='' />
          }
        />

        {/* ROW 2 */}
        {/* 4. Area (sqft) - No label in image, just value */}
        <FeatureCard 
          label="Built Area" 
          value={specs.area}
          icon={
             <img className='w-15 h-15' src={sqrtFt} alt='' />
          }
        />

        {/* 5. Bedrooms */}
        <FeatureCard 
          label="Bedrooms"
          value={specs.bedrooms}
          icon={
            <img className='w-17 h-15' src={bedRoom} alt='' />
          }
        />

        {/* 6. Floors */}
        <FeatureCard 
          label="Floors"
          value={specs.floors}
          icon={
            <img className='w-16 h-15' src={floor} alt='' />
          }
        />

      </div>
    </div>
  );
};

export default EstateKeyFeatures;