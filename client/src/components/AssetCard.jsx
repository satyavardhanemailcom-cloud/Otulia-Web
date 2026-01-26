import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import numberWithCommas from '../modules/numberwithcomma'

const AssetCard = ({ item }) => {
  const navigate = useNavigate()

  const pathname = useLocation()
  // Correctly checking if it is the homepage
  const homepage = pathname.pathname === '/'

  // STATE
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  let category = '.'

  // 1. GET TOP 3 IMAGES ONLY
  const validImages = (() => {
    let imgs = [];
    if (item.images?.length > 0) imgs = item.images;
    else if (Array.isArray(item.image) && item.image.length > 0) imgs = item.image;
    else if (typeof item.image === 'string') imgs = [item.image];
    else imgs = ['https://via.placeholder.com/400x300?text=No+Image'];

    return imgs.slice(0, 3);
  })();

  // 2. AUTO-SLIDE EFFECT
  useEffect(() => {
    if (validImages.length <= 1) return;

    // Pause auto-slide if user is hovering (optional polish)
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % validImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [validImages.length, isHovered]); // dependency on isHovered allows pausing

  // 3. DETAILS LOGIC
  let displayDetails = item.details;

  // Set category based on explicit field or infer from specs
  if (item.category) {
    category = item.category.toLowerCase();
  } else if (item.itemModel) {
    const model = item.itemModel.toLowerCase();
    if (model.includes('car')) category = 'car';
    else if (model.includes('estate')) category = 'estate';
    else if (model.includes('bike')) category = 'bike';
    else if (model.includes('yacht')) category = 'yacht';
  }

  if (category === '.' && item.keySpecifications) {
    const specs = item.keySpecifications;

    if (specs.power || specs.mileage) {
      displayDetails = [specs.power, specs.mileage, specs.cylinderCapacity].filter(Boolean).join(' | ');
      category = 'car';
    } else {
      const beds = specs.bedrooms ? `${specs.bedrooms} Beds` : null;
      const baths = specs.bathrooms ? `${specs.bathrooms} Baths` : null;
      const area = specs.builtUpArea || specs.landArea;
      displayDetails = [beds, baths, area].filter(Boolean).join(' | ');
      category = 'estate';
    }
  }

  // HANDLERS
  const handleHeartClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setActiveImageIndex(index);
  };

  return (
    <div
      onClick={() => navigate(`/asset/${category}/${item._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative border border-gray-100 shadow-sm transition-all duration-300 bg-white cursor-pointer block hover:shadow-lg"
    >
      {/* Image Container (Mask) */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

        {/* SLIDER TRACK: This moves left/right smoothly */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
        >
          {validImages.map((imgSrc, idx) => (
            <img
              key={idx}
              src={imgSrc}
              alt={item.title}
              // Each image takes up 100% of the card width (min-w-full)
              // The scale effect works independently of the slide
              className={`min-w-full h-full object-cover transition-transform duration-1000 ease-in-out ${isHovered ? "scale-110" : "scale-100"
                }`}
            />
          ))}
        </div>

        {/* Pagination Dots */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {validImages.map((_, index) => (
              <div
                key={index}
                onClick={(e) => handleDotClick(e, index)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 shadow-sm border border-black/10 
                  ${activeImageIndex === index
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                  }`}
              ></div>
            ))}
          </div>
        )}

        {/* Heart Button */}
        <button
          className={`absolute top-2 right-3 z-20 focus:outline-none transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"
            }`}
          onClick={handleHeartClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isLiked ? "#ef4444" : "none"}
            stroke={isLiked ? "none" : "white"}
            strokeWidth="2"
            className="w-8 h-8 drop-shadow-md"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        {/* Rent Badge */}
        {item.type === 'Rent' && (
          <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md text-white px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded shadow-lg">
            For Rent
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 relative">
        <h3 className="text-xl playfair-display text-black mb-1 font-sans truncate pr-14">
          {item.title}
        </h3>
        <p className="text-md font-bold text-black mb-1 font-sans">
          {typeof item.price === 'number' ? `£ ${numberWithCommas(item.price)}` : item.price}
          {item.type === 'Rent' && <span className="text-[10px] text-gray-500 font-normal"> / day</span>}
        </p>

        <p className="text-[10px] text-gray-400 mb-2 font-normal uppercase tracking-widest truncate">
          {item.location}
        </p>

        {!homepage && (
          <div className='absolute top-5 right-4 flex gap-2 items-center p-2 border border-gray-200 rounded-lg bg-white shadow-sm'>
            <img className='w-8 h-8 rounded-full object-cover' src={item.agent.photo} alt="agent" />
            {/* UPDATED RESPONSIVENESS: Hidden on mobile/tablet, visible on XL screens */}
            <p className="text-[10px] hidden xl:block text-gray-500 font-medium uppercase tracking-wider truncate max-w-[80px]">
              {item.agent.name}
            </p>
          </div>
        )}

        <div className="w-full h-px bg-gray-100 mb-2"></div>

        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
            {displayDetails || "View Details"}
          </p>

        </div>
      </div>
    </div>
  )
}

export default AssetCard