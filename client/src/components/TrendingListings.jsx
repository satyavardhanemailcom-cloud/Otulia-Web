import React from 'react'

const TrendingListings = () => {
    const listings = [
        {
            id: 1,
            title: 'Palm Crest Villa',
            price: '₹ 18,750,000,000',
            location: 'Beverly Hills, Los Angeles, USA',
            details: '6 Beds | 8 Baths | 12,400 sqft',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            agent: { name: 'David Harbour', image: 'https://i.pravatar.cc/150?u=david' },
            agencyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Sotheby%27s_International_Realty_Logo.svg'
        },
        {
            id: 2,
            title: 'Azure Ridge Estate',
            price: '₹ 14,980,000,000',
            location: 'Bel Air, Los Angeles, USA',
            details: '10 Beds | 8 Baths | 10,100 sqft',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
            agent: { name: 'Mark Ellison', image: 'https://i.pravatar.cc/150?u=mark' },
            agencyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Christie%27s_International_Real_Estate_Logo.svg'
        },
        {
            id: 3,
            title: 'Monte Verde Retreat',
            price: '₹ 9,450,000,000',
            location: 'Lake Como, Lombardy, Italy',
            details: '5 Beds | 8 Baths | 7,400 sqft',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            agent: { name: 'Paul Benton', image: 'https://i.pravatar.cc/150?u=paul' },
            agencyLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Knight_Frank_logo.svg/1200px-Knight_Frank_logo.svg.png'
        },
        {
            id: 4,
            title: 'Timberlake Grand',
            price: '₹ 11,200,000,000',
            location: 'Aspen, Colorado, USA',
            details: '15 Beds | 8 Baths | 13,400 sqft',
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
            agent: { name: 'Robert Hale', image: 'https://i.pravatar.cc/150?u=robert' },
            agencyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Coldwell_Banker_logo.svg/2560px-Coldwell_Banker_logo.svg.png'
        }
    ]

    return (
        <section className="w-full px-16 py-16 bg-white">
            <h2 className="text-4xl font-bodoni font-normal text-black mb-12">Trending Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {listings.map((item, idx) => (
                    <div key={item.id} className="group border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                        {/* Image Section */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                            {/* Pagination Dots Overlay */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {[1, 2, 3].map((dot) => (
                                    <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
                                ))}
                            </div>

                            {/* Heart Button with specific colors */}
                            <button className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={idx === 0 || idx === 2 ? "#ef4444" : idx === 1 ? "#3b82f6" : "rgba(255,255,255,0.5)"} stroke={idx === 3 ? "white" : "none"} className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="p-5">
                            <h3 className="text-lg font-normal text-black mb-1 font-sans truncate">{item.title}</h3>
                            <p className="text-xl font-bold text-black mb-1 font-sans">{item.price}</p>
                            <p className="text-[10px] text-gray-400 mb-6 font-normal uppercase tracking-widest">{item.location}</p>

                            {/* Just Dealership/Agency Logos */}
                            <div className="flex items-center mb-6">
                                <img src={item.agencyLogo} alt="logo" className="h-5 object-contain opacity-90" />
                            </div>

                            <div className="w-full h-px bg-gray-100 mb-4"></div>

                            {/* Footer details */}
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.details}</p>
                                <div className="w-4 h-4 border border-gray-200 rounded-sm"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default TrendingListings
