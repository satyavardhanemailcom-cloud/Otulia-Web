import React from 'react';

const BikeFeatures = ({ item }) => {
  // 1. Safe access to nested objects
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
      <h3 className="text-2xl font-bold mb-6">Bike Specifications</h3>

      {/* Container - Stacks on mobile, 2 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
        
        {/* LEFT COLUMN - Identity & General */}
        <div className="flex flex-col">
          <SpecRow label="Brand:" value={item?.brand || specs.brand} isLink />
          <SpecRow label="Model:" value={specs.model} isLink />
          <SpecRow label="Variant:" value={item?.variant || specs.variant} />
          <SpecRow label="Year:" value={specs.yearOfConstruction || specs.year} />
          
          <SpecRow label="Listing Type:" value={item?.type} />
          
          {/* Location with Icon */}
          <SpecRow 
            label="Location:" 
            value={item?.location} 
            isLink 
            icon={<span className="text-lg">📍</span>}
          />
        </div>

        {/* RIGHT COLUMN - Specs & Condition */}
        <div className="flex flex-col">
          {/* Specifications Section */}
          <SpecRow label="Engine Capacity:" value={keySpecs.engineCapacity || specs.engineCapacityCC} />
          <SpecRow label="Mileage:" value={keySpecs.mileage || specs.mileageKM} />
          <SpecRow label="Fuel Type:" value={keySpecs.fuelType || specs.fuelType} />
          <SpecRow label="Transmission:" value={keySpecs.transmission || specs.transmission} />
          <SpecRow label="Color:" value={keySpecs.color || specs.color} />

          {/* Condition Section */}
          <SpecRow label="Condition / Status:" value={specs.condition || specs.usageStatus} />
          <SpecRow label="Ownership Count:" value={specs.ownershipCount} />
          <SpecRow label="Accident History:" value={specs.accidentHistory} />
        </div>

      </div>
    </div>
  );
};

export default BikeFeatures;