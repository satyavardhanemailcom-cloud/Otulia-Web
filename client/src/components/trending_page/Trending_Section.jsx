import React from 'react'
import AssetCard from '../AssetCard'

const Trending_Section = ({type}) => {

    const brands = [
        {
            id:1,
            image:'https://w7.pngwing.com/pngs/995/480/png-transparent-bmw-car-logo-bmw-logo-trademark-logo-car-thumbnail.png'
        },
        {   
            id:2,
            image:'https://w7.pngwing.com/pngs/509/532/png-transparent-volkswagen-group-car-logo-volkswagen-car-logo-brand-emblem-trademark-volkswagen-thumbnail.png'
        },
        {
            id:3,
            image:'https://w7.pngwing.com/pngs/665/220/png-transparent-audi-logo-audi-a3-car-emblem-logo-audi-car-logo-brand-text-candle-automobile-repair-shop-thumbnail.png'
        },
        {
            id:4,
            image:'https://w7.pngwing.com/pngs/259/599/png-transparent-lamborghini-logo-lamborghini-sports-car-audi-logo-lamborghini-emblem-car-gold-thumbnail.png'
        },
        {
            id:5,
            image:'https://w7.pngwing.com/pngs/204/34/png-transparent-mitsubishi-motors-car-logo-mitsubishi-eclipse-cross-mitsubishi-angle-text-triangle-thumbnail.png'
        },
    ]

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
                <h2 className="text-5xl md:text-6xl playfair-display text-black">{type}</h2>    
            </div>

            <div className='flex flex-col items-center justify-center gap-8 mb-12 flex-wrap'>
             <h3 className='text-3xl md:text-4xl playfair-display text-black'>Popular {type} Brands</h3>
            <div className='flex gap-8 mb-12 flex-wrap'>
                {brands.map((item, idx) => ( 
        <img 
            key={idx} 
            src={item.image} 
            alt="logo" 
            className="w-16 h-16 object-contain hover:grayscale-0 transition-all"
        />
    ))}
            </div>
    
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
