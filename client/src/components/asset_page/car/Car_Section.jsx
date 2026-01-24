import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 1. Import useParams
import CarGallery from "../car/CarGallery";
import CarDetails from "../car/CarDetails";
import CarKeyFeatures from "../car/CarKeyFeat";
import CarFeatures from "../car/CarFeatures";
import AssetCard from "../../AssetCard";

const Car_Section = () => {
  const [info, setInfo] = useState(null); // Initialize as null to track loading state
  const [list, setList] = useState([]);
  const [limit, setLimit] = useState(3);

  // 1. Get ID correctly regardless of URL structure
  const { id } = useParams();
   

  // Car info fetching
  const infoFetch = async () => {
    // Safety check
    if (!id) return;

    const url = `http://localhost:8000/api/assets/car/${id}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      
      setInfo(result);  
    } catch (error) {
      console.error("Error fetching car info:", error.message);
    }
  };

  // Fetch data when ID changes
  useEffect(() => {
    infoFetch();
  }, []);

  // Fetch sidebar list
  const dataFetch = async () => {
    const url = `http://localhost:8000/api/assets/car?limit=${limit}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setList(result);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    dataFetch();
  }, [limit]);

  // 2. Loading State: Don't render until info is loaded
  if (!info) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl montserrat text-gray-500">Loading Asset Details...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-[92%] md:w-[96%] h-px bg-black border-0 self-center my-10"></div>
      
      {/* Pass images array safely */}
      <CarGallery images={info.images} />
      
      <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
      
      {/* 3. Pass the whole 'item' object (info) to children */}
      {/* This works if your CarDetails expects ({ item }) props */}
      <CarDetails item={info} />
      
      <div className="w-[92%] md:w-[70%] h-px bg-ray-300 border-0 self-center my-5"></div>
      
      {/* 4. Pass 'item' to features components */}
      <CarKeyFeatures item={info} />
      
      <CarFeatures item={info} />

      <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
      
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 bg-white">
        <h1 className="text-3xl md:text-5xl font-bold playfair-display text-black">
          More From This Dealer
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
          {list.map((item, idx) => (
            <div key={item._id || idx}>
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
            <div key={item._id || idx}>
              <AssetCard item={item} idx={idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Car_Section;