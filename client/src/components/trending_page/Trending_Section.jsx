import React from 'react'
import AssetCard from '../AssetCard'

const Trending_Section = ({type}) => {
    const listings = [
        {
            id: 1,
            title: 'Palm Crest Villa',
            price: '₹ 18,750,000,000',
            location: 'Beverly Hills, Los Angeles, USA',
            details: '6 Beds | 8 Baths | 12,400 sqft',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 2,
            title: 'Azure Ridge Estate',
            price: '₹ 14,980,000,000',
            location: 'Bel Air, Los Angeles, USA',
            details: '10 Beds | 8 Baths | 10,100 sqft',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            title: 'Monte Verde Retreat',
            price: '₹ 9,450,000,000',
            location: 'Lake Como, Lombardy, Italy',
            details: '5 Beds | 8 Baths | 7,400 sqft',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 4,
            title: 'Timberlake Grand',
            price: '₹ 11,200,000,000',
            location: 'Aspen, Colorado, USA',
            details: '15 Beds | 8 Baths | 13,400 sqft',
            image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
        }
    ]

  return (
    <div>
      <section className="w-full px-3 md:px-16 py-6 bg-white">
           <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl md:text-4xl playfair-display text-black">{type}</h2>
                
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {listings.map((item, idx) => (
                    <div key={item.id}>
                        <AssetCard item={item} idx={idx}/>
                    </div>
                ))}
            </div>
        </section>
    </div>
  )
}

export default Trending_Section
