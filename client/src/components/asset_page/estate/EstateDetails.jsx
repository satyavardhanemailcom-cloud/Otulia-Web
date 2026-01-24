import React from 'react';
import numberWithCommas from '../../../modules/numberwithcomma';

const EstateDetails = ({ item }) => {
  // Destructure with fallbacks to prevent errors if item or its properties are missing
  const { 
    title = "Untitled Asset", 
    brand_logo = "", 
    location = "Unknown Location", 
    description = "No description available.", 
    price = 0, 
    agent = {} // Use an empty object as a fallback for agent
  } = item || {}; // Use an empty object as a fallback for item itself

  function convertMonthsToYears(totalMonths) {
    if (totalMonths < 12) {
      return `${totalMonths} months ago`
    }

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  return `${years} years ago`
}

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 bg-white font-sans">
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Details */}
        <div className="w-full lg:w-2/3">
          
          {/* Title & Brand Logo */}
          
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold playfair-display text-black">
              {title}
            </h1>
            {brand_logo && (
               <img src={brand_logo} alt="Brand" className="h-10 md:h-12 w-auto object-contain" />
            )}
          </div>

          {/* Location Tag */}
          <div className="inline-flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 mb-10 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef4444" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-sm font-medium montserrat">{location}</span>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold playfair-display text-black mb-4">
              About The Property :
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg montserrat">
              {description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Price & Agent Card */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Price Header (Right aligned on desktop) */}
          <div className="w-full text-left lg:text-right">
            <h2 className="text-3xl md:text-4xl font-bold playfair-display text-black">
              ₹ {numberWithCommas(price)}
            </h2>
          </div>

          {/* Agent Card Box */}
          <div className="border border-gray-200 rounded-sm shadow-sm p-6 bg-white">
            
            {/* Agent Header */}
            <div className="flex items-center gap-4 mb-6 montserrat">
              <img 
                src={agent.photo} 
                alt={agent.name} 
                className="w-14 h-14 rounded-full object-cover border border-gray-100"
              />
              <div>
                <h3 className="text-lg font-bold text-black">{agent.name}</h3>
                <p className="text-sm text-gray-400">{`Joined ${convertMonthsToYears(agent.joined)}`}</p>
              </div>
            </div>

            {/* Call Action */}
            <button className="w-full flex items-center justify-center gap-2 text-[#008080] font-medium mb-6 hover:underline montserrat">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call Agent
            </button>

            {/* Input Field */}
            <div className="mb-8 montserrat">
               <input 
                 type="text" 
                 placeholder="Your name" 
                 className="w-full border border-gray-200 p-3 text-sm outline-none focus:border-gray-400 transition-colors"
               />
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-100 mb-4"></div>

            {/* Company Footer */}
            <div className="flex items-center justify-between montserrat">
              <div>
                <p className="text-xs font-bold text-black uppercase tracking-wide mb-2">
                  {agent.company}
                </p>
                <p className="text-xs text-gray-400 decoration-gray-300 cursor-pointer">
                  Listings for Sale
                </p>
              </div>
              <img 
                src={agent.companyLogo} 
                alt="Company Logo" 
                className="h-8 w-auto object-contain bg-black p-1"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EstateDetails;