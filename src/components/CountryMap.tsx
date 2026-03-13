"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Country } from "../../lib/countries";

// URL to a topojson map of the world
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryMapProps {
  country: Country;
}

export function CountryMap({ country }: CountryMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-blue-50/50 animate-pulse rounded-2xl" />;

  // Note: D3 coordinates are [longitude, latitude], while typical maps often give [latitude, longitude].
  // Assuming the countries library provides [latitude, longitude].
  const [lat, lng] = country.coordinates;
  const coordinates: [number, number] = [lng, lat]; // Flip for D3

  return (
    <div className="w-full h-full min-h-[300px] bg-sky-100 rounded-3xl overflow-hidden border-4 border-white shadow-inner relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
        }}
        className="w-full h-full outline-none"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // Highlight the selected country if it matches. This relies on the topojson IDs or names.
              // For simplicity, we just draw all countries generic, and add a big marker.
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#E2E8F0"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  className="outline-none"
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#CBD5E1" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
        <Marker coordinates={coordinates}>
          <g transform="translate(-12, -24)">
            <path
              d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"
              fill="#E63946"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx="12" cy="10" r="3" fill="#FFFFFF" />
          </g>
        </Marker>
      </ComposableMap>
      
      {/* Decorative overlaid gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-200/50 to-transparent pointer-events-none" />
    </div>
  );
}
