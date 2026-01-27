import React from 'react';

const BikeFeatures = ({ item }) => {
  // DEBUG: Check your browser console to see what 'item' actually contains
  console.log("BikeFeatures received item:", item);

  // Safety check 1: Is item undefined?
  if (!item) {
    return <div className="p-4 text-red-500">Error: No data passed to component</div>;
  }

  // Safety check 2: Handle if 'item' IS the specification itself, or if it HAS a specification field
  // This makes the component work even if you pass <BikeFeatures item={info.specification} />
  const specs = item.specification || item || {};
  
  // Helper to safely render values (handles 0, null, and undefined)
  const formatValue = (val, unit = "") => {
    if (val === undefined || val === null || val === "") return "-";
    return `${val}${unit}`;
  };

  const SpecRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 montserrat">
      <span className="text-gray-500 text-sm md:text-base">{label}</span>
      <span className="text-gray-900 font-medium text-sm md:text-base text-right">
        {value}
      </span>
    </div>
  );

  const SpecSection = ({ title, children }) => (
    <div className="mb-8 break-inside-avoid">
      <h3 className="text-lg font-bold text-black mb-4 border-l-4 border-gray-800 pl-3">
        {title}
      </h3>
      <div className="bg-white rounded-lg p-0">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-8 bg-white font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0 items-start">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col">
          <SpecSection title="General Information">
            <SpecRow label="Brand:" value={formatValue(specs.brand)} />
            <SpecRow label="Model:" value={formatValue(specs.model)} />
            <SpecRow label="Variant:" value={formatValue(specs.variant)} />
            <SpecRow label="Year:" value={formatValue(specs.yearOfConstruction || specs.year)} />
            <SpecRow label="Color:" value={formatValue(specs.color)} />
          </SpecSection>

          <SpecSection title="History & Condition">
            <SpecRow label="Condition:" value={formatValue(specs.condition)} />
            <SpecRow label="Owners:" value={formatValue(specs.ownershipCount)} />
            <SpecRow label="Accident History:" value={formatValue(specs.accidentHistory)} />
          </SpecSection>

          <SpecSection title="Engine & Performance">
            <SpecRow label="Engine Type:" value={formatValue(specs.engineType)} />
            {/* Try multiple key names for Capacity */}
            <SpecRow 
              label="Engine Capacity:" 
              value={formatValue(specs.engineCapacityCC || specs.engineCapacity, " cc")} 
            />
            <SpecRow label="Max Power:" value={formatValue(specs.maxPower)} />
            <SpecRow label="Max Torque:" value={formatValue(specs.maxTorque)} />
            <SpecRow label="Transmission:" value={formatValue(specs.transmission)} />
            <SpecRow label="Fuel System:" value={formatValue(specs.fuelSystem)} />
            {/* Try multiple key names for Mileage */}
            <SpecRow 
              label="Mileage:" 
              value={formatValue(specs.mileageKM || specs.mileage, " km/l")} 
            />
            <SpecRow label="Fuel Type:" value={formatValue(specs.fuelType)} />
          </SpecSection>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col">
          <SpecSection title="Chassis & Suspension">
            <SpecRow label="Frame:" value={formatValue(specs.frame)} />
            <SpecRow label="Front Suspension:" value={formatValue(specs.frontSuspension)} />
            <SpecRow label="Front Brake:" value={formatValue(specs.frontBrake)} />
            <SpecRow label="Rear Brake:" value={formatValue(specs.rearBrake)} />
          </SpecSection>

          <SpecSection title="Safety & Electronics">
            <SpecRow label="ABS:" value={formatValue(specs.abs)} />
            <SpecRow label="Traction Control:" value={formatValue(specs.tractionControl)} />
            <SpecRow label="Ride Modes:" value={formatValue(specs.rideModes)} />
            <SpecRow label="Immobilizer:" value={formatValue(specs.immobilizer)} />
          </SpecSection>

          <SpecSection title="Wheels & Tyres">
            <SpecRow label="Front Wheel:" value={formatValue(specs.frontWheel)} />
            <SpecRow label="Rear Wheel:" value={formatValue(specs.rearWheel)} />
            <SpecRow label="Tyre Type:" value={formatValue(specs.tyreType)} />
          </SpecSection>
        </div>

      </div>
    </div>
  );
};

export default BikeFeatures;