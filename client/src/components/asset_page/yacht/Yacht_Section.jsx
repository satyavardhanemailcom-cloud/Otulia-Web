import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import YachtGallery from "./YachtGallery";
import YachtDetails from "./YachtDetails";
import YachtKeyFeatures from "./YachtKeyFeat";
import YachtFeatures from "./YachtFeatures";
import AssetCard from "../../AssetCard";
import LocationMap from "../LocationMap";


const Yacht_Section = () => {
    const [info, setInfo] = useState(null);
    const [list, setList] = useState([]);
    const [limit, setLimit] = useState(3);

    const { id } = useParams();

    const infoFetch = async () => {
        if (!id) return;
        const url = `/api/assets/yacht/${id}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.json();
            setInfo(result);
        } catch (error) {
            console.error("Error fetching yacht info:", error.message);
        }
    };

    useEffect(() => {
        infoFetch();
    }, [id]);

    const dataFetch = async () => {
        const url = `/api/assets/yacht?limit=${limit}`;
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
                <div className="text-xl montserrat text-gray-500">Loading Yacht Details...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="w-[92%] md:w-[96%] h-px bg-black border-0 self-center my-10"></div>

            <YachtGallery images={info.images} />

            <div className="w-[92%] md:w-[80%] h-px bg-gray-300 border-0 self-center my-5"></div>

            <YachtDetails item={info} modelName="YachtAsset" />

            <div className="w-[92%] md:w-[80%] h-px bg-gray-300 border-0 self-center my-5"></div>

            <YachtKeyFeatures item={info} />

            <YachtFeatures item={info} />

            <div className="w-[92%] md:w-[80%] h-px bg-gray-300 border-0 self-center my-5"></div>

            <div className="w-full max-w-[80%] mx-auto px-4 md:px-8 py-8 bg-white">
                <h1 className="text-3xl md:text-5xl font-bold playfair-display text-black">
                    More Yachts
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-7">
                    {list.map((item, idx) => (
                        <div key={item._id || idx}>
                            <AssetCard item={item} idx={idx} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-[92%] md:w-[80%] h-px bg-gray-300 border-0 self-center my-5"></div>

            <div className="flex items-center justify-center mb-4">
            <LocationMap locationName={info.location} />
            </div>

        </div>
    );
};

export default Yacht_Section;
