import React from 'react'

const BrandCarousel = () => {
    const brands = [
        { name: 'Drivilux', style: 'font-bold tracking-tight text-2xl' },
        { name: 'AUTOPARTSE', style: 'font-extrabold tracking-tighter text-xl border-b-2 border-current' },
        { name: 'WHEELBU', style: 'font-black italic tracking-widest text-xl' },
        { name: 'MOTORKS', style: 'font-bold italic tracking-tighter text-2xl border-2 border-current px-2' },
        { name: 'Drivery', style: 'font-bold text-2xl flex items-center gap-2' }
    ]

    return (
        <section className="w-full px-16 py-6 bg-white">
            <h2 className="text-3xl playfair-display text-black mb-12">Trusted Brands We Carry</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 border border-gray-100">
                {brands.map((brand, idx) => (
                    <div key={idx} className="h-40 flex items-center justify-center p-8 border-r last:border-r-0 border-gray-100 text-gray-300 hover:text-black transition-all duration-500 cursor-pointer bg-white">
                        <div className={`${brand.style} select-none uppercase`}>
                            {brand.name === 'Drivery' ? (
                                <span className="flex items-center gap-2 lowercase capitalize">
                                    <span className="w-6 h-6 rounded-full border-4 border-current"></span>
                                    {brand.name}
                                </span>
                            ) : brand.name}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default BrandCarousel
