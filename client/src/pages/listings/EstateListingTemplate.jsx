import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import SEO from '../../components/SEO';
import Pagination from '../../components/Pagination';
import EstateFilterBar from './EstateFilterBar';
import AssetCard from '../../components/AssetCard';
import { getPlaceholderListings } from './estatePlaceholders';

const PAGE_SIZE = 9;
const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'Oldest', label: 'Oldest' },
  { value: 'Low to High', label: 'Price lowest first' },
  { value: 'High to Low', label: 'Price highest first' },
];
const PROPERTY_TYPES = [
  { value: 'House', label: 'Houses' },
  { value: 'Villa', label: 'Villas' },
  { value: 'Apartment', label: 'Apartments' },
  { value: 'Penthouse', label: 'Penthouses' },
  { value: 'Townhouse', label: 'Townhouses' },
  { value: 'Land', label: 'Land' },
  { value: 'Chateau', label: 'Chateaux' },
  { value: 'Farm Ranch', label: 'Farm Ranches' },
];
const POPULAR_SEARCHES = ['Pool', 'Garden', 'Terrace', 'Sea View', 'Waterfront', 'Beachfront', 'Wine Cellar', 'Fitness Center / Gym', 'Tennis Court', 'Helipad'];

const EstateListingTemplate = ({ pageTitle, pageDescription, breadcrumb = [], filterParams = {} }) => {
  const isIsland = filterParams.type === 'island';
  const placeName = breadcrumb[breadcrumb.length - 1]?.label || '';

  const [filters, setFilters] = useState(isIsland ? { type: 'Private Island' } : {});
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const topRef = useRef(null);

  const updateFilters = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  useEffect(() => {
    const params = new URLSearchParams({ assetType: 'estate', page: String(page), limit: String(PAGE_SIZE) });
    if (filterParams.country) params.set('country', filterParams.country);
    if (filterParams.region) params.set('region', filterParams.region);
    if (isIsland) params.set('propertyType', 'island');
    else if (filters.type) params.set('propertyType', filters.type);
    if (filters.acquisition === 'rent') params.set('acquisition', 'rent');
    ['priceRange', 'bedrooms', 'bathrooms', 'architecture', 'amenities', 'sort'].forEach((key) => {
      if (filters[key]) params.set(key, filters[key]);
    });

    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch(`/api/assets/landing-listings?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load listings for this page.');
        return response.json();
      })
      .then((result) => {
        setListings(result.data || []);
        setTotal(result.pagination?.total || 0);
        setTotalPages(result.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch((fetchError) => {
        if (fetchError.name === 'AbortError') return;
        setError(fetchError.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [filterParams.country, filterParams.region, isIsland, filters, page]);

  // Show sample listings only when the page truly has nothing yet (no filters applied).
  const hasFilters = Object.entries(filters).some(([key, value]) => value && key !== 'sort' && !(isIsland && key === 'type'));
  const showPlaceholders = !loading && !error && listings.length === 0 && !hasFilters;
  const visibleListings = showPlaceholders ? getPlaceholderListings(placeName, isIsland) : listings;
  const count = showPlaceholders ? visibleListings.length : total;

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <SEO title={pageTitle} description={pageDescription} breadcrumbs={[{ label: 'Home', path: '/' }, ...breadcrumb]} />
      <Navbar />

      <main ref={topRef} className="scroll-mt-24 px-4 pb-16 pt-[calc(clamp(12px,2vh,24px)_+_clamp(50px,8vh,80px)_+_12px)] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <EstateFilterBar filters={filters} onChange={updateFilters} hideType={isIsland} />

          {/* Breadcrumb + title */}
          <nav aria-label="Breadcrumb" className="mt-5 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
            <Link to="/category/estates" className="hover:text-gray-900">Real Estate</Link>
            {breadcrumb.filter((crumb) => crumb.label !== 'Listings').map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                {crumb.path ? <Link to={crumb.path} className="hover:text-gray-900">{crumb.label}</Link> : <span>{crumb.label}</span>}
              </span>
            ))}
          </nav>
          <h1 className="canela mt-4 text-3xl font-normal text-gray-900 md:text-[40px]">{pageTitle}</h1>

          {/* Count + sort */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">{loading ? 'Loading…' : `${count.toLocaleString()} listings`}</p>
            <label className="flex items-center gap-1 text-sm text-gray-900">
              Sort:
              <select value={filters.sort || ''} onChange={(event) => updateFilters({ ...filters, sort: event.target.value })}
                className="cursor-pointer appearance-none bg-transparent font-medium outline-none field-sizing-content">
                {SORT_OPTIONS.map((option) => <option key={option.label} value={option.value}>{option.label}</option>)}
              </select>
              <FiChevronDown aria-hidden="true" />
            </label>
          </div>

          {/* Results */}
          {loading ? (
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="aspect-[4/3.4] animate-pulse bg-gray-100" />)}
            </div>
          ) : error ? (
            <p className="py-24 text-center text-red-600" role="alert">{error}</p>
          ) : visibleListings.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-gray-500">No homes match these filters.</p>
              <button type="button" onClick={() => updateFilters({ type: isIsland ? 'Private Island' : '' })} className="mt-3 text-sm font-medium underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleListings.map((item) => (
                  // Placeholders are display-only, so they can't be clicked through to an asset page.
                  <div key={item._id} className={item.isPlaceholder ? 'pointer-events-none' : ''}>
                    <AssetCard item={item} />
                  </div>
                ))}
              </div>

              {!showPlaceholders && (
                <>
                  <p className="mt-10 text-center text-sm text-gray-500">
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} homes for sale
                  </p>
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
              )}
            </>
          )}

          {/* Quick links below the grid */}
          <section className="mt-16 grid gap-10 border-t border-gray-200 pt-10 md:grid-cols-2">
            {!isIsland && (
              <div>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Property types</h2>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button key={type.value} type="button" onClick={() => { updateFilters({ ...filters, type: type.value }); handlePageChange(1); }}
                      className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-900">
                      {type.label}{placeName && ` in ${placeName}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Popular searches</h2>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((amenity) => (
                  <button key={amenity} type="button" onClick={() => { updateFilters({ ...filters, amenities: amenity }); handlePageChange(1); }}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-900">
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EstateListingTemplate;
