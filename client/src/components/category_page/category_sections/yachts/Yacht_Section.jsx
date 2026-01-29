import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Yacht_Hero from './Yacht_Hero';
import FilterBar from '../cars/FilterBar';
import AssetCard from '../../../AssetCard';
import SortDropdown from '../SortDropdown';

const Yacht_Section = () => {
    const [list, setlist] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({});
    const [filterBarKey, setFilterBarKey] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const featuredListRef = useRef(null);

    const brands = [
        { id: 1, name: 'Azimut', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Azimut_Yachts_logo.png/1200px-Azimut_Yachts_logo.png' },
        { id: 2, name: 'Sunseeker', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Sunseeker_Logo.svg/1200px-Sunseeker_Logo.svg.png' },
        { id: 3, name: 'Princess', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Princess_Yachts_logo.svg/1200px-Princess_Yachts_logo.svg.png' },
        { id: 4, name: 'Ferretti', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Ferretti_Group_logo.svg/1200px-Ferretti_Group_logo.svg.png' },
        { id: 5, name: 'Benetti', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Azimut_Benetti_Group_logo.svg/1200px-Azimut_Benetti_Group_logo.svg.png' },
    ];

    const datafetch = async (reset = false) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('limit', limit);
        searchParams.set('page', reset ? 1 : page);

        if (searchParams.has('price')) {
            searchParams.set('sort', searchParams.get('price'));
            searchParams.delete('price');
        }
        if (searchParams.has('country')) {
            searchParams.set('location', searchParams.get('country'));
            searchParams.delete('country');
        }
        if (searchParams.has('category')) {
            searchParams.set('type', searchParams.get('category'));
            searchParams.delete('category');
        }

        const url = `/api/assets/yachts?${searchParams.toString()}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            if (result.length < limit) {
                setHasMore(false);
            }
            if (reset || page === 1) {
                setlist(result);
            } else {
                setlist(prevList => [...prevList, ...result]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        datafetch();
    }, [page, limit]);

    useEffect(() => {
        setPage(1);
        datafetch(true);
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('location') || searchParams.has('acquisition')) {
            if (featuredListRef.current) {
                featuredListRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            setFilterBarKey(prevKey => prevKey + 1);
        }
    }, [location.search]);

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    }

    const handleFilter = (newFilters) => {
        const searchParams = new URLSearchParams();
        for (const key in newFilters) {
            if (newFilters[key]) {
                searchParams.set(key, newFilters[key]);
            }
        }
        navigate(`?${searchParams.toString()}`, { replace: true });
    }

    // Yacht Specific Options
    const yachtCategories = ['Motor Yacht', 'Sailing Yacht', 'Superyacht', 'Catamaran'];
    const yachtBrandsList = [...brands.map(b => b.name), 'Riva', 'Heesen', 'Wally'];
    const yachtModels = ['Grande 27 Metri', 'Predator 74', 'Oasis 40M', 'Flybridge'];
    const yachtCountries = ['Italy', 'UK', 'Netherlands', 'USA', 'France'];

    return (
        <div className=''>
            <Yacht_Hero />
            <div className='bg-white'>

                <section className="w-full px-3 md:px-16 py-16 bg-white">
                    <div className="flex flex-col items-center justify-center mb-10">
                        <h2 className="text-3xl md:text-5xl playfair-display text-black mb-14 text-center">
                            Elite Shipyards
                        </h2>

                        <div className='grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-20 w-full items-center justify-center max-w-7xl mx-auto'>
                            {brands.map((item) => (
                                <div key={item.id} className="w-full flex justify-center group transform transition-all duration-300 hover:scale-110">
                                    <img
                                        src={item.logo}
                                        alt={item.name}
                                        className='h-12 md:h-16 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer mix-blend-multiply'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="w-[92%] md:w-[70%] h-px bg-gray-200 border-0 justify-self-center"></div>

                <section className="w-full px-3 md:px-16 py-12 bg-white">
                    <FilterBar
                        onFilter={handleFilter}
                        categories={yachtCategories}
                        brands={yachtBrandsList}
                        models={yachtModels}
                        countries={yachtCountries}
                        key={filterBarKey}
                    />
                </section>

                <section ref={featuredListRef} className="w-full px-3 md:px-16 bg-white pb-32">
                    <h2 className="text-3xl md:text-4xl playfair-display text-black mb-8 flex justify-between items-center px-4">
                        <span className='font-light tracking-tight'>Featured Yacht Listings</span>
                        <SortDropdown />
                    </h2>

                    <div className="w-[92%] md:w-full h-px bg-gray-200 border-0 mb-12"></div>

                    <div className='w-full max-w-[1700px] mx-auto'>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {list.length > 0 ? (
                                list.map((item, idx) => (
                                    <div key={item._id} className="animate-fade-in">
                                        <AssetCard item={item} idx={idx} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-40 text-center">
                                    <p className="text-2xl text-gray-300 playfair-display italic font-light">No yachts found matching your criteria. Try adjusting your search!</p>
                                </div>
                            )}
                        </div>
                        {hasMore && list.length > 0 && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={loadMore}
                                    className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Yacht_Section
