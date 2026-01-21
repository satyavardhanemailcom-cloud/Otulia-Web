import React from 'react'
import FilterBar from '../cars/FilterBar'
import AssetCard from '../../../AssetCard'
import SortDropdown from '../cars/SortDropdown'
import Estate_Hero from './Estate_Hero'

const Cars_Section = () => {

    const brands = [
        {
            id: 1,
            name: 'Bugatti',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Bugatti_logo.svg'
        },
        {
            id: 2,
            name: 'Mercedes-Benz',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mercedes-Benz_Logo_2010.svg'
        },
        {
            id: 3,
            name: 'BMW',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg'
        },
        {
            id: 4,
            name: 'Aston Martin Wings',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Aston_Martin_wordmark.svg'
        },
        {
            id: 5,
            name: 'Audi',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg'
        },
    ]

    const listings = [
    {
      id: 1,
      title: "Palm Crest Villa",
      price: "₹ 18,750,000,000",
      location: "Beverly Hills, Los Angeles, USA",
      details: "6 Beds | 8 Baths | 12,400 sqft",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Azure Ridge Estate",
      price: "₹ 14,980,000,000",
      location: "Bel Air, Los Angeles, USA",
      details: "10 Beds | 8 Baths | 10,100 sqft",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Monte Verde Retreat",
      price: "₹ 9,450,000,000",
      location: "Lake Como, Lombardy, Italy",
      details: "5 Beds | 8 Baths | 7,400 sqft",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Timberlake Grand",
      price: "₹ 11,200,000,000",
      location: "Aspen, Colorado, USA",
      details: "15 Beds | 8 Baths | 13,400 sqft",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Timberlake Grand",
      price: "₹ 11,200,000,000",
      location: "Aspen, Colorado, USA",
      details: "15 Beds | 8 Baths | 13,400 sqft",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Timberlake Grand",
      price: "₹ 11,200,000,000",
      location: "Aspen, Colorado, USA",
      details: "15 Beds | 8 Baths | 13,400 sqft",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 7,
      title: "Timberlake Grand",
      price: "₹ 11,200,000,000",
      location: "Aspen, Colorado, USA",
      details: "15 Beds | 8 Baths | 13,400 sqft",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 8,
      title: "Timberlake Grand",
      price: "₹ 11,200,000,000",
      location: "Aspen, Colorado, USA",
      details: "15 Beds | 8 Baths | 13,400 sqft",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    },
  ];


  return (
    <div className=''>
        <Estate_Hero />

        <div className='bg-white'>
            <section className="w-full px-3 md:px-16 py-12 bg-white">
            <div className="flex flex-col items-center justify-center mb-10">
                <h2 className="text-3xl md:text-4xl playfair-display text-black mb-12 text-center">
                    Popular Brands
                </h2>
                
                <div className='grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-16 w-full items-center justify-center'>
                    {brands.map((item) => (
                        <div key={item.id} className="w-full flex justify-center group">
                            <img 
                                src={item.logo} 
                                alt={item.name} 
                                
                                className='h-16 md:h-20 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer mix-blend-multiply' 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 justify-self-center"></div>
        
         <section className="w-full px-3 md:px-16 py-12 bg-white">
         <FilterBar />
         </section>

        <section className="w-full px-3 md:px-16 bg-white">
         <h2 className="text-3xl md:text-4xl playfair-display text-black mb-7 text-center flex justify-between">
                    <span>Featured List</span>
                    <span>
                        <SortDropdown />
                    </span>
                </h2>

            <div className="w-[92%] md:w-[95%] h-px bg-gray-300 border-0 justify-self-center"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-7">
          {listings.map((item, idx) => (
            <div key={item.id}>
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>

         </section>            
        

        </div>
        

    </div>
  )
}

export default Cars_Section