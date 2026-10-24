import React, { useState, useRef, useEffect } from "react";

// Reusable Chevron Icon
const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: 11, height: 11, flexShrink: 0, opacity: 0.45 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

// Sliders / filter icon for the "Filters N" button
const FiltersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: 14, height: 14, flexShrink: 0 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  </svg>
);

// Search icon for the Search button
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.2}
    stroke="currentColor"
    style={{ width: 15, height: 15, flexShrink: 0 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
    />
  </svg>
);

// --- Pill Dropdown ---
const PillDropdown = ({ label, value, options, onChange, dark = false, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const hasValue = value && value !== "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const pillBase = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: dark ? "11px 14px" : "11px 14px",
    borderRadius: 9999,
    border: dark ? "none" : "1.5px solid #e8e8e8",
    background: dark ? "#111" : hasValue ? "#f7f7f7" : "#fff",
    color: dark ? "#fff" : "#1a1a1a",
    fontSize: 14,
    fontWeight: dark ? 600 : hasValue ? 600 : 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
    letterSpacing: "-0.01em",
    transition: "all 0.15s ease",
    userSelect: "none",
    height: 50,
    boxSizing: "border-box",
    flexShrink: 1,
    minWidth: 0,
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        flexShrink: 1,
        minWidth: 0,
      }}
      ref={ref}
    >
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-disabled={disabled}
        style={{ ...pillBase, opacity: disabled ? 0.72 : 1 }}
        onMouseEnter={(e) => {
          if (!dark && !disabled) e.currentTarget.style.background = "#f2f2f2";
        }}
        onMouseLeave={(e) => {
          if (!dark)
            e.currentTarget.style.background = hasValue ? "#f7f7f7" : "#fff";
        }}
      >
        {dark && <FiltersIcon />}
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {value || label}
        </span>
        {!dark && <ChevronDown />}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 9999,
            minWidth: 170,
            background: "#fff",
            border: "1.5px solid #ececec",
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(0,0,0,0.09)",
            overflow: "visible",
            animation: "fadeInDown 0.12s ease",
          }}
        >
          <div
            onClick={() => handleSelect("")}
            style={{
              padding: "11px 18px",
              fontSize: 13,
              color: "#aaa",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.1s",
              borderRadius: "16px 16px 0 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Any {label}
          </div>

          <div
            className="pill-dropdown-scroll"
            style={{
              maxHeight: 220,
              overflowY: "auto",
              borderRadius: "0 0 16px 16px",
            }}
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: "10px 18px",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: value === opt ? 600 : 400,
                  color: value === opt ? "#9C824A" : "#333",
                  background: value === opt ? "#fdf8f0" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (value !== opt)
                    e.currentTarget.style.background = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    value === opt ? "#fdf8f0" : "transparent";
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Count active filters for the badge
const countActiveFilters = (filters) =>
  Object.entries(filters).filter(
    ([k, v]) => k !== "location" && k !== "q" && v !== "",
  ).length;

const FilterBar = ({
  onFilter,
  initialLocation = "",
  filterOptions = {},
  priceRanges = null,
  yearOptions = [],
  hideLocation = false,
  initialFilters = {},
  disabledFilters = [],
  showVehicleSpecFilters = false,
}) => {
  const [filters, setFilters] = useState({
    location: initialLocation,
    q: "",
    category: "",
    brand: "",
    model: "",
    priceRange: "",
    year: "",
    fuelType: "",
    transmission: "",
    exteriorColor: "",
    sort: "",
    ...initialFilters,
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: initialLocation,
      category: "",
      brand: "",
      model: "",
      ...initialFilters,
    }));
  }, [initialLocation, JSON.stringify(initialFilters)]);

  const categories = filterOptions ? Object.keys(filterOptions) : [];
  const brands =
    filters.category && filterOptions[filters.category]
      ? Object.keys(filterOptions[filters.category])
      : Array.from(
          new Set(
            categories.flatMap((cat) => Object.keys(filterOptions[cat] || {})),
          ),
        );
  const models = filters.brand
    ? filters.category
      ? filterOptions[filters.category]?.[filters.brand] || []
      : Array.from(
          new Set(
            categories.flatMap(
              (cat) => filterOptions[cat]?.[filters.brand] || [],
            ),
          ),
        )
    : [];

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!hideLocation && !disabledFilters.includes("location") && filters.location && filters.location.length > 0) {
        try {
          const response = await fetch(
            `/api/assets/location-suggestions?q=${filters.location}`,
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
  }, [filters.location, hideLocation, disabledFilters]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (key === "category") {
        newFilters.brand = "";
        newFilters.model = "";
      } else if (key === "brand") {
        newFilters.model = "";
      }
      return newFilters;
    });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (onFilter) onFilter(filters);
    setShowSuggestions(false);
  };

  const activeCount = countActiveFilters(filters);

  return (
    <>
      {/* Inject font + keyframe + custom scrollbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pill-dropdown-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .pill-dropdown-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .pill-dropdown-scroll::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 999px;
        }
        .pill-dropdown-scroll::-webkit-scrollbar-thumb:hover {
          background: #c8c8c8;
        }
        .pill-dropdown-scroll {
          scrollbar-width: thin;
          scrollbar-color: #e0e0e0 transparent;
        }

        .search-btn:hover {
          background: #2a2a2a !important;
        }

        @media (max-width: 768px) {
          .listing-car-filter-shell {
            max-width: 100% !important;
            border-radius: 24px !important;
          }
          .listing-car-filter-form {
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            gap: 8px !important;
          }
          .listing-car-filter-form > * {
            max-width: 100%;
          }
        }
      `}</style>

      {/* Outer centering wrapper */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "16px 20px",
        }}
      >
        {/* Premium rounded outer container */}
        <div
          className="listing-car-filter-shell"
          style={{
            maxWidth: showVehicleSpecFilters ? 1300 : 900,
            width: "100%",
            background: "#ffffff",
            border: "1.5px solid #ebebeb",
            borderRadius: 9999,
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
            padding: "8px 10px",
            overflow: "visible",
            position: "relative",
            zIndex: 10,
          }}
        >
          <form
            className="listing-car-filter-form"
            onSubmit={handleSearch}
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 4,
            }}
          >
            <PillDropdown
              label={activeCount > 0 ? `Filters ${activeCount}` : "Filters"}
              value=""
              options={[]}
              onChange={() => {}}
              dark
            />

            {/* Location */}
            {!hideLocation && (
              <div
                style={{ position: "relative", display: "inline-block" }}
                ref={locationRef}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "11px 14px",
                    borderRadius: 9999,
                    border: "1.5px solid #e8e8e8",
                    background: filters.location ? "#f7f7f7" : "#fff",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: filters.location ? 600 : 500,
                    color: "#1a1a1a",
                    cursor: "text",
                    height: 50,
                    boxSizing: "border-box",
                    transition: "background 0.15s ease",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    disabled={disabledFilters.includes("location")}
                    onChange={(e) => {
                      handleFilterChange("location", e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => !disabledFilters.includes("location") && setShowSuggestions(true)}
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: filters.location ? 600 : 500,
                      color: "#1a1a1a",
                      width: filters.location
                        ? Math.max(60, filters.location.length * 8)
                        : 70,
                      maxWidth: 140,
                      cursor: disabledFilters.includes("location") ? "not-allowed" : "text",
                    }}
                  />
                  <ChevronDown />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <ul
                    style={{
                      position: "absolute",
                      zIndex: 9999,
                      top: "calc(100% + 8px)",
                      left: 0,
                      background: "#fff",
                      border: "1.5px solid #ececec",
                      borderRadius: 16,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.09)",
                      listStyle: "none",
                      margin: 0,
                      padding: "6px 0",
                      minWidth: 180,
                    }}
                  >
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          handleFilterChange("location", s);
                          setShowSuggestions(false);
                        }}
                        style={{
                          padding: "10px 18px",
                          fontSize: 13,
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#333",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fafafa")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <PillDropdown
              label="Category"
              value={filters.category}
              options={categories}
              onChange={(val) => handleFilterChange("category", val)}
              disabled={disabledFilters.includes("category")}
            />
            <PillDropdown
              label="Brand"
              value={filters.brand}
              options={brands}
              onChange={(val) => handleFilterChange("brand", val)}
              disabled={disabledFilters.includes("brand")}
            />
            <PillDropdown
              label="Model"
              value={filters.model}
              options={models}
              onChange={(val) => handleFilterChange("model", val)}
              disabled={disabledFilters.includes("model")}
            />
            <PillDropdown
              label="Year"
              value={filters.year}
              options={yearOptions || []}
              onChange={(val) => handleFilterChange("year", val)}
              disabled={disabledFilters.includes("year")}
            />
            <PillDropdown
              label="Price"
              value={filters.priceRange}
              options={priceRanges || []}
              onChange={(val) => handleFilterChange("priceRange", val)}
              disabled={disabledFilters.includes("priceRange")}
            />

            {showVehicleSpecFilters && (
              <>
                <PillDropdown
                  label="Fuel Type"
                  value={filters.fuelType}
                  options={["Petrol", "Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"]}
                  onChange={(val) => handleFilterChange("fuelType", val)}
                />
                <PillDropdown
                  label="Transmission"
                  value={filters.transmission}
                  options={["Automatic", "Manual", "Semi-Automatic", "CVT", "DCT"]}
                  onChange={(val) => handleFilterChange("transmission", val)}
                />
                <PillDropdown
                  label="Exterior Color"
                  value={filters.exteriorColor}
                  options={["Black", "White", "Silver", "Grey", "Blue", "Red", "Green", "Gold", "Brown", "Other"]}
                  onChange={(val) => handleFilterChange("exteriorColor", val)}
                />
              </>
            )}

            {/* Search button */}
            <button
              type="submit"
              className="search-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "0 20px",
                height: 50,
                borderRadius: 9999,
                border: "none",
                background: "#111",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "background 0.15s ease",
                flexShrink: 0,
              }}
            >
              <SearchIcon />
              Search
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FilterBar;
