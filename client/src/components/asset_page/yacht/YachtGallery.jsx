import React, { useState, useRef, useEffect } from 'react';

const YachtGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // Handlers for main arrows
  const handlePrev = () => {
    setActiveIndex((prev) => {
      const newIndex = prev === 0 ? images.length - 1 : prev - 1;
      scrollToThumbnail(newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      const newIndex = prev === images.length - 1 ? 0 : prev + 1;
      scrollToThumbnail(newIndex);
      return newIndex;
    });
  };

  // Helper to scroll the thumbnail strip to keep active image in view
  const scrollToThumbnail = (index) => {
    if (scrollContainerRef.current) {
      const thumbnailWidth = 80; // approximate width of thumbnail + gap
      scrollContainerRef.current.scrollTo({
        left: index * thumbnailWidth - (scrollContainerRef.current.clientWidth / 2) + (thumbnailWidth / 2),
        behavior: 'smooth'
      });
    }
  };

  // Sync active index change (e.g. from clicks) with scroll
  useEffect(() => {
    scrollToThumbnail(activeIndex);
  }, [activeIndex]);

  // Safety check: If no images are passed, show a placeholder or nothing
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
        No Images Available
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1700px] mx-auto p-4 bg-white">
      
      {/* 1. MAIN IMAGE CONTAINER */}
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-gray-100 overflow-hidden mb-4 rounded-sm shadow-sm group">
        <img 
          src={images[activeIndex]} 
          alt={`Vehicle View ${activeIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Navigation Arrows (Overlay) - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Overlay Dots (Bottom Center) - Only if images < 15 to avoid clutter */}
        {images.length > 1 && images.length < 15 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full shadow-sm cursor-pointer transition-all duration-300 ${
                  activeIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* 2. THUMBNAIL STRIP - Hide if only 1 image */}
      {images.length > 1 && (
        <div className="relative flex items-center justify-between border border-gray-200 p-2 rounded-sm bg-gray-50">
          
          {/* Thumbnails Grid with Ref for auto-scroll */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto no-scrollbar px-2 w-full scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar for standard look
          >
            {images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`
                  relative cursor-pointer shrink-0 
                  w-20 h-14 md:w-28 md:h-20 
                  overflow-hidden rounded-sm
                  transition-all duration-300
                  ${activeIndex === idx 
                    ? 'ring-2 ring-black opacity-100 scale-95' 
                    : 'opacity-60 hover:opacity-100'
                  }
                `}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default YachtGallery;