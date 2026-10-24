import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import SEO from '../../components/SEO';
import AssetCard from '../../components/AssetCard';
import Pagination from '../../components/Pagination';
import PropertyFilterBar from '../../components/category_page/category_sections/estates/PropertyFilterBar';
import carFilterOptions from '../../json/car_filter_options.json';
import ListingSearch from './ListingSearch';
import CarListingFilters from './CarListingFilters';

const PAGE_SIZE = 9;
const CAR_PRICE_RANGES = ['$50K – $100K', '$100K – $200K', '$200K – $400K', '$400K – $750K', '$750K – $1.5M', '$1.5M – $3M', '$3M+'];
const CAR_YEAR_OPTIONS = ['2025+', '2023-2024', '2020-2022', '2015-2019', '2010-2014', 'Before 2010'];

const displayValue = (value = '') => value
  .split('-')
  .map((part) => part ? part[0].toUpperCase() + part.slice(1) : part)
  .join(' ');

const ListingTemplate = ({ pageTitle, pageDescription, breadcrumb = [], filterParams = {} }) => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [listingSearch, setListingSearch] = useState({ location: '', acquisition: 'buy' });
  const resultsRef = useRef(null);
  const filterKey = JSON.stringify(filterParams);

  const query = useMemo(() => {
    const filters = JSON.parse(filterKey);
    const routeType = filters.type;
    const params = new URLSearchParams({
      assetType: routeType === 'car' ? 'car' : 'estate',
      page: String(page),
      limit: String(PAGE_SIZE),
    });
    if (listingSearch.location) params.set('location', listingSearch.location);
    if (listingSearch.acquisition === 'rent') params.set('acquisition', 'rent');

    if (routeType === 'car') {
      if (filters.brand) params.set('brand', filters.brand);
      if (filters.model || activeFilters.model) params.set('model', filters.model || activeFilters.model);
      if (activeFilters.category) params.set('category', activeFilters.category);
      if (activeFilters.q) params.set('search', activeFilters.q);
      if (activeFilters.year) params.set('year', activeFilters.year);
      if (activeFilters.priceRange) params.set('priceRange', activeFilters.priceRange);
      if (activeFilters.bodyType) params.set('bodyType', activeFilters.bodyType);
      if (activeFilters.transmission) params.set('transmission', activeFilters.transmission);
      if (activeFilters.fuelType) params.set('fuelType', activeFilters.fuelType);
      if (activeFilters.exteriorColor) params.set('exteriorColor', activeFilters.exteriorColor);
      if (activeFilters.sort) params.set('sort', activeFilters.sort);
    } else {
      if (filters.country) params.set('country', filters.country);
      if (filters.region) params.set('region', filters.region);
      if (routeType === 'island') params.set('propertyType', 'island');
      if (activeFilters.priceRange && activeFilters.priceRange !== 'Any Price') params.set('priceRange', activeFilters.priceRange);
      if (activeFilters.type && activeFilters.type !== 'Any') params.set('propertyType', activeFilters.type);
      if (activeFilters.bedrooms && activeFilters.bedrooms !== 'Any') params.set('bedrooms', activeFilters.bedrooms);
      if (activeFilters.bathrooms && activeFilters.bathrooms !== 'Any') params.set('bathrooms', activeFilters.bathrooms);
      if (activeFilters.architecture && activeFilters.architecture !== 'Any') params.set('architecture', activeFilters.architecture);
      if (activeFilters.amenities && activeFilters.amenities !== 'Any') params.set('amenities', activeFilters.amenities);
      if (activeFilters.sort && activeFilters.sort !== 'Newest') params.set('sort', activeFilters.sort);
    }

    return params.toString();
  }, [filterKey, page, JSON.stringify(activeFilters), JSON.stringify(listingSearch)]);

  useEffect(() => {
    setPage(1);
  }, [filterKey, JSON.stringify(activeFilters), JSON.stringify(listingSearch)]);

  const routeType = filterParams.type;
  const isCar = routeType === 'car';
  const carModels = [...new Set(Object.values(carFilterOptions)
    .flatMap((group) => Object.entries(group)
      .filter(([brand]) => !filterParams.brand || brand.toLowerCase() === filterParams.brand.toLowerCase())
      .flatMap(([, models]) => models)))];
  if (filterParams.model && !carModels.includes(displayValue(filterParams.model))) carModels.unshift(displayValue(filterParams.model));
  const fixedEstateLocation = displayValue(filterParams.country || filterParams.region || '');
  const initialPropertyFilters = routeType === 'island' ? { type: 'Private Island' } : {};
  useEffect(() => {
    const controller = new AbortController();
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/assets/landing-listings?${query}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load listings for this page.');
        const result = await response.json();
        setListings(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message || 'Could not load listings.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchListings();
    return () => controller.abort();
  }, [query]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      <SEO
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          ...breadcrumb,
        ]}
      />
      <Navbar />

      <main
        ref={resultsRef}
        className="w-full scroll-mt-4 bg-[#f9f9f9] px-4 pb-10 sm:px-6 md:px-9 md:pb-14"
        style={{ paddingTop: 'calc(clamp(12px, 2vh, 24px) + clamp(50px, 8vh, 80px) + 20px)' }}
      >
        <div className="mx-auto max-w-[1600px]">
          <header className="mb-7 md:mb-9">
            {isCar && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-4 flex justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
                <span>Cars</span><span aria-hidden="true">/</span><span>{filterParams.brand || filterParams.model || 'For sale'}</span>
              </nav>
            )}
            <h1 className="canela mb-2 text-center text-3xl font-normal text-black md:text-5xl">{pageTitle}</h1>
            <p className="mx-auto max-w-3xl text-center font-sans text-sm text-gray-500 md:text-base">{pageDescription}</p>
          </header>

          <ListingSearch onSearch={setListingSearch} />

          <div className="relative z-[100] mb-8">
            {isCar ? (
              <CarListingFilters
                filters={activeFilters}
                onChange={setActiveFilters}
                filterOptions={carFilterOptions}
                modelOptions={carModels}
                priceRanges={CAR_PRICE_RANGES}
                yearOptions={CAR_YEAR_OPTIONS}
                modelDisabled={Boolean(filterParams.model)}
              />
            ) : (
              <PropertyFilterBar
                onFilter={setActiveFilters}
                initialLocation={fixedEstateLocation}
                initialFilters={initialPropertyFilters}
                disabledFilters={[
                  ...(fixedEstateLocation ? ['location'] : []),
                  ...(routeType === 'island' ? ['type'] : []),
                ]}
              />
            )}
          </div>

          {loading ? (
            <div className="py-24 text-center text-gray-500" role="status">Loading listings…</div>
          ) : error ? (
            <div className="py-24 text-center text-red-600" role="alert">{error}</div>
          ) : listings.length ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => <AssetCard key={listing._id} item={listing} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <div className="py-24 text-center text-gray-500">No active listings found for this page yet.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListingTemplate;
