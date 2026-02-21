import React from 'react';

const YachtFeatures = ({ item }) => {
  // 1. Safe access to nested objects based on your Schema
  const specs = item?.specification || {};
  const keySpecs = item?.keySpecifications || {};

  // 2. Helper to format price
  const formatPrice = (price) => {
    if (!price) return "-";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  // 3. Helper function to render a single row
  const SpecRow = ({ label, value, isLink = false, icon = null }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 montserrat">
      <span className="text-gray-500 font-normal text-sm md:text-base">
        {label}
      </span>
      <div className="flex items-center gap-2 text-right">
        {icon && <span>{icon}</span>}
        <span 
          className={`text-sm md:text-base font-medium text-black ${
            isLink ? 'underline decoration-gray-400 cursor-pointer hover:text-gray-600' : ''
          }`}
        >
          {value || "-"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[90%] mx-auto px-4 md:px-8 py-8 bg-white montserrat">
      
      {/* Title */}
      <h3 className="text-2xl font-bold mb-6">Yacht Details</h3>

      {/* Container - Stacks on mobile, 2 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
        
        {/* LEFT COLUMN - General Info & Identity */}
        <div className="flex flex-col">
          {/* Mapping fields from Image Header & General Column */}
          <SpecRow label="Builder:" value={item?.builder || specs.brandBuilder} isLink />
          <SpecRow label="Model:" value={specs.model} isLink />
          <SpecRow label="Year:" value={specs.yearOfConstruction} />
          <SpecRow label="Listing Type:" value={item?.type} />
          
          {/* Location with Icon */}
          <SpecRow 
            label="Location:" 
            value={item?.location} 
            isLink 
            icon={<span className="text-lg">📍</span>}
          />

          <SpecRow label="Condition:" value={specs.condition} />
          <SpecRow label="Usage Status:" value={specs.usageStatus} />
        </div>

        {/* RIGHT COLUMN - Technical Specs & Dimensions */}
        <div className="flex flex-col">
          {/* Mapping fields from Image Body & Key Specs */}
          <SpecRow label="Length:" value={keySpecs.length || specs.length} />
          <SpecRow label="Engine / Power:" value={specs.enginePower || keySpecs.totalPower} />
          <SpecRow label="Cruising Speed:" value={specs.cruisingSpeed} />
          <SpecRow label="Top Speed:" value={keySpecs.topSpeed || specs.topSpeed} />
          
          <SpecRow label="Fuel Capacity:" value={keySpecs.fuelCapacity} />
          <SpecRow label="Hull Material:" value={specs.hullMaterial} />
          
          {/* Accommodation (Mapping Bedrooms to Guest Capacity context) */}
          <SpecRow label="Bedrooms / Cabins:" value={keySpecs.bedrooms} />
          <SpecRow label="Bathrooms:" value={keySpecs.bathrooms} />
        </div>

      </div>
    </div>
  );
};

export default YachtFeatures;