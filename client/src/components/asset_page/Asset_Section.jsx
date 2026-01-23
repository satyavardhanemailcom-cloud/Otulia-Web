import React, { useState, useEffect } from "react";
import CarGallery from "./car/CarGallery";
import CarDetails from "./car/CarDetails";
import CarKeyFeatures from "./car/CarKeyFeat";
import CarFeatures from "./car/CarFeatures";
import AssetCard from "../AssetCard";
import { useLocation } from "react-router-dom";

const Asset_Section = () => {
  const [list, setlist] = useState([]);
  const [limit, setLimit] = useState(3);
    const path = useLocation()
  const cat = path.pathname.split('/')
  const id = cat[3]
  // Fetch data
  const datafetch = async () => {
    const url = `http://localhost:8000/api/assets/car?limit=${limit}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setlist(result);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    datafetch();
  }, [limit]);

  return (
    <div className="flex flex-col">
      <div className="w-[92%] md:w-[96%] h-px bg-black border-0 self-center my-10"></div>
      <CarGallery />
      <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
      <CarDetails />
      <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
      <CarKeyFeatures />
      <CarFeatures />

      <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 bg-white">
        <h1 className="text-3xl md:text-5xl font-bold playfair-display text-black">
          More From This Dealer
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
          {list.map((item, idx) => (
            <div key={item._id}>
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>
      </div>

       <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 bg-white">
        <h1 className="text-3xl md:text-5xl font-bold playfair-display text-black">
          Similar Listings
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
          {list.map((item, idx) => (
            <div key={item._id}>
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Asset_Section;
