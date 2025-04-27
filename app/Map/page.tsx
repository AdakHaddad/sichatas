"use client";

import {
  Share,
  Layers,
  BarChart2,
  Ruler,
  Wind,
  Map as MapIcon,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Source, Layer, Popup } from "@urbica/react-map-gl";
import * as turf from "@turf/turf";
import {
  FeatureCollection,
  Polygon,
  GeoJsonProperties,
  Feature,
} from "geojson";
import { MapMouseEvent, LngLat } from "mapbox-gl";

// Fix for EventData - create an interface based on mapbox documentation
interface EventData {
  originalEvent: MouseEvent | TouchEvent | WheelEvent;
  type: string;
  target: any;
  point: { x: number; y: number };
  lngLat: LngLat;
  preventDefault: () => void;
  defaultPrevented: boolean;
}

const MAP_SERVICE_KEY = process.env.NEXT_PUBLIC_MAPID_KEY || "";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface FasumFeature extends Feature {
  properties: {
    type?: string;
    building?: string;
    [key: string]: unknown;
  };
}

interface FasumGeoJson extends FeatureCollection {
  features: FasumFeature[];
}

const MapView = () => {
  const [viewport, setViewport] = useState({
    latitude: -6.515,
    longitude: 107.393,
    zoom: 14.5,
  });
  const [showBuffer, setShowBuffer] = useState(false);
  const [dataBuffer, setDataBuffer] = useState<FeatureCollection<
    Polygon,
    GeoJsonProperties
  > | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [fasumData, setFasumData] = useState<FasumGeoJson | null>(null);
  const [jawaData, setJawaData] = useState<FeatureCollection | null>(null);
  const [jawaHealthData, setJawaHealthData] =
    useState<FeatureCollection | null>(null);
  const [klHealthData, setKlHealthData] = useState<FeatureCollection | null>(
    null
  );
  const [showFasum, setShowFasum] = useState(true);
  const [showJawa, setShowJawa] = useState(true);
  const [showJawaHealth, setShowJawaHealth] = useState(true);
  const [showKlHealth, setShowKlHealth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch fasum data
        const fasumResponse = await fetch("/api/fasum");
        if (!fasumResponse.ok) {
          throw new Error(
            `Failed to fetch fasum: ${fasumResponse.status} ${fasumResponse.statusText}`
          );
        }
        const fasumData = await fasumResponse.json();
        console.log("Raw fasum API response:", fasumData);

        if (
          fasumData.type === "FeatureCollection" &&
          Array.isArray(fasumData.features)
        ) {
          const validFasumGeoJson: FasumGeoJson = {
            type: "FeatureCollection",
            features: fasumData.features.map((feature: FasumFeature) => ({
              type: "Feature",
              geometry: feature.geometry,
              properties: feature.properties || {},
            })),
          };
          setFasumData(validFasumGeoJson);
        } else if (Array.isArray(fasumData)) {
          const validFasumGeoJson: FasumGeoJson = {
            type: "FeatureCollection",
            features: fasumData.map((feature: FasumFeature) => ({
              type: "Feature",
              geometry: feature.geometry,
              properties: feature.properties || {},
            })),
          };
          setFasumData(validFasumGeoJson);
        } else {
          throw new Error("Invalid fasum GeoJSON format received from API");
        }

        // Fetch jawa data
        const jawaResponse = await fetch("/api/jawa");
        if (!jawaResponse.ok) {
          throw new Error(
            `Failed to fetch jawa: ${jawaResponse.status} ${fasumResponse.statusText}`
          );
        }
        const jawaData = await jawaResponse.json();
        console.log("Raw jawa API response:", jawaData);

        if (
          jawaData.type === "FeatureCollection" &&
          Array.isArray(jawaData.features)
        ) {
          const validJawaGeoJson: FeatureCollection = {
            type: "FeatureCollection",
            features: jawaData.features.map((feature: Feature) => ({
              type: "Feature",
              geometry: feature.geometry,
              properties: feature.properties || {},
            })),
          };
          setJawaData(validJawaGeoJson);
        } else {
          throw new Error("Invalid jawa GeoJSON format received from API");
        }

        // Fetch jawa_health data
        const jawaHealthResponse = await fetch("/api/jawa_health");
        if (!jawaHealthResponse.ok) {
          throw new Error(
            `Failed to fetch jawa_health: ${jawaHealthResponse.status} ${jawaHealthResponse.statusText}`
          );
        }
        const jawaHealthData = await jawaHealthResponse.json();
        console.log("Raw jawa_health API response:", jawaHealthData);

        if (
          jawaHealthData.type === "FeatureCollection" &&
          Array.isArray(jawaHealthData.features)
        ) {
          const validJawaHealthGeoJson: FeatureCollection = {
            type: "FeatureCollection",
            features: jawaHealthData.features.map((feature: Feature) => ({
              type: "Feature",
              geometry: feature.geometry,
              properties: feature.properties || {},
            })),
          };
          setJawaHealthData(validJawaHealthGeoJson);
        } else {
          throw new Error(
            "Invalid jawa_health GeoJSON format received from API"
          );
        }

        // Fetch kl_health data
        const klHealthResponse = await fetch("/api/kl_health");
        if (!klHealthResponse.ok) {
          throw new Error(
            `Failed to fetch kl_health: ${klHealthResponse.status} ${klHealthResponse.statusText}`
          );
        }
        const klHealthData = await klHealthResponse.json();
        console.log("Raw kl_health API response:", klHealthData);

        if (
          klHealthData.type === "FeatureCollection" &&
          Array.isArray(klHealthData.features)
        ) {
          const validKlHealthGeoJson: FeatureCollection = {
            type: "FeatureCollection",
            features: klHealthData.features.map((feature: Feature) => ({
              type: "Feature",
              geometry: feature.geometry,
              properties: feature.properties || {},
            })),
          };
          setKlHealthData(validKlHealthGeoJson);
        } else {
          throw new Error("Invalid kl_health GeoJSON format received from API");
        }
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clickBuffer = (e: { lngLat: LngLat }) => {
    const pt = turf.point([e.lngLat.lng, e.lngLat.lat]);
    const pointFeatureCollection = turf.featureCollection([pt]);

    // Fix: Use string literal for units, not an object
    const buffered = turf.buffer(
      pointFeatureCollection,
      1,
      "kilometers"
    ) as FeatureCollection<Polygon>;

    setDataBuffer(buffered);
    setShowBuffer(true);
    setShowPopup(false);

    fetch("/api/spatial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "buffer",
        geometry: buffered,
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        metadata: { radius: 1, units: "kilometers" },
      }),
    })
      .then((res) => {
        if (!res.ok) console.error("Failed to save buffer");
        else console.log("Buffer saved to MongoDB");
      })
      .catch((err) => console.error("Error saving buffer:", err));
  };

  const handleMapClick = (e: MapMouseEvent) => {
    console.log("Map clicked:", e.lngLat);
    setPopupInfo({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
    });
    setShowPopup(true);
  };

  const toggleFasumLayer = () => {
    setShowFasum(!showFasum);
  };

  const toggleJawaLayer = () => {
    setShowJawa(!showJawa);
  };

  const toggleJawaHealthLayer = () => {
    setShowJawaHealth(!showJawaHealth);
  };

  const toggleKlHealthLayer = () => {
    setShowKlHealth(!showKlHealth);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      <div className="relative w-full h-full overflow-hidden">
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <span>Loading data...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            <p>{error}</p>
          </div>
        )}
        <div className="relative w-full h-full z-0">
          <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
          <MapGL
            style={{ width: "100%", height: "100%" }}
            mapStyle={`https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`}
            accessToken={MAPBOX_TOKEN}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            onViewportChange={setViewport}
            onClick={handleMapClick}
            onError={(e: Error) => console.error("Map error:", e)}
            onDrag={(e: EventData) => console.log("Dragging:", e)}
            dragPan
            scrollZoom
            // Remove touchZoom prop as it's not supported
            doubleClickZoom
            dragRotate={false}
            
          >
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
                        lngLat: new LngLat(
                          popupInfo.longitude,
                          popupInfo.latitude
                        ),
                      })
                    }
                    className="mt-2 bg-[#C1FF9B] hover:bg-[#A8E689] px-4 py-1 rounded text-sm"
                  >
                    Create Buffer
                  </button>
                </div>
              </Popup>
            )}
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
            {showFasum && fasumData && (
              <Source id="fasum-data" type="geojson" data={fasumData}>
                <Layer
                  id="fasum-layer-fill"
                  type="fill"
                  paint={{
                    "fill-color": [
                      "match",
                      ["get", "type"],
                      "house",
                      "#FF9900",
                      "school",
                      "#3388ff",
                      "general",
                      "#ffcc00",
                      "commercial",
                      "#ff6600",
                      "mosque",
                      "#00cc66",
                      "church",
                      "#9900cc",
                      "hospital",
                      "#ff0000",
                      "#FF9900",
                    ],
                    "fill-opacity": 0.6,
                  }}
                />
                <Layer
                  id="fasum-layer-outline"
                  type="line"
                  paint={{
                    "line-color": "#666",
                    "line-width": 1,
                  }}
                />
              </Source>
            )}
            {showJawa && jawaData && (
              <Source id="jawa-data" type="geojson" data={jawaData}>
                <Layer
                  id="jawa-layer-fill"
                  type="fill"
                  paint={{
                    "fill-color": "#800080",
                    "fill-opacity": 0.3,
                  }}
                />
                <Layer
                  id="jawa-layer-outline"
                  type="line"
                  paint={{
                    "line-color": "#000000",
                    "line-width": 2,
                  }}
                />
              </Source>
            )}
            {showJawaHealth && jawaHealthData && (
              <Source
                id="jawa-health-data"
                type="geojson"
                data={jawaHealthData}
              >
                <Layer
                  id="jawa-health-layer-fill"
                  type="fill"
                  paint={{
                    "fill-color": "#00FF00",
                    "fill-opacity": 0.4,
                  }}
                />
                <Layer
                  id="jawa-health-layer-outline"
                  type="line"
                  paint={{
                    "line-color": "#006600",
                    "line-width": 1,
                  }}
                />
              </Source>
            )}
            {showKlHealth && klHealthData && (
              <Source id="kl-health-data" type="geojson" data={klHealthData}>
                <Layer
                  id="kl-health-layer-fill"
                  type="fill"
                  paint={{
                    "fill-color": "#0000FF",
                    "fill-opacity": 0.4,
                  }}
                />
                <Layer
                  id="kl-health-layer-outline"
                  type="line"
                  paint={{
                    "line-color": "#000066",
                    "line-width": 1,
                  }}
                />
              </Source>
            )}
          </MapGL>
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors">
            <MapIcon size={24} />
          </button>
          <button className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors">
            <Search size={24} />
          </button>
          <button
            onClick={toggleFasumLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={showFasum ? "Hide Building Layer" : "Show Building Layer"}
          >
            {showFasum ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
          <button
            onClick={toggleJawaLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={showJawa ? "Hide Jawa Layer" : "Show Jawa Layer"}
          >
            {showJawa ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
          <button
            onClick={toggleJawaHealthLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={
              showJawaHealth
                ? "Hide Jawa Healthcare Layer"
                : "Show Jawa Healthcare Layer"
            }
          >
            {showJawaHealth ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
          <button
            onClick={toggleKlHealthLayer}
            className="bg-[#C1FF9B] hover:bg-[#A8E689] text-black p-3 rounded-full shadow-lg transition-colors"
            title={
              showKlHealth
                ? "Hide Kalimantan Healthcare Layer"
                : "Show Kalimantan Healthcare Layer"
            }
          >
            {showKlHealth ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
        </div>
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
        <div className="absolute bottom-24 right-4 bg-white p-3 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
          <h3 className="font-bold text-sm mb-2">Legend</h3>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#FF9900] opacity-60 mr-2"></div>
            <span className="text-xs">House</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#3388ff] opacity-60 mr-2"></div>
            <span className="text-xs">School</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#ffcc00] opacity-60 mr-2"></div>
            <span className="text-xs">General Building</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#ff6600] opacity-60 mr-2"></div>
            <span className="text-xs">Commercial</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#00cc66] opacity-60 mr-2"></div>
            <span className="text-xs">Mosque</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#9900cc] opacity-60 mr-2"></div>
            <span className="text-xs">Church</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#ff0000] opacity-60 mr-2"></div>
            <span className="text-xs">Hospital</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#800080] opacity-30 mr-2"></div>
            <span className="text-xs">Jawa Provinces</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#00FF00] opacity-40 mr-2"></div>
            <span className="text-xs">Jawa Healthcare Buffers</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-4 h-4 bg-[#0000FF] opacity-40 mr-2"></div>
            <span className="text-xs">Kalimantan Healthcare Buffers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
