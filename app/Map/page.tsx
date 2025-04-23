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
import MapGL, { Source, Layer, Popup } from "@urbica/react-map-gl";
import * as turf from "@turf/turf";
import {
  Feature,
  Polygon,
  GeoJsonProperties,
  FeatureCollection,
} from "geojson";

// Define interface for map click events
interface MapClickEvent {
  lngLat: {
    lng: number;
    lat: number;
  };
}

// Define interface for popup info
interface PopupInfo {
  longitude: number;
  latitude: number;
}

// Define a single constant for your API key
const MAP_SERVICE_KEY = process.env.NEXT_PUBLIC_MAPID_KEY || "";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Define states for buffer and isochrone functionality
const MapView = () => {
  const [viewport, setViewport] = useState({
    latitude: -7.764637,
    longitude: 110.37256,
    zoom: 15,
  });
  const [showBuffer, setShowBuffer] = useState(false);
  // We'll use the showIsochrone state in our component
  const [showIsochrone, setShowIsochrone] = useState(false);
  const [dataBuffer, setDataBuffer] = useState<
    | Feature<Polygon, GeoJsonProperties>
    | FeatureCollection<Polygon, GeoJsonProperties>
    | null
  >(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const clickBuffer = (e: MapClickEvent) => {
    // Create a proper GeoJSON point
    const pt = turf.point([e.lngLat.lng, e.lngLat.lat]);

    // Convert to FeatureCollection
    const pointFeatureCollection = turf.featureCollection([pt]);

    // Create buffer
    const buffered = turf.buffer(pointFeatureCollection, 1, "kilometers");

    setDataBuffer(buffered);
    setShowBuffer(true);
    setShowIsochrone(false); // We're using showIsochrone here
    setShowPopup(false);
  };

  const handleMapClick = (e: MapClickEvent) => {
    setPopupInfo({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
    });
    setShowPopup(true);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Map Container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Map Component */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10"></div>
          <MapGL
            style={{ width: "100%", height: "100%" }}
            mapStyle={`https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`}
            accessToken={MAPBOX_TOKEN}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            onViewportChange={setViewport}
            onClick={handleMapClick}
          >
            {/* Popup when map is clicked */}
            {showPopup && popupInfo && (
              <Popup
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
              >
                <div>
                  <p>Longitude: {popupInfo.longitude.toFixed(6)}</p>
                  <p>Latitude: {popupInfo.latitude.toFixed(6)}</p>
                  <button
                    onClick={() =>
                      clickBuffer({
                        lngLat: {
                          lng: popupInfo.longitude,
                          lat: popupInfo.latitude,
                        },
                      })
                    }
                    className="mt-2 bg-[#C1FF9B] hover:bg-[#A8E689] px-4 py-1 rounded text-sm"
                  >
                    Create Buffer
                  </button>
                </div>
              </Popup>
            )}

            {/* Show buffer if created */}
            {showBuffer && dataBuffer && (
              <Source id="buffer-data" type="geojson" data={dataBuffer}>
                <Layer
                  id="buffer-layer"
                  type="fill"
                  paint={{
                    "fill-color": "#088",
                    "fill-opacity": 0.4,
                    "fill-outline-color": "#088",
                  }}
                />
              </Source>
            )}

            {/* Show isochrone layer when active */}
            {showIsochrone && (
              <Source
                id="isochrone-data"
                type="geojson"
                data={{ type: "FeatureCollection", features: [] }}
              >
                <Layer
                  id="isochrone-layer"
                  type="fill"
                  paint={{
                    "fill-color": "#0ca5eb",
                    "fill-opacity": 0.4,
                    "fill-outline-color": "#0ca5eb",
                  }}
                />
              </Source>
            )}
          </MapGL>
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
};

export default MapView;
