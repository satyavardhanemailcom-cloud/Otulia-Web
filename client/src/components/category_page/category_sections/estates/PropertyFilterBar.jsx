import React, { useState, useEffect, useRef } from "react";

const PropertyFilterBar = ({
  onFilter,
  initialLocation = "",
  hideLocation = false,
}) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    q: "",
    location: initialLocation,
    priceRange: "Any Price",
    type: "Any",
    bedrooms: "Any",
    sizeLand: "Any SqFt",
    bathrooms: "Any",
    architecture: "Any",
    amenities: "Any",
    sort: "Newest",
  });

  // For Type subcategories
  const [expandedTypeGroup, setExpandedTypeGroup] = useState(null);
  // For Amenities multi-select
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    setSelectedFilters((prev) => ({ ...prev, location: initialLocation }));
  }, [initialLocation]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (
        !hideLocation &&
        selectedFilters.location &&
        selectedFilters.location.length > 0
      ) {
        try {
          const response = await fetch(
            `/api/assets/location-suggestions?q=${selectedFilters.location}`,
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch location suggestions", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedFilters.location, hideLocation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── TYPE DATA ──────────────────────────────────────────────────────────────
  const typeGroups = [
    {
      label: "House",
      key: "House",
      subcategories: [
        "Villa",
        "Estate",
        "Country House",
        "Finca",
        "Chalet",
        "Townhouse",
        "Bungalow",
      ],
    },
    {
      label: "Apartment",
      key: "Apartment",
      subcategories: ["Apartment", "Penthouse", "Condo", "Co Op"],
    },
    { label: "Land", key: "Land", subcategories: [] },
    { label: "Castle", key: "Castle", subcategories: [] },
    { label: "Chateau", key: "Chateau", subcategories: [] },
    { label: "Farm Ranch", key: "Farm Ranch", subcategories: [] },
    { label: "Private Island", key: "Private Island", subcategories: [] },
  ];

  // ── AMENITIES DATA ─────────────────────────────────────────────────────────
  const amenityGroups = [
    {
      group: "View",
      items: [
        { label: "Panoramic / Scenic View", icon: <PanoramicIcon /> },
        { label: "Mountain View", icon: <MountainIcon /> },
        { label: "Water View", icon: <WaterViewIcon /> },
        { label: "Ocean View", icon: <OceanViewIcon /> },
        { label: "Sea View", icon: <SeaViewIcon /> },
        { label: "Lake View", icon: <LakeViewIcon /> },
        { label: "River View", icon: <RiverViewIcon /> },
        { label: "Golf View", icon: <GolfViewIcon /> },
      ],
    },
    {
      group: "Outdoor",
      items: [
        { label: "Garage", icon: <GarageIcon /> },
        { label: "Pool", icon: <PoolIcon /> },
        { label: "Garden", icon: <GardenIcon /> },
        { label: "Balcony", icon: <BalconyIcon /> },
        { label: "Terrace", icon: <TerraceIcon /> },
        { label: "Tennis Court", icon: <TennisIcon /> },
        { label: "Outdoor Kitchen", icon: <OutdoorKitchenIcon /> },
        { label: "Private Beach", icon: <BeachIcon /> },
        { label: "Vineyard / Winery", icon: <VineyardIcon /> },
        { label: "Private Airport", icon: <AirportIcon /> },
        { label: "Helipad", icon: <HelipadIcon /> },
      ],
    },
    {
      group: "Indoor",
      items: [
        { label: "Fireplace", icon: <FireplaceIcon /> },
        { label: "Bar", icon: <BarIcon /> },
        { label: "Office", icon: <OfficeIcon /> },
        { label: "Fitness Center / Gym", icon: <GymIcon /> },
        { label: "Open Kitchen", icon: <KitchenIcon /> },
        { label: "Air Conditioning", icon: <ACIcon /> },
        { label: "Jacuzzi", icon: <JacuzziIcon /> },
        { label: "Elevator", icon: <ElevatorIcon /> },
        { label: "Game Room", icon: <GameRoomIcon /> },
        { label: "Sauna", icon: <SaunaIcon /> },
        { label: "Library", icon: <LibraryIcon /> },
        { label: "Cinema", icon: <CinemaIcon /> },
        { label: "Wine Cellar", icon: <WineCellarIcon /> },
        { label: "Steam Room", icon: <SteamRoomIcon /> },
        { label: "Indoor Pool", icon: <IndoorPoolIcon /> },
      ],
    },
    {
      group: "Lot features",
      items: [
        { label: "Privacy", icon: <PrivacyIcon /> },
        { label: "Waterfront", icon: <WaterfrontIcon /> },
        { label: "Renovated", icon: <RenovatedIcon /> },
        { label: "Modern", icon: <ModernIcon /> },
        { label: "Gated Community", icon: <GatedIcon /> },
        { label: "Investment Property", icon: <InvestmentIcon /> },
        { label: "Coastal", icon: <CoastalIcon /> },
        { label: "Lakefront", icon: <LakefrontIcon /> },
        { label: "Equestrian", icon: <EquestrianIcon /> },
        { label: "City View", icon: <CityViewIcon /> },
        { label: "Duplex", icon: <DuplexIcon /> },
        { label: "Oceanfront", icon: <OceanfrontIcon /> },
        { label: "Beachfront", icon: <BeachfrontIcon /> },
        { label: "Riverfront", icon: <RiverfrontIcon /> },
        { label: "Hilltop", icon: <HilltopIcon /> },
        { label: "Ski-In / Ski-Out", icon: <SkiIcon /> },
        { label: "Mansion", icon: <MansionIcon /> },
        { label: "High Altitude", icon: <AltitudeIcon /> },
        { label: "Seafront", icon: <SeafrontIcon /> },
      ],
    },
  ];

  const filters = [
    {
      label: "Price Range",
      key: "priceRange",
      options: ["Any Price", "$1M - $5M", "$5M - $10M", "$10M+"],
    },
    { label: "Type", key: "type", options: [] }, // handled separately
    { label: "Bedrooms", key: "bedrooms", options: ["Any", "3+", "4+", "5+"] },
    {
      label: "Size & Land",
      key: "sizeLand",
      options: ["Any SqFt", "5000+ sqft", "10,000+ sqft"],
    },
    {
      label: "Bathrooms",
      key: "bathrooms",
      options: ["Any", "2+", "3+", "4+"],
    },
    {
      label: "Architecture",
      key: "architecture",
      options: ["Any", "Modern", "Classic", "Mediterranean", "Colonial"],
    },
    { label: "Amenities", key: "amenities", options: [] }, // handled separately
    {
      label: "Sort",
      key: "sort",
      options: ["Newest", "Oldest", "Low to High", "High to Low"],
    },
  ];

  const toggleFilter = (label) => {
    setActiveFilter(activeFilter === label ? null : label);
    if (label !== "Type") setExpandedTypeGroup(null);
  };

  const handleSelect = (key, value) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    setActiveFilter(null);
  };

  const handleTypeSelect = (value) => {
    setSelectedFilters((prev) => ({ ...prev, type: value }));
    setActiveFilter(null);
    setExpandedTypeGroup(null);
  };

  const toggleAmenity = (label) => {
    setSelectedAmenities((prev) => {
      const next = prev.includes(label)
        ? prev.filter((a) => a !== label)
        : [...prev, label];
      return next;
    });
  };

  const clearAmenities = () => setSelectedAmenities([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
    if (name === "location") setShowSuggestions(true);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (onFilter) {
      onFilter({ ...selectedFilters, amenities: selectedAmenities.join(",") });
    }
    setShowSuggestions(false);
  };

  const isFilterActive = (filter) => {
    if (filter.key === "amenities") return selectedAmenities.length > 0;
    const v = selectedFilters[filter.key];
    return v && v !== "Any" && v !== "Any Price" && v !== "Any SqFt";
  };

  const getFilterLabel = (filter) => {
    if (filter.key === "amenities") {
      if (selectedAmenities.length === 0) return "Amenities";
      if (selectedAmenities.length === 1) return selectedAmenities[0];
      return `Amenities (${selectedAmenities.length})`;
    }
    const v = selectedFilters[filter.key];
    if (!v || v === "Any" || v === "Any Price" || v === "Any SqFt")
      return filter.label;
    return v;
  };

  return (
    <div className="w-full py-6 px-4 bg-white flex flex-col items-center relative z-20">
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-center justify-center gap-4 w-full"
      >
        {/* Location */}
        {!hideLocation && (
          <div className="relative min-w-[240px]" ref={locationRef}>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={selectedFilters.location}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-6 py-2.5 border border-gray-300 rounded-lg text-sm md:text-base font-medium focus:outline-none focus:border-black transition-all montserrat"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-[110] w-full bg-white border border-gray-100 rounded-xl mt-2 shadow-2xl left-0 p-2 overflow-hidden">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600 text-sm font-medium transition-colors"
                    onClick={() => {
                      setSelectedFilters((prev) => ({ ...prev, location: s }));
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {filters.map((filter, index) => (
          <div key={index} className="relative">
            <button
              type="button"
              onClick={() => toggleFilter(filter.label)}
              className={`
                px-6 py-2.5
                border rounded-lg
                text-sm montserrat md:text-base font-medium
                transition-all duration-300
                whitespace-nowrap
                ${
                  isFilterActive(filter) || activeFilter === filter.label
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-black border-gray-300 hover:border-black"
                }
              `}
            >
              {getFilterLabel(filter)}
            </button>

            {/* ── TYPE DROPDOWN ── */}
            {filter.label === "Type" && activeFilter === "Type" && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => {
                    setActiveFilter(null);
                    setExpandedTypeGroup(null);
                  }}
                />
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {/* Any option */}
                  <div
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors ${selectedFilters.type === "Any" ? "bg-[#9C824A]/10 text-[#9C824A] font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-black"}`}
                    onClick={() => handleTypeSelect("Any")}
                  >
                    Any
                  </div>
                  {typeGroups.map((group) => (
                    <div key={group.key}>
                      <div
                        className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-colors ${selectedFilters.type === group.key || selectedFilters.type.startsWith(group.key + ":") ? "bg-[#9C824A]/10 text-[#9C824A] font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-black"}`}
                        onClick={() => {
                          if (group.subcategories.length > 0) {
                            setExpandedTypeGroup(
                              expandedTypeGroup === group.key
                                ? null
                                : group.key,
                            );
                          } else {
                            handleTypeSelect(group.label);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${selectedFilters.type === group.key ? "border-[#9C824A] bg-[#9C824A]" : "border-gray-300"}`}
                          >
                            {selectedFilters.type === group.key && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                viewBox="0 0 10 10"
                              >
                                <path
                                  d="M1.5 5l2.5 2.5 4.5-4.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          {group.label}
                        </div>
                        {group.subcategories.length > 0 && (
                          <svg
                            className={`w-4 h-4 transition-transform ${expandedTypeGroup === group.key ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Subcategories */}
                      {group.subcategories.length > 0 &&
                        expandedTypeGroup === group.key && (
                          <div className="bg-gray-50 border-t border-gray-100">
                            {group.subcategories.map((sub) => {
                              const subVal = `${group.key}:${sub}`;
                              const isSelected =
                                selectedFilters.type === subVal;
                              return (
                                <div
                                  key={sub}
                                  className={`flex items-center gap-2 pl-8 pr-4 py-2.5 text-sm cursor-pointer transition-colors ${isSelected ? "text-[#9C824A] font-bold" : "text-gray-600 hover:text-black hover:bg-gray-100"}`}
                                  onClick={() => handleTypeSelect(subVal)}
                                >
                                  <span
                                    className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${isSelected ? "border-[#9C824A] bg-[#9C824A]" : "border-gray-300"}`}
                                  >
                                    {isSelected && (
                                      <svg
                                        className="w-2.5 h-2.5 text-white"
                                        fill="none"
                                        viewBox="0 0 10 10"
                                      >
                                        <path
                                          d="M1.5 5l2.5 2.5 4.5-4.5"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                  {sub}
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── AMENITIES DROPDOWN ── */}
            {filter.label === "Amenities" && activeFilter === "Amenities" && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setActiveFilter(null)}
                />
                <div className="absolute top-full right-0 mt-2 w-[520px] max-h-[480px] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Amenities
                    </span>
                    {selectedAmenities.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAmenities}
                        className="text-xs text-[#9C824A] font-semibold hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="px-5 py-4 space-y-5">
                    {amenityGroups.map((group) => (
                      <div key={group.group}>
                        <div className="text-sm font-semibold text-gray-900 mb-3">
                          {group.group}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => {
                            const active = selectedAmenities.includes(
                              item.label,
                            );
                            return (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => toggleAmenity(item.label)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black"}`}
                              >
                                <span className="w-4 h-4 flex-shrink-0">
                                  {item.icon}
                                </span>
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveFilter(null)}
                      className="px-6 py-2 bg-black text-white text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STANDARD DROPDOWNS ── */}
            {filter.label !== "Type" &&
              filter.label !== "Amenities" &&
              activeFilter === filter.label && (
                <>
                  <div
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setActiveFilter(null)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {filter.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-3 text-sm cursor-pointer transition-colors ${selectedFilters[filter.key] === option ? "bg-[#9C824A]/10 text-[#9C824A] font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-black"}`}
                        onClick={() => handleSelect(filter.key, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </>
              )}
          </div>
        ))}

        <button
          type="submit"
          className="px-10 py-3 bg-black hover:bg-gray-800 rounded-lg text-white montserrat text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap uppercase tracking-widest"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default PropertyFilterBar;

// ─────────────────────────────────────────────────────────────────────────────
// Icons for the Amenities
// ─────────────────────────────────────────────────────────────────────────────

const SvgIcon = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

// View icons
const PanoramicIcon = () => (
  <SvgIcon>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M2 10h20" />
    <circle cx="7" cy="14" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="17" cy="14" r="1" />
  </SvgIcon>
);
const MountainIcon = () => (
  <SvgIcon>
    <path d="M3 20l5-8 4 5 3-4 6 7H3z" />
  </SvgIcon>
);
const WaterViewIcon = () => (
  <SvgIcon>
    <path d="M2 16c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 20c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
  </SvgIcon>
);
const OceanViewIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="8" r="3" />
    <path d="M2 18c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 14h20" />
  </SvgIcon>
);
const SeaViewIcon = () => (
  <SvgIcon>
    <path d="M2 18c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M12 2v8" />
    <path d="M7 6l5-4 5 4" />
  </SvgIcon>
);
const LakeViewIcon = () => (
  <SvgIcon>
    <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <circle cx="12" cy="9" r="4" />
  </SvgIcon>
);
const RiverViewIcon = () => (
  <SvgIcon>
    <path d="M3 6c2 4 4 4 6 0s4-4 6 0 4 4 6 0" />
    <path d="M3 12c2 4 4 4 6 0s4-4 6 0 4 4 6 0" />
    <path d="M3 18c2 4 4 4 6 0s4-4 6 0 4 4 6 0" />
  </SvgIcon>
);
const GolfViewIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="17" r="2" />
    <path d="M12 15V5l5 3-5 3" />
  </SvgIcon>
);

// Outdoor icons
const GarageIcon = () => (
  <SvgIcon>
    <rect x="2" y="8" width="20" height="14" rx="1" />
    <path d="M2 8l10-6 10 6" />
    <path d="M7 22V14h10v8" />
  </SvgIcon>
);
const PoolIcon = () => (
  <SvgIcon>
    <path d="M2 14c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 18c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M8 6v6" />
    <path d="M16 6v6" />
    <path d="M8 6h8" />
  </SvgIcon>
);
const GardenIcon = () => (
  <SvgIcon>
    <path d="M12 22V10" />
    <path d="M5 10c0-4 7-8 7-8s7 4 7 8" />
    <path d="M5 16c0-3 7-6 7-6s7 3 7 6" />
  </SvgIcon>
);
const BalconyIcon = () => (
  <SvgIcon>
    <rect x="3" y="10" width="18" height="2" />
    <path d="M6 10V6" />
    <path d="M12 10V4" />
    <path d="M18 10V6" />
    <rect x="3" y="12" width="18" height="8" rx="1" />
  </SvgIcon>
);
const TerraceIcon = () => (
  <SvgIcon>
    <rect x="2" y="14" width="20" height="6" rx="1" />
    <path d="M4 14V8" />
    <path d="M20 14V8" />
    <path d="M4 8h16" />
  </SvgIcon>
);
const TennisIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="12" r="10" />
    <path d="M5 5c2 2 2 10 0 14" />
    <path d="M19 5c-2 2-2 10 0 14" />
  </SvgIcon>
);
const OutdoorKitchenIcon = () => (
  <SvgIcon>
    <rect x="2" y="12" width="20" height="8" rx="1" />
    <path d="M8 12V8" />
    <path d="M16 12V8" />
    <path d="M2 16h20" />
    <path d="M8 8c0-2 1-4 4-4s4 2 4 4" />
  </SvgIcon>
);
const BeachIcon = () => (
  <SvgIcon>
    <path d="M12 2v8" />
    <path d="M5 5l6 5" />
    <path d="M2 20c2-4 6-6 10-6s8 2 10 6" />
  </SvgIcon>
);
const VineyardIcon = () => (
  <SvgIcon>
    <circle cx="9" cy="8" r="3" />
    <circle cx="15" cy="8" r="3" />
    <circle cx="12" cy="14" r="3" />
    <path d="M12 17v5" />
    <path d="M9 22h6" />
  </SvgIcon>
);
const AirportIcon = () => (
  <SvgIcon>
    <path d="M21 16l-9-4L3 6l3 4-5 2 2 2 6-1 4 6 3-1-2-6 4 1z" />
  </SvgIcon>
);
const HelipadIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 8h2v8H8z" />
    <path d="M14 8h2v8h-2z" />
    <path d="M8 12h8" />
  </SvgIcon>
);

// Indoor icons
const FireplaceIcon = () => (
  <SvgIcon>
    <path d="M5 21V5l7-3 7 3v16" />
    <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
    <path d="M12 12c0-2-1-3-1-3s2 1 2 3" />
  </SvgIcon>
);
const BarIcon = () => (
  <SvgIcon>
    <path d="M8 22V16" />
    <path d="M16 22v-6" />
    <path d="M3 8l2-6h14l2 6" />
    <path d="M3 8c0 4 2 8 9 8s9-4 9-8H3z" />
  </SvgIcon>
);
const OfficeIcon = () => (
  <SvgIcon>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </SvgIcon>
);
const GymIcon = () => (
  <SvgIcon>
    <path d="M6 5v14" />
    <path d="M18 5v14" />
    <path d="M2 9h4" />
    <path d="M2 15h4" />
    <path d="M18 9h4" />
    <path d="M18 15h4" />
    <path d="M6 12h12" />
  </SvgIcon>
);
const KitchenIcon = () => (
  <SvgIcon>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 10h20" />
    <path d="M6 4v6" />
    <path d="M12 4v6" />
  </SvgIcon>
);
const ACIcon = () => (
  <SvgIcon>
    <rect x="2" y="4" width="20" height="10" rx="2" />
    <path d="M6 14v6" />
    <path d="M12 14v6" />
    <path d="M18 14v6" />
    <path d="M6 7h12" />
  </SvgIcon>
);
const JacuzziIcon = () => (
  <SvgIcon>
    <rect x="2" y="10" width="20" height="10" rx="2" />
    <path d="M6 10V8a2 2 0 0 1 4 0v2" />
    <path d="M14 10V8a2 2 0 0 1 4 0v2" />
    <path d="M6 14h.01M10 16h.01M14 14h.01M18 16h.01" />
  </SvgIcon>
);
const ElevatorIcon = () => (
  <SvgIcon>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M9 8l3-3 3 3" />
    <path d="M9 16l3 3 3-3" />
  </SvgIcon>
);
const GameRoomIcon = () => (
  <SvgIcon>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M8 12h4" />
    <path d="M10 10v4" />
    <circle cx="16" cy="11" r="1" />
    <circle cx="16" cy="13" r="1" />
  </SvgIcon>
);
const SaunaIcon = () => (
  <SvgIcon>
    <path d="M12 2c-1 2-2 3-2 5a4 4 0 0 0 8 0c0-2-1-3-2-5" />
    <path d="M8 8c-1 2-2 3-2 5a4 4 0 0 0 4 4" />
    <path d="M3 19h18" />
    <path d="M5 22h14" />
  </SvgIcon>
);
const LibraryIcon = () => (
  <SvgIcon>
    <rect x="2" y="2" width="4" height="20" rx="1" />
    <rect x="8" y="6" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="18" rx="1" />
    <rect x="20" y="8" width="2" height="14" rx="1" />
  </SvgIcon>
);
const CinemaIcon = () => (
  <SvgIcon>
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <circle cx="12" cy="13" r="3" />
  </SvgIcon>
);
const WineCellarIcon = () => (
  <SvgIcon>
    <path d="M8 2h8l2 8a6 6 0 0 1-12 0L8 2z" />
    <path d="M12 16v6" />
    <path d="M8 22h8" />
  </SvgIcon>
);
const SteamRoomIcon = () => (
  <SvgIcon>
    <path d="M6 4c0 4 4 4 4 8" />
    <path d="M12 4c0 4 4 4 4 8" />
    <path d="M18 4c0 4 4 4 4 8" />
    <path d="M2 18h20" />
    <path d="M4 22h16" />
  </SvgIcon>
);
const IndoorPoolIcon = () => (
  <SvgIcon>
    <path d="M2 14c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 18c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M4 6h16v6H4z" />
  </SvgIcon>
);

// Lot feature icons
const PrivacyIcon = () => (
  <SvgIcon>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </SvgIcon>
);
const WaterfrontIcon = () => (
  <SvgIcon>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M3 20c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
  </SvgIcon>
);
const RenovatedIcon = () => (
  <SvgIcon>
    <path d="M3 12l4-4 4 4 4-4 4 4" />
    <path d="M3 18l4-4 4 4 4-4 4 4" />
    <path d="M3 6l4-4 4 4 4-4 4 4" />
  </SvgIcon>
);
const ModernIcon = () => (
  <SvgIcon>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 10h20" />
    <path d="M7 4v6" />
  </SvgIcon>
);
const GatedIcon = () => (
  <SvgIcon>
    <path d="M2 12h4v9H2z" />
    <path d="M18 12h4v9h-4z" />
    <path d="M6 12V8l6-4 6 4v4" />
    <path d="M10 21V15h4v6" />
  </SvgIcon>
);
const InvestmentIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </SvgIcon>
);
const CoastalIcon = () => (
  <SvgIcon>
    <path d="M2 20c2-4 6-6 10-6s8 2 10 6" />
    <path d="M12 14V4" />
    <path d="M6 6l6-2 6 2" />
  </SvgIcon>
);
const LakefrontIcon = () => (
  <SvgIcon>
    <path d="M2 16c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 20c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M8 4l4 8 4-8" />
  </SvgIcon>
);
const EquestrianIcon = () => (
  <SvgIcon>
    <path d="M4 16c0-4 4-8 8-8s8 4 8 8" />
    <path d="M4 16h16" />
    <path d="M8 16v4" />
    <path d="M16 16v4" />
    <circle cx="12" cy="6" r="2" />
  </SvgIcon>
);
const CityViewIcon = () => (
  <SvgIcon>
    <path d="M3 21h18" />
    <rect x="5" y="10" width="4" height="11" />
    <rect x="10" y="6" width="4" height="15" />
    <rect x="15" y="13" width="4" height="8" />
    <path d="M5 10V6l2-2 2 2v4" />
  </SvgIcon>
);
const DuplexIcon = () => (
  <SvgIcon>
    <path d="M3 12l9-8 9 8v9H3z" />
    <path d="M12 4v17" />
    <path d="M7 21v-5h4v5" />
    <path d="M13 21v-5h4v5" />
  </SvgIcon>
);
const OceanfrontIcon = () => (
  <SvgIcon>
    <path d="M2 18c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 14h20" />
    <path d="M6 6v6" />
    <path d="M18 6v6" />
    <path d="M6 6h12" />
  </SvgIcon>
);
const BeachfrontIcon = () => (
  <SvgIcon>
    <path d="M12 3v9" />
    <path d="M5 6l6 6" />
    <path d="M2 20c2-3 5-5 10-5s8 2 10 5" />
  </SvgIcon>
);
const RiverfrontIcon = () => (
  <SvgIcon>
    <path d="M3 8c2 4 4 4 6 0s4-4 6 0 4 4 6 0" />
    <path d="M3 14c2 4 4 4 6 0s4-4 6 0 4 4 6 0" />
    <path d="M3 20h18" />
  </SvgIcon>
);
const HilltopIcon = () => (
  <SvgIcon>
    <path d="M3 20l7-12 5 7 3-4 6 9H3z" />
    <path d="M10 8V4" />
    <rect x="8" y="2" width="4" height="2" />
  </SvgIcon>
);
const SkiIcon = () => (
  <SvgIcon>
    <path d="M5 3l14 14" />
    <path d="M3 12l5-5 4 4 5-5" />
    <circle cx="17" cy="5" r="2" />
  </SvgIcon>
);
const MansionIcon = () => (
  <SvgIcon>
    <path d="M3 21h18" />
    <path d="M3 10l9-7 9 7v11H3z" />
    <rect x="9" y="14" width="6" height="7" />
    <path d="M7 10v4" />
    <path d="M17 10v4" />
  </SvgIcon>
);
const AltitudeIcon = () => (
  <SvgIcon>
    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
  </SvgIcon>
);
const SeafrontIcon = () => (
  <SvgIcon>
    <path d="M2 16c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M2 20c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
    <path d="M5 12V4l7-2 7 2v8" />
  </SvgIcon>
);
