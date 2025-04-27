"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Add this import
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL from "@urbica/react-map-gl";
import { ArrowRight, Map, Lightbulb } from "lucide-react";

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
    <div className="">
      <MapGL
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
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logoWOI.png"
              alt="SICHATAS Logo"
              width={50}
              height={50}
            />
            <span className="text-xl font-bold">SICHATAS</span>
          </div>
          <nav>
            <ul className="flex gap-8 font-medium">
              <li>
                <Link href="#" className="hover:text-blue-800">
                  BERANDA
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-800">
                  FITUR
                </Link>
              </li>
              <li>
                <Link href="/Map" className="hover:text-blue-800">
                  MAP
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-800">
                  DATA
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0A2A45] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Sistem Perencanaan Pembangunan Bangunan Hunian Strategis dan Sehat
              berbasis GIS
            </h1>
            <p className="text-lg mb-8">
              Temukan lokasi hunian ideal dengan SICATHAS – sistem berbasis
              Geographic Information System (GIS) yang membantu Anda
              merencanakan pembangunan hunian yang sehat, strategis, dan
              berkelanjutan.
            </p>
            <div className="flex justify-end">
              <Link
                href="/Map"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded shadow-md hover:bg-gray-300 transition-colors"
              >
                Lihat Peta Interaktif
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-white" id="map">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <BackgroundMap />
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 flex items-center justify-center mb-4">
                  <Map size={64} className="text-[#0A2A45]" />
                </div>
                <h3 className="font-semibold text-lg">Peta Interaktif</h3>
                <p className="text-gray-600 mt-2">
                  Jelajahi peta dengan fitur interaktif
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 flex items-center justify-center mb-4">
                  <ArrowRight size={64} className="text-[#0A2A45]" />
                </div>
                <h3 className="font-semibold text-lg">Hunian Berkelanjutan</h3>
                <p className="text-gray-600 mt-2">
                  Solusi hunian yang ramah lingkungan
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 flex items-center justify-center mb-4">
                  <Lightbulb size={64} className="text-[#0A2A45]" />
                </div>
                <h3 className="font-semibold text-lg">Solusi Inovatif</h3>
                <p className="text-gray-600 mt-2">
                  Pendekatan modern untuk perencanaan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Image
                src="/logoWOI.png"
                alt="SICHATAS Logo"
                width={50}
                height={50}
              />
              <span className="font-semibold">SICHATAS</span>
            </div>
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} SICHATAS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
