import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Cars_Hero from './Cars_Hero';
import FilterBar from './FilterBar';
import AssetCard from '../../../AssetCard';
import SortDropdown from '../SortDropdown';
import randomShuffle from '../../../../modules/randomShuffle';
import Cars_Search from './Cars_Search';

const Cars_Section = () => {
  const [list, setlist] = useState([]);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({});
  const location = useLocation();
  const featuredListRef = useRef(null);

  // Fetch data
  const datafetch = async () => {
    const searchParams = new URLSearchParams(location.search);
    const locationParam = searchParams.get('location');
    const acquisitionParam = searchParams.get('acquisition');

    const params = new URLSearchParams({ limit });

    // Add filters to params
    if (filters.category) params.append('category', filters.category);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.model) params.append('model', filters.model);
    if (filters.country) params.append('country', filters.country);
    if (filters.price) params.append('sort', filters.price);

    // Add search filters to params
    if (locationParam) params.append('location', locationParam);
    if (acquisitionParam) params.append('acquisition', acquisitionParam);

    const url = `/api/assets/vehicles?${params.toString()}`;
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setlist(result);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    datafetch();
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('location') || searchParams.get('acquisition')) {
      featuredListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.search, limit, filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const brands = [
    {
      id: 1,
      name: 'Bugatti',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Bugatti_logo.svg',
    },
    {
      id: 2,
      name: 'Mercedes-Benz',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mercedes-Benz_Logo_2010.svg',
    },
    {
      id: 3,
      name: 'BMW',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg',
    },
    {
      id: 4,
      name: 'Aston Martin Wings',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Aston_Martin_wordmark.svg',
    },
    {
      id: 5,
      name: 'Audi',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg',
    },
  ];

  return (
    <div className="">
      <Cars_Hero />
    
      <div className="bg-white">
        <section className="w-full px-3 md:px-16 py-12 bg-white">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-3xl md:text-4xl playfair-display text-black mb-12 text-center">
              Popular Brands
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 w-full items-center justify-center">
              {brands.map((item) => (
                <div key={item.id} className="w-full flex justify-center group">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="h-16 md:h-20 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 justify-self-center"></div>

        <section className="w-full px-3 md:px-16 py-12 bg-white">
          <FilterBar onFilter={handleFilter} />
        </section>

        <section ref={featuredListRef} className="w-full px-3 md:px-16 bg-white">
          <h2 className="text-3xl md:text-4xl playfair-display text-black mb-7 text-center flex justify-between">
            <span>Featured List</span>
            <span>
              <SortDropdown />
            </span>
          </h2>

          <div className="w-[92%] md:w-[95%] h-px bg-gray-300 border-0 justify-self-center"></div>

          <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
              {list.length > 0 ? (
                list.map((item, idx) => (
                  <div key={item._id}>
                    <AssetCard item={item} idx={idx} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                  <p className="text-2xl text-gray-300 playfair-display italic font-light">No cars found matching your criteria. Try adjusting your search!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cars_Section;