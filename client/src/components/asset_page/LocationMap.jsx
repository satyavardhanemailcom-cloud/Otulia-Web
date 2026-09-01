import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiMaximize, FiHome, FiPlus, FiMinus } from "react-icons/fi";

// Custom stylized marker icon for pinpoint accuracy
const houseIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: black; width: 40px; height: 40px; border-radius: 50%; border: 2px solid white; display: flex; items-center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          <svg style="color: white; width: 20px; height: 20px; margin: auto;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Custom Zoom Controls Component
const CustomZoomControls = () => {
  const map = useMap();
  return (
    <div
      className="absolute top-8 right-8 z-[1002] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => map.zoomIn()}
        className="p-4 hover:bg-gray-50 border-b border-gray-100 text-gray-800 transition-colors flex items-center justify-center"
        title="Zoom In"
      >
        <FiPlus className="text-xl" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="p-4 hover:bg-gray-50 text-gray-800 transition-colors flex items-center justify-center"
        title="Zoom Out"
      >
        <FiMinus className="text-xl" />
      </button>
    </div>
  );
};

// Helper: Auto-center Map to exact coordinates
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

// Helper: Check if coordinates are valid and non-zero
const hasValidCoords = (latitude, longitude) => {
  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null
  )
    return false;
  if (typeof latitude === "string" && latitude.trim() === "") return false;
  if (typeof longitude === "string" && longitude.trim() === "") return false;
  const numLat = parseFloat(latitude);
  const numLng = parseFloat(longitude);
  if (isNaN(numLat) || isNaN(numLng)) return false;
  if (numLat === 0 && numLng === 0) return false;
  return true;
};

// Geocode location string using Nominatim with Photon fallback
const geocodeLocationName = async (locationStr, signal) => {
  if (!locationStr || typeof locationStr !== "string" || !locationStr.trim())
    return null;
  const trimmed = locationStr.trim();

  // Try Nominatim first
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`,
      {
        signal,
        headers: { "Accept-Language": "en" },
      },
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const pLat = parseFloat(data[0].lat);
        const pLng = parseFloat(data[0].lon);
        if (!isNaN(pLat) && !isNaN(pLng)) {
          return { lat: pLat, lng: pLng };
        }
      }
    }
  } catch (err) {
    if (err.name === "AbortError") return null;
  }

  // Fallback to Photon
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=1`,
      { signal },
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.features?.length > 0) {
        const coords = data.features[0].geometry?.coordinates;
        if (Array.isArray(coords) && coords.length >= 2) {
          const pLng = parseFloat(coords[0]);
          const pLat = parseFloat(coords[1]);
          if (!isNaN(pLat) && !isNaN(pLng)) {
            return { lat: pLat, lng: pLng };
          }
        }
      }
    }
  } catch (err) {
    if (err.name === "AbortError") return null;
  }

  return null;
};

const LocationMap = ({ locationName, lat, lng }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [mapType, setMapType] = useState("satellite");

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    // If valid coordinates are provided, use them directly
    if (hasValidCoords(lat, lng)) {
      setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      return;
    }

    // Only for missing, invalid, or 0.0,0.0 coordinates: resolve from locationName in DB
    if (
      locationName &&
      typeof locationName === "string" &&
      locationName.trim()
    ) {
      geocodeLocationName(locationName, controller.signal).then((geoCoords) => {
        if (!isCancelled) {
          if (geoCoords) {
            setCoordinates(geoCoords);
          } else {
            setCoordinates({ lat: 25.2048, lng: 55.2708 });
          }
        }
      });
    } else {
      setCoordinates({ lat: 25.2048, lng: 55.2708 });
    }

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [lat, lng, locationName]);

  const handleOpenMap = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
      window.open(url, "_blank");
    } else if (locationName) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="w-full px-[2%] mb-16">
      <div
        className="w-full h-[400px] md:h-[550px] relative rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
        onClick={handleOpenMap}
      >
        {/* Click-to-open Overlay */}
        <div className="absolute inset-0 z-[1001] bg-black/0 group-hover:bg-black/[0.02] transition-colors flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 flex items-center gap-3">
            <FiMaximize className="text-black" />
            <span className="text-xs font-bold text-black uppercase tracking-[0.2em] montserrat">
              View in Google Maps
            </span>
          </div>
        </div>

        {/* Fullscreen Button */}
        <button
          className="absolute top-8 left-8 z-[1002] p-4 bg-white rounded-2xl shadow-xl hover:scale-105 transition-all text-gray-800 border border-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenMap();
          }}
        >
          <FiMaximize className="text-xl" />
        </button>

        {/* Map Type Toggle */}
        <div
          className="absolute bottom-10 right-10 z-[1002] flex bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setMapType("street")}
            className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${mapType === "street" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Map
          </button>
          <button
            onClick={() => setMapType("satellite")}
            className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${mapType === "satellite" ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
          >
            Satellite
          </button>
        </div>

        {coordinates && (
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            zoomControl={false}
            dragging={true}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            className="w-full h-full"
          >
            <CustomZoomControls />

            {mapType === "street" ? (
              <>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={16}
                  attribution="&copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
                />
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={16}
                />
              </>
            ) : (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
            )}

            {/* Exact Pinpoint Marker */}
            <Marker
              position={[coordinates.lat, coordinates.lng]}
              icon={houseIcon}
            />

            <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />
          </MapContainer>
        )}
      </div>

      <style>{`
        .leaflet-container { background: #f8f8f8 !important; }
      `}</style>
    </div>
  );
};

export default LocationMap;
