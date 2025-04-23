"use client";
import React, { useState } from "react";
import Link from "next/link";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL from "@urbica/react-map-gl";
import { ArrowRight } from "lucide-react";

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
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
      />
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
            <p className="text-xl mb-6">
              Dapatkan hunian yang aman, nyaman dengan mudah bersama kami! 🚀
            </p>
            <Link
              href="/Map"
              className="inline-flex items-center gap-2 bg-[#C1FF9B] hover:bg-[#A8E689] text-black px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105"
            >
              Buka Peta Interaktif <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
