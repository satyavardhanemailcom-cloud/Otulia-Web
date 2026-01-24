import React from 'react';

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
    <div className="flex items-center gap-4 border border-gray-200 rounded-lg px-6 py-4 bg-white shadow-sm hover:border-[#B8860B] transition-colors cursor-default w-full">
      {/* Icon Container - Fixed width for alignment */}
      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col">
        {/* If label exists, show it, otherwise just show value (like the image implies mixed usage) */}
        <span className="text-lg md:text-xl font-bold montserrat text-black whitespace-nowrap">
           {label ? `${label}: ${value}` : value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 bg-white font-sans">
      
      {/* Header Box - Centered with Gold Border */}
      <div className="flex justify-center mb-10">
        <div className="border border-[#B8860B] rounded-lg px-8 py-3 inline-block">
          <h2 className="text-2xl md:text-3xl font-bold playfair-display text-[#8B7355] text-center">
            Key Features of Property
          </h2>
        </div>
      </div>

      {/* 3-Column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ROW 1 */}
        {/* 1. Land Area */}
        <FeatureCard 
          label="Land Area"
          value={specs.landArea}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#006d77" strokeWidth="1.5" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          }
        />

        {/* 2. Bathrooms */}
        <FeatureCard 
          label="Bathrooms"
          value={specs.bathrooms}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#006d77" strokeWidth="1.5" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          }
        />

        {/* 3. Garage */}
        <FeatureCard 
          label="Garage"
          value={specs.garage}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#006d77" strokeWidth="1.5" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          }
        />

        {/* ROW 2 */}
        {/* 4. Area (sqft) - No label in image, just value */}
        <FeatureCard 
          label="Built Area" 
          value={specs.area}
          icon={
             <div className="border-2 border-[#006d77] p-0.5 rounded-sm">
               <span className="text-[10px] font-bold text-[#006d77]">sqft</span>
             </div>
          }
        />

        {/* 5. Bedrooms */}
        <FeatureCard 
          label="Bedrooms"
          value={specs.bedrooms}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#006d77" strokeWidth="1.5" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
        />

        {/* 6. Floors */}
        <FeatureCard 
          label="Floors"
          value={specs.floors}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#006d77" strokeWidth="1.5" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
            </svg>
          }
        />

      </div>
    </div>
  );
};

export default EstateKeyFeatures;