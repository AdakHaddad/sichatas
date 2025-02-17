"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Leaflet Map as Background */}
      <div className="absolute inset-0 z-0 filter blur-md brightness-75">
        <MapContainer
          style={{ height: "100vh", width: "100vw" }}
          className="pointer-events-none" // Prevents interaction with the map
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="bg-[#C1FF9B] rounded-full mx-4 mt-4 px-8 py-4 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-2xl font-black">SICHATAS</div>
            <div className="flex gap-12 text-xl font-bold">
              <a href="#map" className="hover:opacity-70">
                Map
              </a>
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
      <div className="relative z-10 flex justify-between items-center max-w-7xl mx-auto px-8 pt-20">
        <div className="max-w-2xl">
          <h1 className="text-white text-6xl font-bold leading-tight drop-shadow-lg">
            Sistem Perencanaan <span className="block">Pembangunan</span>{" "}
            <span className="block">Bangunan Hunian</span>{" "}
            <span className="block">Strategis dan Sehat</span>{" "}
            <span className="block">berbasis GIS</span>{" "}
            <span className="block">(SICATHAS)</span>
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl max-w-xl">
          <p className="text-xl mb-6">
            Temukan lokasi hunian ideal dengan SICATHAS – sistem berbasis
            Geographic Information System (GIS) yang membantu Anda merencanakan
            pembangunan hunian yang sehat, strategis, dan berkelanjutan.
          </p>
          <p className="text-xl">
            Dapatkan hunian yang aman, nyaman dengan mudah bersama kami! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
