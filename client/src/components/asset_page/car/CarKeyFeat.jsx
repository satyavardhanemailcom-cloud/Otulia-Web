import React from "react";
import powerIcon from "../../../assets/productpage/power.webp";
import speedIcon from "../../../assets/productpage/speed.webp";
import engineIcon from "../../../assets/productpage/engine.webp";
import torqueIcon from "../../../assets/productpage/torque.svg";
import accelerationIcon from "../../../assets/productpage/acceleration.svg";
import mileageIcon from "../../../assets/productpage/mileage.svg";

// "1240" -> "1,240 mi". Zero-mileage cars are new, so keep 0 visible.
const formatMileage = (value) => {
  if (value === undefined || value === null) return null;
  const text = value.toString().trim();
  const miles = parseFloat(text.replace(/,/g, ""));
  if (Number.isNaN(miles)) return null;
  return /^[\d,.\s]+$/.test(text) ? `${miles.toLocaleString()} mi` : text;
};

const CarKeyFeatures = ({ item }) => {
  const kSpecs = item?.keySpecifications || {};
  const specs = item?.specification || {};

  const specItems = [
    { label: "Power", value: kSpecs.power || specs.power, icon: powerIcon },
    {
      label: "Top Speed",
      value: kSpecs.topSpeed || specs.topSpeed,
      icon: speedIcon,
    },
    {
      label: "Engine",
      value: kSpecs.engineType || specs.engineType || specs.engine,
      icon: engineIcon,
    },
    { label: "Torque", value: specs.torque?.toString().replace(/^\d{4,}/, (n) => Number(n).toLocaleString()), icon: torqueIcon },
    { label: "0-100 km/h", value: specs.acceleration, icon: accelerationIcon },
    { label: "Mileage", value: formatMileage(specs.mileage), icon: mileageIcon },
  ].filter((spec) => spec.value && spec.value !== "0" && spec.value !== "-");

  if (specItems.length === 0) return null;

  // Helper Component for a Feature Card
  const FeatureCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 w-full max-w-[300px] md:w-[300px] h-[100px] bg-[#FCFBF9] border border-[#E8E3DD] rounded-[8px] px-5 py-[12px] shadow-none hover:shadow-sm transition-shadow cursor-default">
      {/* Icon Container */}
      <div className="flex justify-center items-center shrink-0">
        <img
          src={icon}
          alt={label}
          className="w-[70px] h-[70px] object-contain mix-blend-multiply"
        />
      </div>
      {/* Text Content */}
      <div className="flex flex-col gap-[2px] justify-center">
        <span className="text-[9px] font-semibold text-[#9D8F84] uppercase tracking-[1.8px] leading-[11px] montserrat">
          {label}
        </span>
        <span className="text-[18px] font-semibold text-[#1E1E1E] leading-[22px] font-cormorant">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full px-[4%] py-10 md:py-16 bg-white">
      {/* Header Box - Line with Centered Text */}
      <div className="relative flex items-center justify-center mb-10 md:mb-16">
        <span className="hidden md:inline absolute left-0 text-[10px] font-bold text-[#B58252] uppercase tracking-[0.2em] bg-white z-10 pr-4">
          HIGHLIGHTS
        </span>
        <div className="w-full h-px bg-gray-200"></div>
        <div className="absolute bg-white px-4 md:px-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-normal canela text-black whitespace-nowrap">
            Key Features
          </h2>
          <span className="text-[#B58252] text-xs mt-2">♦</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto justify-items-center">
        {specItems.map((spec, index) => (
          <FeatureCard
            key={index}
            label={spec.label}
            value={spec.value}
            icon={spec.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default CarKeyFeatures;
