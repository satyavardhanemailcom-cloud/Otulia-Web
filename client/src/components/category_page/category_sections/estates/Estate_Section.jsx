import React, {useEffect, useState} from 'react'
import PropertyFilterBar from './PropertyFilterBar'
import AssetCard from '../../../AssetCard'
import SortDropdown from '../SortDropdown'
import Estate_Hero from './Estate_Hero'
import numberWithCommas from '../../../../modules/numberwithcomma'

const Estate_Section = () => {

    const [list, setlist] = useState([]);
    
        // Fetch data
      const datafetch = async ()=> {
        const url = "http://localhost:8000/api/assets/estate";
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
      }, []);

    const locations = [
        {
            id: 1,
            location: 'Costa del Sol, Spain',
            listings: numberWithCommas(23683),
            image: 'https://images.unsplash.com/photo-1553775556-80669b94bfa5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29zdGElMjBkZWwlMjBzb2x8ZW58MHx8MHx8fDA%3D'
        },
        {
            id: 2,
            location: 'French and Swiss Alps',
            listings: numberWithCommas(7764),
            image: 'https://images.unsplash.com/photo-1571274834067-3a24675547b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHN3aXNzJTIwYWxwc3xlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            id: 3,
            location: 'Los Angeles, CA, USA',
            listings: numberWithCommas(3618),
            image: 'https://images.unsplash.com/photo-1638059957884-2faffe7b6943?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bG9zJTIwYW5nZWxlcyUyMGNpdHl8ZW58MHx8MHx8fDA%3D'
        },
        {
            id: 4,
            location: 'French Riviera, France',
            listings: numberWithCommas(25332),
            image: 'https://plus.unsplash.com/premium_photo-1661963861529-02951a02a25f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlbmNoJTIwcml2aWVyYXxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            id: 5,
            location: 'Paris, France',
            listings: numberWithCommas(8288),
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFyaXN8ZW58MHx8MHx8fDA%3D'
        },
        {
            id: 6,
            location: 'Costa Blanca, Spain',
            listings: numberWithCommas(23683),
            image: 'https://images.unsplash.com/photo-1680537732160-01750bae5217?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29zdGElMjBibGFuY2F8ZW58MHx8MHx8fDA%3D'
        }
    ]

  return (
    <div className=''>
        <Estate_Hero />

        <div className='bg-white'>
            <section className="w-full px-3 md:px-16 py-12 bg-white">
            <div className="flex flex-col mb-10 gap-3">
                <h2 className="text-3xl md:text-4xl playfair-display text-black">
                    Popular Locations
                </h2>
                <p className='text-lg md:text-xl text-gray-500 playfair-display'>Explore the world's most prestigious real estate destinations. From the hills of Los Angeles to the towers of Dubai, find your
                next luxury investment.</p>
            </div>

            <section className="w-full px-4 md:px-16 py-3 bg-white">
      {/* GRID CONTAINER */}
      {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols (Matches your image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {locations.map((item) => (
          <div 
            key={item.id}
            className="
              group flex items-center 
              bg-white 
              border border-gray-200 
              rounded-sm 
              overflow-hidden 
              hover:shadow-lg transition-all duration-300 cursor-pointer
            "
          >
            {/* LEFT IMAGE */}
            <div className="w-32 h-28 shrink-0 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.location} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex flex-1 items-end justify-between px-4 py-2">
              <div className="flex flex-col gap-6 md:gap-9">
                {/* Title */}
                <h3 className="playfair-display text-lg text-black font-medium leading-tight">
                  {item.location}
                </h3>
                
                {/* Listings Count */}
                <span className="text-[10px] font-sans text-gray-400 font-bold uppercase tracking-widest">
                  {item.listings} LISTINGS
                </span>
              </div>

              {/* ARROW ICON (Pushed to the right) */}
              <div className="text-gray-400 group-hover:text-black transition-colors duration-300">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>

          </div>
        ))}

      </div>
    </section>    

        </section>

        <div className="w-[92%] md:w-[95%] h-px bg-gray-300 border-0 justify-self-center"></div>
        
         <section className="w-full px-3 md:px-16 py-12 bg-white">
            <h2 className="text-3xl md:text-4xl playfair-display text-black mb-7 text-center flex justify-between">
                    <span>Filter Properties</span>        
            </h2>
         <PropertyFilterBar />
         </section>

        <section className="w-full px-3 md:px-16 bg-white">
         <h2 className="text-3xl md:text-4xl playfair-display text-black mb-7 text-center flex justify-between">
                    <span>Featured List</span>
                    <span>
                        <SortDropdown />
                    </span>
                </h2>

            <div className="w-[92%] md:w-[95%] h-px bg-gray-300 border-0 justify-self-center"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
          {list.map((item, idx) => (
            <div key={item._id}>
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>

         </section>            
        

        </div>
        

    </div>
  )
}

export default Estate_Section