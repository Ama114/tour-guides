"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for the missing marker icon issue in Leaflet with Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// We accept the location name as a prop
export default function Map({ location }: { location: string }) {
  // For now, we use a fixed coordinate (e.g., center of Sri Lanka) 
  // In a real app, we convert the 'location' string to coordinates using Geocoding
  const position: [number, number] = [7.8731, 80.7718]; 

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border-2 border-gray-200 z-0 relative">
      <MapContainer center={position} zoom={7} scrollWheelZoom={false} className="h-full w-full">
        {/* OpenStreetMap free tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Experience Location: <br /> <b>{location}</b>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}