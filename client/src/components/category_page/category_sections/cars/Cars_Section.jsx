import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cars_Hero from "./Cars_Hero";
import FilterBar from "./FilterBar";
import AssetCard from "../../../AssetCard";
import SortDropdown from "../SortDropdown";
import carFilterOptions from "../../../../json/car_filter_options.json";
import Cars_Search from "./Cars_Search";
import Pagination from "../../../Pagination";

// Import Logos
import astonMartinLogo from "../../../../assets/car_brands/Aston_Martin_Wings.webp";
import audiLogo from "../../../../assets/car_brands/Audi.webp";
import bmwLogo from "../../../../assets/car_brands/BMW.webp";
import bugattiLogo from "../../../../assets/car_brands/Bugatti.webp";
import ferrariLogo from "../../../../assets/car_brands/Ferrari.webp";
import koenigseggLogo from "../../../../assets/car_brands/Koenigsegg_Automotive_AB.webp";
import lexusLogo from "../../../../assets/car_brands/Lexus.webp";
import mercedesLogo from "../../../../assets/car_brands/Mercedes-Benz.webp";
import porscheLogo from "../../../../assets/car_brands/Porsche.webp";
import shelbyLogo from "../../../../assets/car_brands/Shelby_American.webp";

const Cars_Section = () => {
  const [list, setlist] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [currentSort, setCurrentSort] = useState("Newest");
  const [filterBarKey, setFilterBarKey] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const featuredListRef = useRef(null);

  // Fetch data
  const datafetch = async (pageNum) => {
    setLoading(true);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("limit", 9);
    searchParams.set("page", pageNum);

    // Ensure sort is set from state if not in URL, or sync from URL
    if (!searchParams.has("sort")) {
      searchParams.set("sort", currentSort);
    } else {
      if (searchParams.get("sort") !== currentSort) {
        setCurrentSort(searchParams.get("sort"));
      }
    }

    if (searchParams.has("priceRange")) {
      const priceRange = searchParams.get("priceRange");
      if (priceRange) {
        if (priceRange.includes("+")) {
          const min = parseInt(priceRange.replace(/\$|M|\+/g, "")) * 1000000;
          searchParams.set("minPrice", min);
        } else {
          const [minStr, maxStr] = priceRange.split(" – ");
          const min =
            parseInt(minStr.replace(/\$|K|M/g, "")) *
            (minStr.includes("M") ? 1000000 : 1000);
          const max =
            parseInt(maxStr.replace(/\$|K|M/g, "")) *
            (maxStr.includes("M") ? 1000000 : 1000);
          searchParams.set("minPrice", min);
          searchParams.set("maxPrice", max);
        }
      }
      searchParams.delete("priceRange");
    }

    if (searchParams.has("country")) {
      const country = searchParams.get("country");
      const existingLocation = searchParams.get("location") || "";
      searchParams.set("location", (existingLocation + " " + country).trim());
      searchParams.delete("country");
    }

    const url = `/api/assets/cars?${searchParams.toString()}`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();

      const data = result.data || result;
      const pagination = result.pagination || { totalPages: 1 };

      setlist(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    datafetch(page);
  }, [location.search, page]);

  useEffect(() => {
    setPage(1);
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("location") || searchParams.has("acquisition")) {
      if (featuredListRef.current) {
        featuredListRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setFilters({});
      setFilterBarKey((prevKey) => prevKey + 1);
    }
  }, [location.search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (featuredListRef.current) {
      featuredListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFilter = (newFilters) => {
    const searchParams = new URLSearchParams(location.search); // Preserve existing params (like sort)
    for (const key in newFilters) {
      if (newFilters[key]) {
        searchParams.set(key, newFilters[key]);
      } else {
        searchParams.delete(key);
      }
    }
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", newSort);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const handleBrandClick = (brandName) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("brand", brandName);
    navigate(`?${searchParams.toString()}`, { replace: true });

    if (featuredListRef.current) {
      featuredListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const brands = [
    {
      id: 1,
      name: "Bugatti",
      logo: bugattiLogo,
    },
    {
      id: 2,
      name: "Mercedes-Benz",
      logo: mercedesLogo,
    },
    {
      id: 3,
      name: "BMW",
      logo: bmwLogo,
    },
    {
      id: 4,
      name: "Aston Martin",
      logo: astonMartinLogo,
    },
    {
      id: 5,
      name: "Audi",
      logo: audiLogo,
    },
    {
      id: 6,
      name: "Porsche",
      logo: porscheLogo,
    },
    {
      id: 7,
      name: "Lexus",
      logo: lexusLogo,
    },
    {
      id: 8,
      name: "Koenigsegg",
      logo: koenigseggLogo,
    },
    {
      id: 9,
      name: "Ferrari",
      logo: ferrariLogo,
    },
    {
      id: 10,
      name: "Shelby",
      logo: shelbyLogo,
    },
  ];

  const priceRanges = [
    "$50K – $100K",
    "$100K – $200K",
    "$200K – $400K",
    "$400K – $750K",
    "$750K – $1.5M",
    "$1.5M – $3M",
    "$3M+",
  ];
  const yearOptions = [
    "2025+",
    "2023-2024",
    "2020-2022",
    "2015-2019",
    "2010-2014",
    "Before 2010",
  ];

  return (
    <div className="">
      <Cars_Hero />

      <div className="bg-white">
        <section className="w-full px-3 md:px-16 py-12 bg-white">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-3xl md:text-4xl canela text-black mb-12 text-center">
              Popular Brands
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 w-full items-center justify-center">
              {brands.map((item) => (
                <div key={item.id} className="w-full flex justify-center group">
                  <img
                    src={item.logo}
                    alt={item.name}
                    onClick={() => handleBrandClick(item.name)}
                    className="h-16 md:h-20 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 justify-self-center"></div>

        <section className="w-full px-3 md:px-16 py-12 bg-white">
          <FilterBar
            onFilter={handleFilter}
            key={filterBarKey}
            priceRanges={priceRanges}
            yearOptions={yearOptions}
            filterOptions={carFilterOptions}
            hideLocation={true}
          />
        </section>

        <section
          ref={featuredListRef}
          className="w-full bg-[#f9f9f9] py-16 mt-4"
        >
          <div className="w-full px-4 md:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-normal canela text-black mb-2">
                  Featured Cars
                </h2>
                <p className="text-sm md:text-base text-gray-500 font-sans">
                  Browse our exclusive collection of luxury vehicles.
                </p>
              </div>
                <SortDropdown
                  onSortChange={handleSortChange}
                  currentSort={currentSort}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.length > 0 ? (
                list.map((item, idx) => (
                  <div key={item._id}>
                    <AssetCard item={item} idx={idx} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                  <p className="text-2xl text-gray-300 canela italic font-light">
                    No cars found matching your criteria. Try adjusting your
                    search!
                  </p>
                </div>
              )}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cars_Section;
