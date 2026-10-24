import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AssetCard from '../components/AssetCard'
import SharedFilterBar from '../components/SharedFilterBar'
import FilterBar from '../components/category_page/category_sections/cars/FilterBar';
import PropertyFilterBar from '../components/category_page/category_sections/estates/PropertyFilterBar';
import carFilterOptions from '../json/car_filter_options.json';
import bikeFilterOptions from '../json/bike_filter_options.json';
import yachtFilterOptions from '../json/yacht_filter_options.json';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import { useSnackbar } from '../contexts/SnackbarContext';

const Rent = () => {
  const { showSnackbar } = useSnackbar();
  const [activeCategory, setActiveCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });

  const categories = [
    { name: 'All', endpoint: 'combined' },
    { name: 'Cars', endpoint: 'cars' },
    { name: 'Real Estate', endpoint: 'estates' },
    { name: 'Bikes', endpoint: 'bikes' },
    { name: 'Yachts', endpoint: 'yachts' },
  ];

  useEffect(() => {
    if (activeCategory === 'Bikes' || activeCategory === 'Yachts') {
      showSnackbar("COMING SOON");
      setActiveCategory('All');
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchListings(page);
  }, [activeCategory, filters, page]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, filters]);

  const fetchListings = async (pageNum) => {
    setLoading(true);
    try {
      const category = categories.find(c => c.name === activeCategory);
      const endpoint = category ? category.endpoint : 'combined';

      const params = new URLSearchParams();
      params.append('acquisition', 'rent');
      params.append('page', pageNum);
      params.append('limit', 9);
      if (endpoint === 'combined') {
        params.append('excludeCategories', 'bikes,yachts');
      }
      
      // Basic common filters
      if (filters.location) params.append('location', filters.location);
      if (filters.sort) params.append('sort', filters.sort);
      
      // Handle keyword search (q or search)
      const searchQuery = filters.q || '';
      if (searchQuery) {
        if (endpoint === 'combined') params.append('q', searchQuery);
        else params.append('search', searchQuery);
      }

      // Handle Price (minPrice/maxPrice or priceRange)
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      if (filters.priceRange && filters.priceRange !== 'Any Price') {
        const range = filters.priceRange.replace(/\$/g, '').replace(/,/g, '');
        if (range.includes('–') || range.includes('-')) {
          const parts = range.split(/[–-]/);
          let min = parts[0].trim().toLowerCase();
          let max = parts[1].trim().toLowerCase();
          const multiplier = (val) => val.includes('m') ? 1000000 : (val.includes('k') ? 1000 : 1);
          const parseVal = (val) => parseFloat(val) * multiplier(val);
          params.append('minPrice', parseVal(min));
          params.append('maxPrice', parseVal(max));
        } else if (range.includes('+')) {
          let val = range.replace('+', '').trim().toLowerCase();
          const mult = val.includes('m') ? 1000000 : (val.includes('k') ? 1000 : 1);
          params.append('minPrice', parseFloat(val) * mult);
        }
      }

      // Category specific filters
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.model) params.append('model', filters.model);
      if (filters.category && filters.category !== 'Any') params.append('category', filters.category);
      if (activeCategory === 'Cars') {
        if (filters.fuelType) params.append('fuelType', filters.fuelType);
        if (filters.transmission) params.append('transmission', filters.transmission);
        if (filters.exteriorColor) params.append('exteriorColor', filters.exteriorColor);
      }
      
      // Estate specifics
      if (filters.type && filters.type !== 'Any') params.append('propertyType', filters.type);
      if (filters.bedrooms && filters.bedrooms !== 'Any') params.append('bedrooms', filters.bedrooms);
      if (filters.bathrooms && filters.bathrooms !== 'Any') params.append('bathrooms', filters.bathrooms);
      if (filters.architecture && filters.architecture !== 'Any') params.append('architecture', filters.architecture);
      if (filters.amenities && filters.amenities !== 'Any') params.append('amenities', filters.amenities);

      const response = await fetch(`/api/assets/${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      
      let data = result.data || result;
      const pagination = result.pagination || { totalPages: 1 };
      
      if (activeCategory === 'All') {
        data = data.filter(item => {
          const cat = (item.category || item.itemModel || '').toLowerCase();
          return !cat.includes('bike') && !cat.includes('yacht');
        });
      }

      setListings(data);
      setTotalPages(pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch rental listings", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (filterData) => {
    setFilters(filterData);
  };

  return (
    <div className='relative w-full overflow-x-hidden pt-24 min-h-screen bg-white'>
      <SEO 
        title={`Rent Luxury ${activeCategory !== 'All' ? activeCategory : 'Assets'}`}
        description={`Rent exclusive ${activeCategory.toLowerCase()} from our premium collection on Otulia.`}
      />
      <Navbar hideSearch={true} />
      {/* Simple Hero */}
      <div className="bg-black text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl canela mb-4 font-serif">Rent Exclusive Assets</h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-sans">Experience luxury without ownership. Choose from our premium collection of cars, estates, yachts, and bikes.</p>
      </div>

      {/* Filter Bar */}
      <div className="mt-[-40px] relative z-10">
        {activeCategory === 'Real Estate' ? (
          <PropertyFilterBar onFilter={handleSearch} initialLocation={filters.location} />
        ) : activeCategory === 'Cars' ? (
          <FilterBar onFilter={handleSearch} filterOptions={carFilterOptions} priceRanges={['$1K – $2K', '$2K – $5K', '$5K – $10K', '$10K+']} initialLocation={filters.location} showVehicleSpecFilters />
        ) : activeCategory === 'Bikes' ? (
          <FilterBar onFilter={handleSearch} filterOptions={bikeFilterOptions} priceRanges={['$100 – $500', '$500 – $1K', '$1K – $2K', '$2K+']} initialLocation={filters.location} />
        ) : activeCategory === 'Yachts' ? (
          <FilterBar onFilter={handleSearch} filterOptions={yachtFilterOptions} priceRanges={['$5K – $10K', '$10K – $25K', '$25K – $50K', '$50K+']} initialLocation={filters.location} />
        ) : (
          <SharedFilterBar onSearch={handleSearch} initialLocation={filters.location} />
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 py-4 overflow-x-auto px-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              if (cat.name === 'Bikes' || cat.name === 'Yachts') {
                showSnackbar("COMING SOON");
                return;
              }
              setActiveCategory(cat.name);
            }}
            className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap font-medium ${activeCategory === cat.name
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-200 hover:border-black'
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="w-full px-2 md:px-4 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading rentals...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No rental listings found in this category.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {listings.map((item, idx) => (
                <AssetCard key={item._id} item={item} />
              ))}
            </div>
            
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Rent
