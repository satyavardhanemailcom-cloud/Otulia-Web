import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Yacht_Hero from './Yacht_Hero';
import FilterBar from '../cars/FilterBar';
import AssetCard from '../../../AssetCard';
import SortDropdown from '../SortDropdown';
import yachtFilterOptions from '../../../../json/yacht_filter_options.json';
import Pagination from '../../../Pagination';

// Import Logos
import azimutLogo from '../../../../assets/yacht_brands/Azimut_Yachts.webp';
import sunseekerLogo from '../../../../assets/yacht_brands/Sunseeker.webp';
import princessLogo from '../../../../assets/yacht_brands/Princess-Yachts.webp';
import ferrettiLogo from '../../../../assets/yacht_brands/Ferretti_Yachts.webp';
import benettiLogo from '../../../../assets/yacht_brands/Benetti.webp';
import heesenLogo from '../../../../assets/yacht_brands/Heesen.webp';
import wallyLogo from '../../../../assets/yacht_brands/Wally.webp';
import rivaLogo from '../../../../assets/yacht_brands/Riva.webp';
import customLineLogo from '../../../../assets/yacht_brands/Custom_Line.webp';
import pershingLogo from '../../../../assets/yacht_brands/Pershing.webp';

const Yacht_Section = () => {
    const [list, setlist] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [currentSort, setCurrentSort] = useState('Newest');
    const [filterBarKey, setFilterBarKey] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const featuredListRef = useRef(null);

    const handleBrandClick = (brandName) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('brand', brandName);
        navigate(`?${searchParams.toString()}`, { replace: true });

        if (featuredListRef.current) {
            featuredListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const brands = [
        { id: 1, name: 'Azimut', logo: azimutLogo },
        { id: 2, name: 'Sunseeker', logo: sunseekerLogo },
        { id: 3, name: 'Princess', logo: princessLogo },
        { id: 4, name: 'Ferretti', logo: ferrettiLogo },
        { id: 5, name: 'Benetti', logo: benettiLogo },
        { id: 6, name: 'Heesen', logo: heesenLogo },
        { id: 7, name: 'Wally', logo: wallyLogo },
        { id: 8, name: 'Riva', logo: rivaLogo },
        { id: 9, name: 'Custom Line', logo: customLineLogo },
        { id: 10, name: 'Pershing', logo: pershingLogo },
    ];

    const datafetch = async (pageNum) => {
        setLoading(true);
        
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('limit', 9);
        searchParams.set('page', pageNum);

        // Ensure sort is set from state if not in URL, or sync from URL
        if (!searchParams.has('sort')) {
            searchParams.set('sort', currentSort);
        } else {
            if (searchParams.get('sort') !== currentSort) {
                setCurrentSort(searchParams.get('sort'));
            }
        }

        if (searchParams.has('priceRange')) {
            const priceRange = searchParams.get('priceRange');
            if (priceRange) {
                if (priceRange.includes('+')) {
                    const min = parseInt(priceRange.replace(/\$|M|\+/g, '')) * 1000000;
                    searchParams.set('minPrice', min);
                } else {
                    const [minStr, maxStr] = priceRange.split(' – ');
                    const min = parseInt(minStr.replace(/\$|K|M/g, '')) * (minStr.includes('M') ? 1000000 : 1000);
                    const max = parseInt(maxStr.replace(/\$|K|M/g, '')) * (maxStr.includes('M') ? 1000000 : 1000);
                    searchParams.set('minPrice', min);
                    searchParams.set('maxPrice', max);
                }
            }
            searchParams.delete('priceRange');
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
            
            const data = result.data || result;
            const pagination = result.pagination || { totalPages: 1 };
            
            setlist(data);
            setTotalPages(pagination.totalPages);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        datafetch(page);
    }, [location.search, page]);

    useEffect(() => {
        setPage(1);
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('location') || searchParams.has('acquisition')) {
            if (featuredListRef.current) {
                featuredListRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            setFilterBarKey(prevKey => prevKey + 1);
        }
    }, [location.search]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (featuredListRef.current) {
            featuredListRef.current.scrollIntoView({ behavior: 'smooth' });
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
        searchParams.set('sort', newSort);
        navigate(`?${searchParams.toString()}`, { replace: true });
    };

    const priceRanges = [
        '$100K – $250K',
        '$250K – $500K',
        '$500K – $1M',
        '$1M – $2M',
        '$2M – $5M',
        '$5M+'
    ];

    return (
        <div className="">
            <Yacht_Hero />

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
                    <FilterBar onFilter={handleFilter} key={filterBarKey} priceRanges={priceRanges} filterOptions={yachtFilterOptions} hideLocation={true} />
                </section>

                <section ref={featuredListRef} className="w-full bg-[#f9f9f9] py-16 mt-4">
                  <div className="w-full px-4 md:px-16">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-normal canela text-black mb-2">
                                    Featured Yachts
                                </h2>
                                <p className="text-sm md:text-base text-gray-500 font-sans">
                                    Browse our premium selection of luxury yachts.
                                </p>
                            </div>
                                <SortDropdown onSortChange={handleSortChange} currentSort={currentSort} />
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
                                    <p className="text-2xl text-gray-300 canela italic font-light">No yachts found matching your criteria. Try adjusting your search!</p>
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
    )
}

export default Yacht_Section;
