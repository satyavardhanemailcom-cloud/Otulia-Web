import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropertyFilterBar from "./PropertyFilterBar";
import AssetCard from "../../../AssetCard";
import SortDropdown from "../SortDropdown";
import Estate_Hero from "./Estate_Hero";
import Estate_Developers from "./Estate_Developers";
import Pagination from "../../../Pagination";
import { dealerUrl } from "../../../../utils/dealerUrl";

const Estate_Section = () => {
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

    const priceRange = searchParams.get("priceRange");
    if (priceRange && !priceRange.startsWith("Any")) {
      if (priceRange === "$10M+") {
        searchParams.set("minPrice", "10000000");
      } else if (priceRange.includes("-")) {
        const [minStr, maxStr] = priceRange.split(" - ");
        const parseVal = (str) =>
          str.replace(/\$/g, "").replace(/M/g, "000000").trim();
        searchParams.set("minPrice", parseVal(minStr));
        searchParams.set("maxPrice", parseVal(maxStr));
      }
    }
    searchParams.delete("priceRange");

    const type = searchParams.get("type");
    if (type && !type.startsWith("Any")) {
      searchParams.set("propertyType", type);
    }
    searchParams.delete("type");

    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms && bedrooms.startsWith("Any")) {
      searchParams.delete("bedrooms");
    }

    const bathrooms = searchParams.get("bathrooms");
    if (bathrooms && bathrooms.startsWith("Any")) {
      searchParams.delete("bathrooms");
    }

    const architecture = searchParams.get("architecture");
    if (architecture && !architecture.startsWith("Any")) {
      searchParams.set("search", architecture);
    }
    searchParams.delete("architecture");

    const amenities = searchParams.get("amenities");
    if (amenities && !amenities.startsWith("Any")) {
      const existingSearch = searchParams.get("search") || "";
      searchParams.set("search", (existingSearch + " " + amenities).trim());
    }
    searchParams.delete("amenities");

    searchParams.delete("sizeLand"); // a filter that is not supported by backend

    const url = `/api/assets/estates?${searchParams.toString()}`;
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
    const searchParams = new URLSearchParams(location.search);
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

  const handleDeveloperClick = (developerName, developerEmail) => {
    navigate(dealerUrl(developerName, developerEmail));
  };



  return (
    <div className="">
      <Estate_Hero />

      <div className="bg-white">
        <Estate_Developers onDeveloperClick={handleDeveloperClick} />

        <div className="w-[92%] md:w-[95%] h-px bg-gray-200 border-0 justify-self-center my-2"></div>

        <section className="w-full px-3 md:px-6 py-12 bg-white">
          <div className="mb-7">
            <h2 className="text-3xl md:text-4xl canela text-black mb-1">
              Filter Properties
            </h2>
            <p className="text-sm md:text-base text-gray-500 font-sans">
              Find your ideal property with ease.
            </p>
          </div>
          <PropertyFilterBar
            onFilter={handleFilter}
            key={filterBarKey}
            hideLocation={true}
          />
        </section>

        <section
          ref={featuredListRef}
          className="w-full bg-[#f9f9f9] py-10 md:py-16 mt-4"
        >
          <div className="w-full px-2 md:px-9">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-normal canela text-black mb-2">
                  Featured Estates
                </h2>
                <p className="text-sm md:text-base text-gray-500 font-sans">
                  Browse our exclusive collection of luxury properties.
                </p>
              </div>
              <SortDropdown
                onSortChange={handleSortChange}
                currentSort={currentSort}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.length > 0 ? (
                list.map((item, idx) => (
                  <AssetCard key={item._id} item={item} idx={idx} />
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                  <p className="text-2xl text-gray-300 canela italic font-light">
                    No estates found matching your criteria. Try adjusting your
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

export default Estate_Section;
