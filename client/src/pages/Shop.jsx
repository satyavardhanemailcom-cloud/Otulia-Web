import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AssetCard from '../components/AssetCard';
import SharedFilterBar from '../components/SharedFilterBar';
import FilterBar from '../components/category_page/category_sections/cars/FilterBar';
import PropertyFilterBar from '../components/category_page/category_sections/estates/PropertyFilterBar';
import carFilterOptions from '../json/car_filter_options.json';
import bikeFilterOptions from '../json/bike_filter_options.json';
import yachtFilterOptions from '../json/yacht_filter_options.json';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [listings, setListings] = useState([]);
  const [allSearchResults, setAllSearchResults] = useState([]); // Holds all results for a given search query
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '' });
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const categories = [
    { name: 'All', endpoint: 'combined', clientName: 'All' },
    { name: 'Cars', endpoint: 'cars', clientName: 'Car' },
    { name: 'Real Estate', endpoint: 'estates', clientName: 'Estate' },
    { name: 'Bikes', endpoint: 'bikes', clientName: 'Bike' },
    { name: 'Yachts', endpoint: 'yachts', clientName: 'Yacht' },
  ];

  // Helper function to determine category based on item properties
  const getCategoryFromItem = (item) => {
    if (item.category) {
      const cat = item.category.toLowerCase();
      if (['vehicles', 'car', 'carasset'].includes(cat)) return 'Car';
      if (['bikes', 'bike', 'bikeasset'].includes(cat)) return 'Bike';
      if (['yachts', 'yacht', 'yachtasset'].includes(cat)) return 'Yacht';
      if (['estates', 'estate', 'real estate', 'estateasset'].includes(cat)) return 'Estate';
    }
    if (item.itemModel) {
      const model = item.itemModel.toLowerCase();
      if (model.includes('car')) return 'Car';
      if (model.includes('estate')) return 'Estate';
      if (model.includes('bike')) return 'Bike';
      if (model.includes('yacht')) return 'Yacht';
    }
    // Fallback logic from AssetCard if needed, though category/itemModel should be primary
    if (item.keySpecifications) {
        const specs = item.keySpecifications;
        if (specs.power || specs.mileage || specs.topSpeed) return 'Car';
        if (specs.bedrooms || specs.bathrooms) return 'Estate';
    }
    return 'Unknown';
  };

  // EFFECT 1: Fetch data when in BROWSE mode (no query)
  useEffect(() => {
    if (!query) {
      const fetchBrowseListings = async () => {
        setLoading(true);
        try {
          const category = categories.find(c => c.name === activeCategory);
          const endpoint = category ? category.endpoint : 'combined';
          
          const params = new URLSearchParams();
          if (filters.location) params.append('location', filters.location);
          
          // Handle keyword search from filter bar
          if (filters.q) {
            if (endpoint === 'combined') params.append('q', filters.q);
            else params.append('search', filters.q);
          }

          // Handle Price from priceRange or direct min/max
          let finalMin = filters.minPrice;
          let finalMax = filters.maxPrice;

          if (filters.priceRange && filters.priceRange.includes('–')) {
            const parts = filters.priceRange.split(' – ');
            finalMin = parts[0].replace(/[^0-9]/g, '');
            finalMax = parts[1].replace(/[^0-9]/g, '');
          } else if (filters.priceRange && filters.priceRange.includes('+')) {
            finalMin = filters.priceRange.replace(/[^0-9]/g, '');
          }

          if (finalMin) params.append('minPrice', finalMin);
          if (finalMax) params.append('maxPrice', finalMax);

          // Category specific filters
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
          console.error("Failed to fetch browse listings", error);
          setListings([]); // Clear on error
        } finally {
          setLoading(false);
        }
      };
      fetchBrowseListings();
    }
  }, [activeCategory, filters, query]); // Reruns when these change ONLY if query is absent.

  // EFFECT 2: Fetch all results when in SEARCH mode (query exists)
  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        setLoading(true);
        try {
          const params = new URLSearchParams();
          params.append('q', query);
          if (filters.location) params.append('location', filters.location);
          if (filters.minPrice) params.append('minPrice', filters.minPrice);
          if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
          if (filters.q) params.append('keyword_filter', filters.q); // Additional filter if needed

          const response = await fetch(`/api/assets/combined?${params.toString()}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setAllSearchResults(data); // Store master list
        } catch (error) {
          console.error("Failed to fetch search results", error);
          setAllSearchResults([]); // Clear on error
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    } else {
      setAllSearchResults([]); // Clear master list if query is removed
    }
  }, [query, filters]); // Reruns ONLY when query or filters change.

  // EFFECT 3: Filter search results on the client-side when category or master list changes
  useEffect(() => {
    if (query) {
      if (activeCategory === 'All') {
        setListings(allSearchResults);
      } else {
        const targetCategory = categories.find(c => c.name === activeCategory)?.clientName;
        const filtered = allSearchResults.filter(item => getCategoryFromItem(item) === targetCategory);
        setListings(filtered);
      }
    }
    // No 'else' needed because BROWSE mode is handled by Effect 1
  }, [activeCategory, allSearchResults, query]);

  const handleSearch = (filterData) => {
    setFilters(filterData);
  };

  return (
    <div className='relative w-full overflow-x-hidden pt-24 min-h-screen bg-white'>
      <Navbar hideSearch={true} />
      {/* Simple Hero */}
      <div className="bg-white text-black py-16 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-playfair mb-4 font-serif">
          {query ? `Search Results for "${query}"` : 'Luxury Collection'}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-sans">
          {query ? `Showing results for your search query.` : 'Discover the world\'s most prestigious assets across all categories.'}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mt-[-40px] relative z-10">
        {activeCategory === 'Real Estate' ? (
          <PropertyFilterBar onFilter={handleSearch} initialLocation={filters.location} />
        ) : activeCategory === 'Cars' ? (
          <FilterBar onFilter={handleSearch} filterOptions={carFilterOptions} priceRanges={['$50K – $100K', '$100K – $200K', '$200K – $400K', '$400K – $750K', '$750K – $1.5M', '$1.5M – $3M', '$3M+']} initialLocation={filters.location} />
        ) : activeCategory === 'Bikes' ? (
          <FilterBar onFilter={handleSearch} filterOptions={bikeFilterOptions} priceRanges={['$15K – $30K', '$30K – $60K', '$60K – $120K', '$120K – $250K', '$250K+']} initialLocation={filters.location} />
        ) : activeCategory === 'Yachts' ? (
          <FilterBar onFilter={handleSearch} filterOptions={yachtFilterOptions} priceRanges={['$100K – $250K', '$250K – $500K', '$500K – $1M', '$1M – $2M', '$2M – $5M', '$5M+']} initialLocation={filters.location} />
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
              ? 'bg-black text-white border-black shadow-lg'
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
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-gray-500">Loading listings...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No assets found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((item, idx) => (
              <AssetCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop
