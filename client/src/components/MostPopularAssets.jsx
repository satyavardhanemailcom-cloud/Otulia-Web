import React from 'react'

const MostPopularAssets = () => {
    const assets = [
        {
            id: 1,
            title: 'LUXURY MANORS',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 2,
            title: 'PORSCHE 911 GT3',
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 3,
            title: 'KAWASAKI NINJA',
            image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 4,
            title: 'SUPER YACHT X',
            image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80',
        }
    ]

    return (
        <section className="w-full px-16 py-16 bg-white">
            <h2 className="text-4xl font-bodoni font-normal text-black mb-12">Most Popular Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {assets.map((asset) => (
                    <div key={asset.id} className="relative group overflow-hidden aspect-square cursor-pointer bg-gray-50">
                        <img src={asset.image} alt={asset.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                        {/* Overlay elements */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500"></div>

                        {/* Pagination Dots Overlay */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            {[1, 2, 3].map((dot) => (
                                <div key={dot} className={`w-1 h-1 rounded-full ${dot === 1 ? 'bg-white' : 'bg-white/50'}`}></div>
                            ))}
                        </div>

                        {/* Heart Button */}
                        <button className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2} className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <h3 className="text-white text-base font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 uppercase bg-black/20 backdrop-blur-sm px-4 py-2 rounded">
                                {asset.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default MostPopularAssets
