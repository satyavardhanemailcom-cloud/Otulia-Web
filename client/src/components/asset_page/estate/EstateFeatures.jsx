import React from 'react';

const EstateFeatures = ({ item }) => {
  // Safe access to specifications to prevent crashes
  const specs = item?.specification || {};

  // Helper function to render a single row
  const SpecRow = ({ label, value, isLink = false, icon = null }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 montserrat">
      <span className="text-gray-900 font-normal text-sm md:text-base">
        {label}
      </span>
      <div className="flex items-center gap-2 text-right">
        {icon && <span>{icon}</span>}
        <span 
          className={`text-sm md:text-base font-normal text-gray-500 ${
            isLink ? 'underline decoration-gray-400 cursor-pointer hover:text-gray-700' : ''
          }`}
        >
          {value || "-"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-8 bg-white montserrat">
      
      {/* Container - Stacks on mobile, 2 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          <SpecRow label="Year of construction:" value={specs.yearOfConstruction} />
          <SpecRow label="Property type:" value={specs.propertyType} />
          <SpecRow label="Architecture style:" value={specs.architectureStyle} />
          <SpecRow label="Built-up area:" value={specs.builtUpArea} />
          <SpecRow label="Land area:" value={specs.landArea} />
          <SpecRow label="Floors:" value={specs.floors} />
          <SpecRow label="Bedrooms:" value={specs.bedrooms} />
          <SpecRow label="Bathrooms:" value={specs.bathrooms} />
          <SpecRow label="Ceiling height:" value={specs.ceilingHeight} />
          <SpecRow label="Parking capacity:" value={specs.parkingCapacity} />
          <SpecRow label="Furnishing status:" value={specs.furnitureStatus} />
          <SpecRow label="Ownership type:" value={specs.ownershipType} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col">
          <SpecRow label="View:" value={specs.view} />
          <SpecRow label="Configuration:" value={specs.configuration} />
          <SpecRow label="Interior material:" value={specs.interiorMaterial} />
          <SpecRow label="Interior color theme:" value={specs.interiorColorTheme} />
          <SpecRow label="Exterior finish:" value={specs.exteriorFinish} />
          <SpecRow label="Outdoor spaces:" value={specs.outdoorSpaces} />
          <SpecRow label="Climate control:" value={specs.climateControl} />
          <SpecRow label="Smart home system:" value={specs.smartHomeSystem} />
          <SpecRow label="Security:" value={specs.security} />
          <SpecRow label="Condition:" value={specs.condition} />
          <SpecRow label="Usage status:" value={specs.usageStatus} />
          <SpecRow 
            label="Country:" 
            value={specs.country} 
            icon={
              // Assuming Italy based on image, but dynamic if needed
              <span className="text-lg">🇮🇹</span> 
            }
          />
        </div>

      </div>
    </div>
  );
};

export default EstateFeatures;