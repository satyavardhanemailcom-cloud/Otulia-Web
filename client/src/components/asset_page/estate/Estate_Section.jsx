import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import EstateGallery from "../estate/EstateGallery";
import EstateDetails from "../estate/EstateDetails";
import EstateKeyFeatures from "../estate/EstateKeyFeat";
import EstateFeatures from "../estate/EstateFeatures";
import AssetCard from "../../AssetCard";

const Estate_Section = () => {
  const [info, setInfo] = useState(null); 
  const [list, setList] = useState([]);
  const [limit, setLimit] = useState(3);

  const { id } = useParams();
   

  
  const infoFetch = async () => {
    
    if (!id) return;

    const url = `/api/assets/estate/${id}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      
      setInfo(result);  
    } catch (error) {
      console.error("Error fetching estate info:", error.message);
    }
  };

  
  useEffect(() => {
    infoFetch();
  }, [id]);

  
  const dataFetch = async () => {
    const url = `/api/assets/estate?limit=${limit}`;
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
      
      
      <EstateGallery images={info.images} />
      
      <div className="w-[92%] md:w-[70%] h-px bg-gray-300 border-0 self-center my-5"></div>
      
      
      
      <EstateDetails item={info} />
      
      <div className="w-[92%] md:w-[70%] h-px bg-ray-300 border-0 self-center my-5"></div>
      
      
      <EstateKeyFeatures item={info} />
      
      <EstateFeatures item={info} />

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

export default Estate_Section;