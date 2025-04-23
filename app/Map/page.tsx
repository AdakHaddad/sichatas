"use client";

import {
  Share,
  Layers,
  BarChart2,
  Ruler,
  Wind,
  Map as MapIcon,
  Search,
} from "lucide-react";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL from "@urbica/react-map-gl";

// Define a single constant for your API key
const MAP_SERVICE_KEY = process.env.NEXT_PUBLIC_MAPID_KEY || "";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function MapView() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewport, setViewport] = useState({
      latitude:       -7.764637, 

    longitude:110.372560,
    zoom: 15,
  });

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Map Container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Map Component */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-black/10  z-10"></div>
          <MapGL
            style={{ width: "100%", height: "100%" }}
            mapStyle={`https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`}
            accessToken={MAPBOX_TOKEN}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            onViewportChange={setViewport}
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Map Controls - Top Right */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors">
            <MapIcon size={24} />
          </button>
          <button className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors">
            <Search size={24} />
          </button>
        </div>

        {/* Map Toolbar - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-8">
            <button className="text-gray-600 hover:text-black transition-colors">
              <Wind size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <BarChart2 size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <Layers size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <Ruler size={24} />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <Share size={24} />
            </button>
          </div>
        </div>

 
      </div>
    </div>
  );
}
