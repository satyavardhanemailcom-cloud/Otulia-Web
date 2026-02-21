import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AssetCard from '../components/AssetCard'
import SharedFilterBar from '../components/SharedFilterBar'
import FilterBar from '../components/category_page/category_sections/cars/FilterBar';
import PropertyFilterBar from '../components/category_page/category_sections/estates/PropertyFilterBar';
import carFilterOptions from '../json/car_filter_options.json';
import bikeFilterOptions from '../json/bike_filter_options.json';
import yachtFilterOptions from '../json/yacht_filter_options.json';

const Rent = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });

  const categories = [
    { name: 'All', endpoint: 'combined' },
    { name: 'Cars', endpoint: 'vehicles' },
    { name: 'Real Estate', endpoint: 'estates' },
    { name: 'Bikes', endpoint: 'bikes' },
    { name: 'Yachts', endpoint: 'yachts' },
  ];

  useEffect(() => {
    fetchListings();
  }, [activeCategory, filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const category = categories.find(c => c.name === activeCategory);
      const endpoint = category ? category.endpoint : 'combined';

      const params = new URLSearchParams();
      params.append('acquisition', 'rent');
      
      // Handle keyword search from filter bar
      if (filters.q) {
        if (endpoint === 'combined') params.append('q', filters.q);
        else params.append('search', filters.q);
      }

      // Map filters correctly from different FilterBars
      const location = filters.location;
      let minPrice = filters.minPrice;
      let maxPrice = filters.maxPrice;

      if (filters.priceRange && filters.priceRange.includes('–')) {
        const parts = filters.priceRange.split(' – ');
        minPrice = parts[0].replace(/[^0-9]/g, '');
        maxPrice = parts[1].replace(/[^0-9]/g, '');
      } else if (filters.priceRange && filters.priceRange.includes('+')) {
        minPrice = filters.priceRange.replace(/[^0-9]/g, '');
      }

      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      // Additional filters
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.model) params.append('model', filters.model);
      if (filters.category && filters.category !== 'Any') params.append('category', filters.category);
      if (filters.type && filters.type !== 'Any') params.append('propertyType', filters.type);
      if (filters.bedrooms && filters.bedrooms !== 'Any') params.append('bedrooms', filters.bedrooms.replace('+', ''));
      if (filters.bathrooms && filters.bathrooms !== 'Any') params.append('bathrooms', filters.bathrooms.replace('+', ''));
      if (filters.sort) params.append('sort', filters.sort);

      const response = await fetch(`/api/assets/${endpoint}?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch rental listings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filterData) => {
    setFilters(filterData);
  };

  return (
    <div className='relative w-full overflow-x-hidden pt-24 min-h-screen bg-white'>
      <Navbar hideSearch={true} />
      {/* Simple Hero */}
      <div className="bg-black text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-playfair mb-4 font-serif">Rent Exclusive Assets</h1>
        <p className="text-gray-300 max-w-2xl mx-auto font-sans">Experience luxury without ownership. Choose from our premium collection of cars, estates, yachts, and bikes.</p>
      </div>

      {/* Filter Bar */}
      <div className="mt-[-40px] relative z-10">
        {activeCategory === 'Real Estate' ? (
          <PropertyFilterBar onFilter={handleSearch} initialLocation={filters.location} />
        ) : activeCategory === 'Cars' ? (
          <FilterBar onFilter={handleSearch} filterOptions={carFilterOptions} priceRanges={['$1K – $2K', '$2K – $5K', '$5K – $10K', '$10K+']} initialLocation={filters.location} />
        ) : activeCategory === 'Bikes' ? (
          <FilterBar onFilter={handleSearch} filterOptions={bikeFilterOptions} priceRanges={['$100 – $500', '$500 – $1K', '$1K – $2K', '$2K+']} initialLocation={filters.location} />
        ) : activeCategory === 'Yachts' ? (
          <FilterBar onFilter={handleSearch} filterOptions={yachtFilterOptions} priceRanges={['$5K – $10K', '$10K – $25K', '$25K – $50K', '$50K+']} initialLocation={filters.location} />
        ) : (
          <SharedFilterBar onSearch={handleSearch} initialLocation={filters.location} />
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-4 py-8 overflow-x-auto px-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
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
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 pb-16">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading rentals...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No rental listings found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map((item, idx) => (
              <AssetCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rent
