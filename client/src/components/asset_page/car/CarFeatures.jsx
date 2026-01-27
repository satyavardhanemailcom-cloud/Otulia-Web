import React from 'react';

const CarFeatures = ({ item }) => {
  // Safe access to specifications to prevent crashes
  const specs = item?.specification || {};

  // Helper function to render a single row
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
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-8 bg-white montserrat">
      
      {/* Container - Stacks on mobile, 2 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          <SpecRow label="Year of construction:" value={specs.yearOfConstruction} isLink />
          <SpecRow label="Model:" value={specs.model} isLink />
          <SpecRow label="Body:" value={specs.body} isLink />
          <SpecRow label="Series:" value={specs.series} isLink />
          <SpecRow label="Mileage:" value={specs.mileage} />
          <SpecRow label="Power:" value={specs.power} />
          <SpecRow label="Cylinder capacity:" value={specs.cylinderCapacity} />
          <SpecRow label="CO2 emissions:" value={specs.co2Emission} />
          <SpecRow label="Consumption:" value={specs.consumption} />
          <SpecRow label="Steering:" value={specs.steering} />
          <SpecRow label="Transmission:" value={specs.transmission} />
          <SpecRow label="Drive:" value={specs.drive} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col">
          <SpecRow label="Fuel:" value={specs.fuel} />
          <SpecRow label="Configuration:" value={specs.configuration} />
          <SpecRow label="Interior material:" value={specs.interiorMaterial} />
          <SpecRow label="Interior color:" value={specs.interiorColor} />
          <SpecRow label="Exterior color:" value={specs.exteriorColor} isLink />
          <SpecRow label="Manufacturer color code:" value={specs.manufacturerColorCode} />
          <SpecRow label="Matching numbers:" value={specs.matchingNumbers} />
          <SpecRow label="Condition:" value={specs.condition} />
          <SpecRow label="New / used:" value={specs.usageStatus} />
          <SpecRow label="Country of first delivery:" value={specs.countryOfFirstDelivery} />
          <SpecRow label="Number of vehicle owners:" value={specs.numberOfOwners} />
          
          {/* Location Row with Flag */}
          <SpecRow 
            label="Car location:" 
            value={specs.carLocation} 
            isLink 
            icon={
              // Simple German Flag placeholder using standard emoji or div
              // Adjust based on country data if dynamic
              <span className="text-xl">🇩🇪</span> 
            }
          />
        </div>

      </div>
    </div>
  );
};

export default CarFeatures;