import React from 'react';

const BikeFeatures = ({ item }) => {
  // Safe access to specification object
  const specs = item?.specification || {};

  // Helper component for a single specification row
  const SpecRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm md:text-base">{label}</span>
      <span className="text-gray-900 font-medium text-sm md:text-base text-right">{value || "-"}</span>
    </div>
  );

  // Helper component for a Section Group (e.g., General, Engine & Performance)
  const SpecSection = ({ title, children }) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-gray-800 pl-3">
        {title}
      </h3>
      <div className="bg-white rounded-lg p-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 bg-white font-sans">
      
      {/* Grid Layout: Stacks on mobile, 2 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          {/* General Section */}
          <SpecSection title="General">
            <SpecRow label="Year of construction:" value={specs.yearOfConstruction} />
            <SpecRow label="Brand:" value={specs.brand} />
            <SpecRow label="Model:" value={specs.model} />
            <SpecRow label="Year:" value={specs.year} />
            <SpecRow label="Condition:" value={specs.condition} />
          </SpecSection>

          {/* Engine & Performance Section */}
          <SpecSection title="Engine & Performance">
            <SpecRow label="Engine Type:" value={specs.engineType} />
            <SpecRow label="Engine Capacity:" value={specs.engineCapacityCC ? `${specs.engineCapacityCC} cc` : specs.engineCapacity} />
            <SpecRow label="Max Power:" value={specs.maxPower} />
            <SpecRow label="Max Torque:" value={specs.maxTorque} />
            <SpecRow label="Transmission:" value={specs.transmission} />
            <SpecRow label="Fuel System:" value={specs.fuelSystem} />
            <SpecRow label="Mileage:" value={specs.mileageKM ? `${specs.mileageKM} km/l` : specs.mileage} />
            <SpecRow label="Fuel Type:" value={specs.fuelType} />
          </SpecSection>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col">
          {/* Chassis & Suspension Section */}
          <SpecSection title="Chassis & Suspension">
            <SpecRow label="Frame:" value={specs.frame} />
            <SpecRow label="Front Suspension:" value={specs.frontSuspension} />
            <SpecRow label="Front Brake:" value={specs.frontBrake} />
            <SpecRow label="Rear Brake:" value={specs.rearBrake} />
          </SpecSection>

          {/* Safety & Electronics Section */}
          <SpecSection title="Safety & Electronics">
            <SpecRow label="ABS:" value={specs.abs} />
            <SpecRow label="Traction Control:" value={specs.tractionControl} />
            <SpecRow label="Ride Modes:" value={specs.rideModes} />
            <SpecRow label="Immobilizer:" value={specs.immobilizer} />
          </SpecSection>

          {/* Wheels & Tyres Section */}
          <SpecSection title="Wheels & Tyres">
            <SpecRow label="Front Wheel:" value={specs.frontWheel} />
            <SpecRow label="Rear Wheel:" value={specs.rearWheel} />
            <SpecRow label="Tyre Type:" value={specs.tyreType} />
          </SpecSection>
        </div>

      </div>
    </div>
  );
};

export default BikeFeatures;