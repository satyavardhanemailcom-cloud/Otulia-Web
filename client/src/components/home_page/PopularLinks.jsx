import React from 'react'

const PopularLinks = () => {
    const linkGroups = [
        {
            title: 'Cities & Regions',
            links: ['Private islands for sale', 'Balearic islands homes for sale', 'Dubai apartments for sale', 'London property for sale', 'Marbella homes for sale']
        },
        {
            title: 'Countries',
            links: ['Homes for sale in Australia', 'Homes for sale in British Virgin Islands', 'Homes for sale in France', 'Homes for sale in Greece', 'Homes for sale in Italy']
        },
        {
            title: 'Cars',
            links: ['Ferrari for sale', 'Aston Martin for sale', 'Lamborghini for sale', 'Porsche for sale', 'Rolls-Royce for sale']
        },
        {
            title: 'Jets & Helicopters',
            links: ['Bombardier for sale', 'Cessna for sale', 'Gulfstream for sale', 'Eurocopter for sale', 'Bell for sale']
        },
        {
            title: 'Yachts',
            links: ['Ferretti for sale', 'Benetti for sale', 'Azimut for sale', 'Feadship for sale', 'Sunseeker for sale']
        },
        {
            title: 'Watches',
            links: ['IWC for sale', 'Patek Philippe for sale', 'Richard Mille for sale', 'Rolex for sale', 'Audemars Piguet for sale']
        }
    ]

    return (
        <section className="w-full px-16 py-6 bg-white border-t border-gray-100">
            <h2 className="text-3xl playfair-display text-black mb-12">Popular Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {linkGroups.map((group, idx) => (
                    <div key={idx} className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-black uppercase tracking-wider">{group.title}</h3>
                        <ul className="flex flex-col gap-2">
                            {group.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                    <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PopularLinks
