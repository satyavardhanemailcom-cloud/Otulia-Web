import React, { useState, useRef, useEffect } from "react";

// Reusable Chevron Icon
const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: 12, height: 12, flexShrink: 0 }}
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

// --- Pill Dropdown ---
const PillDropdown = ({ label, value, options, onChange, dark = false }) => {
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
    padding: "7px 14px",
    borderRadius: 9999,
    border: dark ? "none" : "1.5px solid #e2e2e2",
    background: dark ? "#111" : hasValue ? "#f5f5f5" : "#fff",
    color: dark ? "#fff" : "#111",
    fontSize: 13,
    fontWeight: dark ? 600 : hasValue ? 600 : 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    whiteSpace: "nowrap",
    letterSpacing: "-0.01em",
    transition: "all 0.15s ease",
    userSelect: "none",
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={pillBase}
        onMouseEnter={(e) => {
          if (!dark) e.currentTarget.style.background = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          if (!dark)
            e.currentTarget.style.background = hasValue ? "#f5f5f5" : "#fff";
        }}
      >
        {dark && <FiltersIcon />}
        <span>{value || label}</span>
        {!dark && <ChevronDown />}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 50,
            minWidth: 160,
            background: "#fff",
            border: "1.5px solid #e8e8e8",
            borderRadius: 14,
            boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
            overflow: "visible",
            animation: "fadeInDown 0.12s ease",
          }}
        >
          <div
            onClick={() => handleSelect("")}
            style={{
              padding: "10px 16px",
              fontSize: 13,
              color: "#aaa",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.1s",
              borderRadius: "14px 14px 0 0",
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
              borderRadius: "0 0 14px 14px",
            }}
          >
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: "9px 16px",
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
}) => {
  const [filters, setFilters] = useState({
    location: initialLocation,
    q: "",
    category: "",
    brand: "",
    model: "",
    priceRange: "",
    year: "",
    sort: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, location: initialLocation }));
  }, [initialLocation]);

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
      if (!hideLocation && filters.location && filters.location.length > 0) {
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
  }, [filters.location, hideLocation]);

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

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
        /* Firefox */
        .pill-dropdown-scroll {
          scrollbar-width: thin;
          scrollbar-color: #e0e0e0 transparent;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "12px 16px",
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            width: "100%",
          }}
        >
          {/* Filters badge pill (dark) */}
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
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 9999,
                  border: "1.5px solid #e2e2e2",
                  background: filters.location ? "#f5f5f5" : "#fff",
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: filters.location ? 600 : 500,
                  color: "#111",
                  cursor: "text",
                }}
              >
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => {
                    handleFilterChange("location", e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: filters.location ? 600 : 500,
                    color: "#111",
                    width: filters.location
                      ? Math.max(60, filters.location.length * 8)
                      : 70,
                    maxWidth: 140,
                  }}
                />
                <ChevronDown />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    zIndex: 110,
                    top: "calc(100% + 8px)",
                    left: 0,
                    background: "#fff",
                    border: "1.5px solid #e8e8e8",
                    borderRadius: 14,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
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
                        padding: "9px 16px",
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
          />
          <PillDropdown
            label="Brand"
            value={filters.brand}
            options={brands}
            onChange={(val) => handleFilterChange("brand", val)}
          />
          <PillDropdown
            label="Model"
            value={filters.model}
            options={models}
            onChange={(val) => handleFilterChange("model", val)}
          />
          <PillDropdown
            label="Year"
            value={filters.year}
            options={yearOptions || []}
            onChange={(val) => handleFilterChange("year", val)}
          />
          <PillDropdown
            label="Price"
            value={filters.priceRange}
            options={priceRanges || []}
            onChange={(val) => handleFilterChange("priceRange", val)}
          />

          {/* Search pill */}
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "7px 20px",
              borderRadius: 9999,
              border: "none",
              background: "#111",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
          >
            Search
          </button>
        </form>
      </div>
    </>
  );
};

export default FilterBar;
