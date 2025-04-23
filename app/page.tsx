"use client";
import Link from "next/link";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, { Source, Layer, Popup } from "@urbica/react-map-gl";
// Package
import React, { useState } from "react";
import { circle } from "turf";
import axios from "axios";

// Define a single constant for your API key
const MAP_SERVICE_KEY = process.env.NEXT_PUBLIC_MAPID_KEY || "";
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Background Map Component - Simplified version for background only
const BackgroundMap = () => {
  const [viewport, setViewport] = useState({
    latitude: -6.914744,
    longitude: 107.609811,
    zoom: 12,
  });

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>
      <MapGL
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`}
        accessToken={MAPBOX_TOKEN}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={setViewport}
        interactive={false} // Disable map interactions for background
      />
    </div>
  );
};

// Interactive Map Component - For the actual map section
const InteractiveMap = () => {
  // Kumpulan Data
  const [dataPopup, setDataPopup] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [dataBuffer, setDataBuffer] = useState({});
  const [dataIsochrone, setDataIsochrone] = useState({});

  // Menampilkan Mode
  const [showBuffer, setShowBuffer] = useState(false);
  const [showIsochrone, setShowIsochrone] = useState(false);
  const [showMode, setShowMode] = useState("");
  const [showInfo, setShowInfo] = useState("");

  // Seting Isochrone
  const [profile, setProfile] = useState("");
  const [methods, setMethods] = useState("");
  const [interval, setInterval] = useState("");

  const [viewport, setViewport] = useState({
    latitude: -6.914744,
    longitude: 107.609811,
    zoom: 12,
  });

  const handleClick = (e) => {
    setDataPopup(e);
    setShowPopup(!showPopup);
  };

  const handleClose = () => setShowPopup(!showPopup);

  const clickBuffer = (e) => {
    let center = [e.lng, e.lat];
    let options = {
      steps: 64,
      units: "kilometers",
      properties: {},
    };
    let buffer = circle(center, 1, options);
    setShowBuffer(true);
    setShowIsochrone(false);
    setDataBuffer(buffer);
  };

  const clickModeIsochrone = () => {
    setShowIsochrone(true);
    setShowMode("isochrone");
    setDataIsochrone({});
    setProfile("");
    setMethods("");
    setInterval("");
  };

  const clickIsochrone = async () => {
    let coordinates = dataPopup?.lngLat;

    if (!coordinates) {
      console.error("No coordinates selected");
      return;
    }

    const body = {
      longitude: coordinates.lng,
      latitude: coordinates.lat,
      profile: profile,
      methods: methods,
      interval: interval,
      color: "0ca5eb",
      denoise: "0",
    };

    try {
      const res = await axios.get(
        `https://api.mapbox.com/isochrone/v1/mapbox/${body.profile}/${body.longitude}%2C${body.latitude}?${body.methods}=${body.interval}&contours_colors=${body.color}&polygons=true&denoise=${body.denoise}&access_token=${MAPBOX_TOKEN}`
      );

      setDataIsochrone(res.data);
      setShowBuffer(false);
      setShowInfo("isochrone");
      setShowMode("");
    } catch (error) {
      console.error("Error fetching isochrone:", error);
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-xl">
      <MapGL
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://basemap.mapid.io/styles/street-new-generation/style.json?key=${MAP_SERVICE_KEY}`}
        accessToken={MAPBOX_TOKEN}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        onViewportChange={setViewport}
        onClick={handleClick}
      >
        {showPopup && dataPopup?.lngLat?.lng && dataPopup?.lngLat?.lat && (
          <Popup
            longitude={dataPopup.lngLat.lng}
            latitude={dataPopup.lngLat.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={handleClose}
          >
            <div>
              <p>Longitude: {dataPopup.lngLat.lng.toFixed(6)}</p>
              <p>Latitude: {dataPopup.lngLat.lat.toFixed(6)}</p>
              <button onClick={() => clickBuffer(dataPopup.lngLat)}>
                Create Buffer
              </button>
              <button onClick={clickModeIsochrone}>Create Isochrone</button>
            </div>
          </Popup>
        )}

        {showBuffer && (
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

        {showIsochrone && dataIsochrone.features && (
          <Source id="isochrone-data" type="geojson" data={dataIsochrone}>
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
  );
};

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background Map */}
      <BackgroundMap />

      {/* Content */}
      <div className="relative z-20">
        {/* Navigation */}
        <nav className="relative">
          <div className="bg-[#C1FF9B] rounded-full mx-4 mt-4 px-8 py-4 shadow-lg">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="text-2xl font-black">SICHATAS</div>
              <div className="flex gap-12 text-xl font-bold">
                <Link href="/Map" className="hover:opacity-70">
                  Map
                </Link>
                <a href="#data" className="hover:opacity-70">
                  Data
                </a>
                <a href="#about" className="hover:opacity-70">
                  About
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 pt-10 pb-10">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              Sistem Perencanaan <span className="block">Pembangunan</span>{" "}
              <span className="block">Bangunan Hunian</span>{" "}
              <span className="block">Strategis dan Sehat</span>{" "}
              <span className="block">berbasis GIS</span>{" "}
              <span className="block">(SICATHAS)</span>
            </h1>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-xl">
            <p className="text-xl mb-6">
              Temukan lokasi hunian ideal dengan SICATHAS – sistem berbasis
              Geographic Information System (GIS) yang membantu Anda
              merencanakan pembangunan hunian yang sehat, strategis, dan
              berkelanjutan.
            </p>
            <p className="text-xl">
              Dapatkan hunian yang aman, nyaman dengan mudah bersama kami! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
