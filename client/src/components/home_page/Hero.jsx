import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRef = useRef(null);

  // Automatically import all images from the home_hero directory
  const imageModules = import.meta.glob(
    "../../assets/hero_banners/home_hero/*.{jpeg,jpg,png,webp,svg}",
    { eager: true },
  );

  const images = useMemo(() => {
    // Get entries, sort them numerically by filename, then map to the default export
    return Object.entries(imageModules)
      .sort(([pathA], [pathB]) => {
        const getNum = (path) => {
          const match = path.match(/\/(\d+)\./);
          return match ? parseInt(match[1], 10) : Infinity;
        };
        return getNum(pathA) - getNum(pathB);
      })
      .map(([_, mod]) => mod.default);
  }, [imageModules]);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/assets/suggestions?q=${encodeURIComponent(q)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setShowSuggestions(false);

    // Check if it's a Listing Reference ID (starts with #NJM or is a 7-10 digit code that might be one)
    if (
      trimmedQuery.startsWith("#NJM") ||
      /^NJM\d{7}$/.test(trimmedQuery) ||
      /^#\d{7}$/.test(trimmedQuery)
    ) {
      try {
        const idToSearch = trimmedQuery.startsWith("#")
          ? encodeURIComponent(trimmedQuery)
          : encodeURIComponent(`#${trimmedQuery}`);
        const response = await fetch(`/api/assets/search/id/${idToSearch}`);
        const data = await response.json();

        if (data.found && data.redirect) {
          navigate(data.redirect);
          setQuery("");
          setSuggestions([]);
          return;
        }
      } catch (error) {
        console.error("Search by ID failed", error);
      }
    }

    navigate(`/shop?q=${trimmedQuery}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        e.preventDefault();
        const selectedValue = suggestions[selectedIndex].value;
        setQuery(selectedValue);
        setShowSuggestions(false);
        navigate(`/shop?q=${encodeURIComponent(selectedValue)}`);
      } else {
        handleSearch(e);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="h-svh md:h-screen w-full relative bg-black z-[5]">
      {/* Background Images Slideshow */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full z-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIdx ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Luxury Asset ${index + 1}`}
            className="w-full h-full object-cover brightness-[0.7]"
            fetchpriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      ))}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-[1]" />

      <div className="absolute inset-0 flex flex-col justify-center px-[4%] md:px-[2%] z-[10]">
        <div className="max-w-6xl w-full">
          <p className="text-white/80 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 md:mb-6 montserrat font-medium">
            CURATED GLOBALLY · EST. 2026
          </p>

          <h1 className="text-white text-[clamp(1.5rem,5vw,2.5rem)] md:text-[clamp(2rem,4.5vw,3.5rem)] lg:text-5xl canela mb-6 md:mb-8 leading-tight font-light md:whitespace-nowrap">
            Otulia — Discover Exceptional Assets
          </h1>

          <p className="text-white/90 montserrat text-sm md:text-xl max-w-2xl mb-10 md:mb-16 leading-relaxed">
            We source and broker the world's most exceptional assets, from rare automobiles to prestigious estates, connecting discerning clients with opportunities beyond the ordinary.
          </p>

          {/* Underline Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-2xl group"
            ref={suggestionRef}
          >
            <div className="flex items-center border-b border-white/30 group-focus-within:border-white transition-colors duration-300 py-3 md:py-4">
              <FiSearch className="text-white/60 text-lg md:text-xl mr-3 md:mr-4 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onFocus={() =>
                  query && suggestions.length > 0 && setShowSuggestions(true)
                }
                onKeyDown={handleKeyDown}
                placeholder="Search by Asset ID, Location or Name"
                className="bg-transparent text-white placeholder:text-white/40 outline-none w-full text-base md:text-lg montserrat"
              />
              <button
                type="submit"
                className="text-white tracking-[0.2em] text-[10px] md:text-xs font-medium hover:text-white/70 transition-colors uppercase ml-4 flex-shrink-0"
              >
                SEARCH
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden z-[10] shadow-2xl">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setQuery(suggestion.value);
                      setShowSuggestions(false);
                      navigate(
                        `/shop?q=${encodeURIComponent(suggestion.value)}`,
                      );
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`px-6 py-4 cursor-pointer flex items-center justify-between transition-colors border-b border-white/5 last:border-0 ${
                      selectedIndex === index
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <FiSearch
                        className={`text-sm ${selectedIndex === index ? "text-white/70" : "text-white/30"}`}
                      />
                      <span className="text-sm md:text-base montserrat font-medium">
                        {suggestion.value}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-white/10 font-bold ${
                        selectedIndex === index
                          ? "text-white/60 border-white/20"
                          : "text-white/20"
                      }`}
                    >
                      {suggestion.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-[2]">
        <div className="flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-[1px] w-8 md:w-12 transition-all duration-300 ${i === currentIdx ? "bg-white" : "bg-white/20"}`}
            />
          ))}
        </div>
        <p className="text-white/60 text-[10px] tracking-[0.4em] uppercase font-medium montserrat">
          SCROLL
        </p>
      </div>
    </div>
  );
};

export default Hero;
