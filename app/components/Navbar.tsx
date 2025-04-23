import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";

export default function Navbar() {
  return (
    <nav className="relative z-10">
      <div className="bg-[#C1FF9B] rounded-full mx-4 mt-4 px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-2xl font-black">SICHATAS</div>
          <div className="flex gap-4">
            <Link
              className="px-4 py-2 text-xl font-bold transition-colors duration-200 cursor-pointer "
              smooth={true}
              duration={500}
              to="home"
            >
              Home
            </Link>
            <Link
              className="px-4 py-2 text-xl font-bold transition-colors duration-200 cursor-pointer "
              smooth={true}
              duration={500}
              to="map"
            >
              Map
            </Link>
            <Link
              className="px-4 py-2 text-xl font-bold transition-colors duration-200 cursor-pointer "
              smooth={true}
              duration={500}
              to="data"
            >
              Data
            </Link>
            <Link
              className="px-4 py-2 text-xl font-bold transition-colors duration-200 cursor-pointer "
              smooth={true}
              duration={500}
              to="about"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
