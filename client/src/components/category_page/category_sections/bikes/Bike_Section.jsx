import React, { useEffect, useState } from 'react'
import Bike_Hero from './Bike_Hero'
import FilterBar from '../cars/FilterBar'
import AssetCard from '../../../AssetCard'
import SortDropdown from '../SortDropdown'

const Bike_Section = () => {
    const [list, setlist] = useState([]);
    const [limit, setLimit] = useState(12);

    const brands = [
        { id: 1, name: 'Ducati', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ducati_red_logo.svg/1200px-Ducati_red_logo.svg.png' },
        { id: 2, name: 'Kawasaki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Kawasaki_logo.svg/1200px-Kawasaki_logo.svg.png' },
        { id: 3, name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/BMW_logo_%28gray%29.svg/1200px-BMW_logo_%28gray%29.svg.png' },
        { id: 4, name: 'Yamaha', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Yamaha_Motor_Logo.svg/1200px-Yamaha_Motor_Logo.svg.png' },
        { id: 5, name: 'Harley-Davidson', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Harley-Davidson_logo.svg/1200px-Harley-Davidson_logo.svg.png' },
    ];

    const datafetch = async () => {
        const url = `http://localhost:8000/api/assets/bike?limit=${limit}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            setlist(result)
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        datafetch()
    }, [limit]);

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
                    <FilterBar />
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
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Bike_Section
