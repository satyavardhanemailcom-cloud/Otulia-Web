import React from 'react';

const YachtFeatures = ({ item }) => {
  // Safe access to specification object
  const specs = item?.specification || {};

  // Helper component for a single specification row
  const SpecRow = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm md:text-base w-1/3">{label}</span>
      <span className="text-gray-900 font-medium text-sm md:text-base text-right w-2/3 break-words">
        {value || "-"}
      </span>
    </div>
  );

  // Helper component for a Section Group
  const SpecSection = ({ title, children }) => (
    <div className="mb-8 h-full montserrat">
      {/* Visual Header matching the screenshot style (grey background header not strictly necessary but nice, 
          using the bold side-border style to match previous components for consistency) */}
      <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-gray-800 pl-3">
        {title}
      </h3>
      <div className="bg-white rounded-lg p-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-8 bg-white montserrat">
      
      {/* Grid Layout: Stacks on mobile, 2 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0 items-start">
        
        {/* LEFT COLUMN: General */}
        <div className="flex flex-col">
          <SpecSection title="General">
            <SpecRow label="Year of construction:" value={specs.yearOfConstruction} />
            <SpecRow label="Brand / Builder:" value={specs.brandBuilder} />
            <SpecRow label="Model:" value={specs.model} />
            <SpecRow label="Yacht type:" value={specs.yachtType} />
            <SpecRow label="Usage hours:" value={specs.usageHours} />
            <SpecRow label="Top speed:" value={specs.topSpeed} />
            <SpecRow label="Engine power:" value={specs.enginePower} />
            <SpecRow label="Cruising speed:" value={specs.cruisingSpeed} />
            <SpecRow label="Fuel consumption:" value={specs.fuelConsumption} />
            <SpecRow label="Transmission:" value={specs.transmission} />
            <SpecRow label="Hull material:" value={specs.hullMaterial} />
          </SpecSection>
        </div>

        {/* RIGHT COLUMN: Fuel & Configuration (Matches the "Fuel:" column in image) */}
        <div className="flex flex-col">
          <SpecSection title="Fuel & Configuration">
            <SpecRow label="Fuel:" value={specs.fuelType} />
            <SpecRow label="Configuration:" value={specs.configuration} />
            <SpecRow label="Interior material:" value={specs.interiorMaterial} />
            <SpecRow label="Interior color:" value={specs.interiorColor} />
            <SpecRow label="Exterior color:" value={specs.exteriorColor} />
            <SpecRow label="Manufacturer color code:" value={specs.manufacturerColorCode} />
            <SpecRow label="Matching numbers:" value={specs.matchingNumbers} />
            <SpecRow label="Condition:" value={specs.condition} />
            <SpecRow label="New / used:" value={specs.usageStatus} />
            <SpecRow label="Country of first delivery:" value={specs.countryOfFirstDelivery} />
            <SpecRow label="Number of owners:" value={specs.numberOfOwners} />
          </SpecSection>
        </div>

      </div>
    </div>
  );
};

export default YachtFeatures;