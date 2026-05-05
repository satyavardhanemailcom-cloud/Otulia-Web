import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import numberWithCommas from '../../../modules/numberwithcomma';
import { useCart } from '../../../contexts/CartContext';
import DescriptionSidebar from '../DescriptionSidebar';
import { FiPhoneCall, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const EstateDetails = ({ item, modelName = 'EstateAsset' }) => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activityLoading, setActivityLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Rental State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Destructure with fallbacks 
  const {
    _id,
    title = "Untitled Asset",
    brand_logo = "",
    location = "Unknown Location",
    description = "No description available.",
    price = 0,
    type = 'Sale',
    images = [],
    agent = {}
  } = item || {};

  const handleCallAgent = async () => {
    if (!isAuthenticated) {
      alert("Please login to contact our agents.");
      navigate('/login');
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setActivityLoading(true);
    try {
      const response = await fetch('/api/leads/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agentId: agent.id,
          assetId: _id,
          assetModel: modelName,
          assetTitle: title,
          message: message,
          agentEmail: agent.email,
          agentName: agent.name
        })
      });

      if (response.ok) {
        alert(`Message sent! Agent ${agent.name} will be notified.`);
        setMessage('');
      } else {
        throw new Error("Failed to send lead");
      }
    } catch (error) {
      console.error("Failed to send lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleWhatsapp = () => {
    const phoneNumber = agent?.phone;
    if (!phoneNumber) {
      alert("Agent phone number not available.");
      return;
    }
    const currentUrl = window.location.href;
    const refId = item?.listingReference || "N/A";
    const dealerName = agent?.name || "the agent";
    const text = `Hello! I'm interested in this listing advertised by ${dealerName} on Otulia.com.

Link: ${currentUrl}
Reference ID: #${refId}

*Kindly do not edit this message to ensure your inquiry is sent to the agent.`;
    
    let cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
    }
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed.");
      navigate('/login');
      return;
    }

    if (type === 'Rent') {
      if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        alert("End date must be after start date.");
        return;
      }

      addToCart({
        itemId: _id,
        itemModel: modelName,
        tempId: Date.now() + Math.random().toString(),
        title,
        image: images.length > 0 ? images[0] : null,
        pricePerDay: price,
        startDate,
        endDate,
        duration: diffDays,
        totalPrice: diffDays * price,
        type: 'Rent'
      });
    } else {
      addToCart({
        itemId: _id,
        itemModel: modelName,
        tempId: Date.now() + Math.random().toString(),
        title,
        image: images.length > 0 ? images[0] : null,
        price: price,
        totalPrice: price,
        type: 'Sale'
      });
    }
  };

  function getTimeSinceJoined(createdAt) {
    if (!createdAt) return 'Recently';
    const joinedDate = new Date(createdAt);
    const now = new Date();
    const diffInMonths = (now.getFullYear() - joinedDate.getFullYear()) * 12 + (now.getMonth() - joinedDate.getMonth());
    
    if (diffInMonths < 12) {
      return diffInMonths <= 0 ? 'this month' : `${diffInMonths} months ago`;
    }
    const years = Math.floor(diffInMonths / 12);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }

  const isLongDescription = description && description.length > 400;

  return (
    <>
    <DescriptionSidebar 
      isOpen={isSidebarOpen} 
      onClose={() => setIsSidebarOpen(false)} 
      description={description} 
    />
    <div className="w-full px-[2%] py-10 bg-white font-sans">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

        {/* LEFT COLUMN: Details */}
        <div className="w-full lg:w-[60%]">
          {item.listingReference && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Listing Reference ID</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded shadow-sm">
                <span className="text-[10px] font-bold font-mono text-gray-700">{item.listingReference}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(item.listingReference);
                    alert("Reference ID copied to clipboard!");
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-black"
                  title="Copy ID"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <h1 
              className="text-2xl md:text-3xl font-normal text-black leading-snug"
              style={{ fontFamily: 'Canela, "Times New Roman", Times, serif' }}
            >
              {title}
            </h1>
            {brand_logo && (
              <img src={brand_logo} alt="Brand" className="h-8 md:h-10 w-auto object-contain" />
            )}
            {type === 'Rent' && (
              <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">Premium Lease</span>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 mb-10 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-xs font-medium montserrat">{location}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[10px] md:text-xs font-bold text-[#B58252] uppercase tracking-[0.2em] mb-4">
              ABOUT THE PROPERTY
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm montserrat whitespace-pre-wrap">
              {isLongDescription ? `${description.substring(0, 400)}...` : description}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-[10px] md:text-xs font-bold text-[#B58252] uppercase tracking-[0.2em] mb-4">
              PROPERTY DETAILS
            </h2>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-600 montserrat">
              {Object.entries(item.specification || {}).slice(0, 8).map(([key, val]) => {
                if(!val || val === '-' || val === '0') return null;
                return (
                  <div className="flex items-start gap-2" key={key}>
                    <span className="text-[#B58252] font-medium">-</span>
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: <span className="font-medium text-black">{val}</span></span>
                  </div>
                )
              })}
            </div>
            {isLongDescription && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="mt-6 text-sm text-[#B58252] font-medium montserrat hover:text-[#9A6B41] transition-colors"
              >
                Read Description &rsaquo;
              </button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Price & Card */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6">
          
          <div className="w-full flex flex-col pt-1">
            <span className="text-[10px] font-bold text-[#B58252] uppercase tracking-widest mb-1 w-fit">PRICE</span>
            <h2   
              className="text-3xl md:text-4xl font-poppins-light text-black"
              style={{ fontFamily: 'Canela, "Times New Roman", Times, serif' }}
            >
              {item.isPriceOnRequest ? 'Price on Demand' : `$${numberWithCommas(price)}`}
            </h2>
            
            <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-600 font-medium w-fit">
              <span className="text-green-500">✓</span>
              Inclusion of all fees.
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-gray-400 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
          </div>

          {/* Expanded Agent Box */}
          <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white flex flex-col gap-5 mt-2">
            
            <div className="flex items-center gap-4 montserrat">
              <img src={agent.photo} alt={agent.name} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
              <div>
                <h3 className="text-base font-bold text-black">{agent.name}</h3>
                <p className="text-xs text-gray-400">{`Joined ${getTimeSinceJoined(agent.createdAt)}`}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-between items-center text-center pb-4 border-b border-gray-100">
               <div className="flex flex-col items-center gap-1.5 flex-1">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{location ? location.split(',').pop().trim() : 'Location'}</span>
               </div>
               <div className="w-px h-8 bg-gray-100"></div>
               <div className="flex flex-col items-center gap-1.5 flex-1">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99-2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" /></svg>
                 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">Top Seller<br/>Rank</span>
               </div>
               <div className="w-px h-8 bg-gray-100"></div>
               <div className="flex flex-col items-center gap-1.5 flex-1">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">120+<br/>Listings</span>
               </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span className="text-[10px] font-medium">All sellers are thoroughly verified by <span className="text-[#B58252] font-semibold">Otulia</span></span>
            </div>

            <div className="flex gap-2 montserrat w-full">
              <input
                type="text"
                placeholder="What can we help you with?"
                className="flex-[2] border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors bg-gray-50"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                onClick={handleCallAgent}
                disabled={activityLoading}
                className="flex-[1] bg-black text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {activityLoading ? '...' : 'Send'}
              </button>
            </div>

            <button
              onClick={() => setShowPhone(!showPhone)}
              className="w-full flex items-center justify-center gap-2 border border-black text-black py-3 rounded-lg font-bold hover:bg-gray-50 transition-all montserrat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {showPhone ? (agent.phone || 'Not Available') : 'Show phone number'}
            </button>
          </div>

          <div className="mt-2">
            <h4 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">QUICK ACTIONS</h4>
            <div className="grid grid-cols-2 gap-3 pb-8">
               <button className="bg-[#111827] text-white p-3 rounded-xl flex items-center justify-start gap-3 hover:bg-black transition-all shadow-sm">
                 <FiPhoneCall className="w-5 h-5 opacity-80 shrink-0 ml-1" />
                 <div className="flex flex-col items-start leading-tight">
                   <span className="font-bold text-sm">Call Now</span>
                   <span className="text-[9px] text-gray-300 font-medium">Speak directly</span>
                 </div>
               </button>
               <button onClick={handleWhatsapp} className="bg-[#16a34a] text-white p-3 rounded-xl flex items-center justify-start gap-3 hover:bg-[#15803d] transition-all shadow-sm">
                 <FaWhatsapp className="w-6 h-6 opacity-90 shrink-0 ml-1" />
                 <div className="flex flex-col items-start leading-tight">
                   <span className="font-bold text-sm">WhatsApp</span>
                   <span className="text-[9px] text-green-100 font-medium">Chat on WhatsApp</span>
                 </div>
               </button>
               <button onClick={handleAddToCart} className="border border-gray-200 bg-white text-black p-3 rounded-xl flex items-center justify-start gap-3 hover:bg-gray-50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                 <FiShoppingCart className="w-5 h-5 shrink-0 text-gray-500 ml-1" />
                 <div className="flex flex-col items-start text-left leading-tight">
                   <span className="font-bold text-sm">Add to Cart</span>
                   <span className="text-[9px] text-gray-500 font-medium">Reserve this property</span>
                 </div>
               </button>
               <button className="border border-gray-200 bg-white text-black p-3 rounded-xl flex items-center justify-start gap-3 hover:bg-gray-50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                 <FiHeart className="w-5 h-5 shrink-0 text-gray-500 ml-1" />
                 <div className="flex flex-col items-start text-left leading-tight">
                   <span className="font-bold text-sm">Save Listing</span>
                   <span className="text-[9px] text-gray-500 font-medium">Add to favourites</span>
                 </div>
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default EstateDetails;
