import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// 1. IMPORT CSS: This is mandatory. 
// If your app still looks broken, add this link to your index.html <head>:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- FIX 1: VITE/WEBPACK COMPATIBLE ICONS ---
// Instead of using 'require', we use direct CDN URLs. 
// This works in Vite, Next.js, and Create React App without configuration.
const iconFix = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- HELPER: AUTO-CENTER MAP ---
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
};

const LocationMap = ({ locationName }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationName) return;

    const fetchCoords = async () => {
      setLoading(true);
      setError(null);
      console.log("Searching for:", locationName); // DEBUG LOG

      try {
        // --- FIX 2: ROBUST API CALL ---
        // We add addressdetails=1 to get better data
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        console.log("API Result:", data); // DEBUG LOG

        if (data && data.length > 0) {
          setCoordinates({ 
            lat: parseFloat(data[0].lat), 
            lng: parseFloat(data[0].lon) 
          });
        } else {
          setError("Location not found");
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Error fetching location");
      } finally {
        setLoading(false);
      }
    };

    // Debounce to prevent API spam
    const timer = setTimeout(() => {
        fetchCoords();
    }, 1000);

    return () => clearTimeout(timer);
  }, [locationName]);

  // --- RENDER ---
  const boxStyle = { height: '400px', width: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  if (!locationName) return <div style={boxStyle}>Enter a location name</div>;
  if (loading) return <div style={boxStyle}>Loading map...</div>;
  if (error) return <div style={{...boxStyle, color: 'red'}}>{error}</div>;
  if (!coordinates) return null;

  const handleMapClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      onClick={handleMapClick}
      className="transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer group relative"
      style={{ height: '400px', width: '90%', border: '2px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}
    >
      {/* Overlay to show "Click to view on Google Maps" on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-[20] flex items-center justify-center">
        <span className="bg-white/90 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          View on Google Maps
        </span>
      </div>

      <MapContainer 
        center={[coordinates.lat, coordinates.lng]} 
        zoom={14} 
        scrollWheelZoom={false} 
        dragging={false} // Disable dragging to prioritize click-to-open
        zoomControl={false} // Disable zoom control for cleaner look if it's just a preview
        style={{ height: '100%', width: '100%' , zIndex: '10' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={[coordinates.lat, coordinates.lng]} icon={iconFix}>
          <Popup>{locationName}</Popup>
        </Marker>
        
        <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;