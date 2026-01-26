import React, { useEffect, useState } from 'react'
import Bike_Hero from './Bike_Hero'
import FilterBar from '../cars/FilterBar'
import AssetCard from '../../../AssetCard'
import SortDropdown from '../SortDropdown'

const Bike_Section = () => {
    const [list, setlist] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({});

    const brands = [
        { id: 1, name: 'Ducati', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Ducati_red_logo.PNG' },
        { id: 2, name: 'Kawasaki', logo: 'https://www.freepnglogos.com/uploads/kawasaki-png-logo/kawasaki-green-emblem-png-logo-1.png' },
        { id: 3, name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/BMW_logo_%28gray%29.svg/1200px-BMW_logo_%28gray%29.svg.png' },
        { id: 4, name: 'Yamaha', logo: 'https://www.freepnglogos.com/uploads/yamaha-png-logo/company-yamaha-png-logo-1.png' },
        { id: 5, name: 'Harley-Davidson', logo: 'https://www.freepnglogos.com/uploads/harley-davidson-png-logo/harley-davidson-logo-black-orange-and-white-png-10.png' },
    ];

    const datafetch = async () => {
        const params = new URLSearchParams({ limit, page });

        if (filters.category) params.append('type', filters.category); // Map category to type or brand if relevant, but backend has type
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.model) params.append('model', filters.model);
        if (filters.country) params.append('location', filters.country); // Map country to location
        if (filters.price) params.append('sort', filters.price);

        const url = `/api/assets/bikes?${params.toString()}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            if (result.length < limit) {
                setHasMore(false);
            }
            if (page === 1) {
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
    }, [page, limit, filters]);

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    }

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        setPage(1); // Reset to page 1 on filter change
    }

    // Bike Specific Options
    const bikeCategories = ['Sport', 'Cruiser', 'Touring', 'Standard', 'Off-Road'];
    const bikeBrandsList = brands.map(b => b.name);
    const bikeModels = ['Panigale', 'Ninja', 'S 1000 RR', 'R1', 'Fat Boy']; // Examples
    const bikeCountries = ['Italy', 'Japan', 'Germany', 'USA'];

    return (
        <div className=''>
            <Bike_Hero />
            <div className='bg-white'>

                <section className="w-full px-3 md:px-16 py-16 bg-white">
                    <div className="flex flex-col items-center justify-center mb-10">
                        <h2 className="text-3xl md:text-5xl playfair-display text-black mb-14 text-center">
                            Legendary Makers
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
                        categories={bikeCategories}
                        brands={bikeBrandsList}
                        models={bikeModels}
                        countries={bikeCountries}
                    />
                </section>

                <section className="w-full px-3 md:px-16 bg-white pb-32">
                    <h2 className="text-3xl md:text-4xl playfair-display text-black mb-8 flex justify-between items-center px-4">
                        <span className='font-light tracking-tight'>Featured Superbikes</span>
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
                                    <p className="text-2xl text-gray-300 playfair-display italic font-light">The engines are warming up. Check back shortly...</p>
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

export default Bike_Section
