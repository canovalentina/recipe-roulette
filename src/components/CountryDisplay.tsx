"use client";

import { motion } from "framer-motion";
import { Country } from "../../lib/countries";
import { CountryMap } from "./CountryMap";
import { MapPin } from "lucide-react";

interface CountryDisplayProps {
  country: Country;
}

export function CountryDisplay({ country }: CountryDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border-2 border-brand-cream w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-center">
        {/* Left Side: Info */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="text-6xl md:text-7xl lg:text-8xl inline-block drop-shadow-md"
          >
            {country.flag}
          </motion.div>
          
          <div>
            <h2 className="text-sm font-bold tracking-widest text-brand-orange uppercase mb-1 flex items-center justify-center sm:justify-start gap-1">
              <MapPin size={16} /> Destination Unlocked
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-brand-navy font-display leading-tight">
              {country.name}
            </h1>
          </div>
          
          <p className="text-gray-500 text-base md:text-lg max-w-sm mx-auto sm:mx-0">
            {country.mealDbArea 
              ? `Get ready for some amazing ${country.mealDbArea} cuisine!` 
              : `A beautiful country! Let's see what we can find.`}
          </p>
        </div>

        {/* Right Side: Map */}
        <div className="flex-1 w-full aspect-square max-h-[300px] md:max-h-[400px]">
          <CountryMap country={country} />
        </div>
      </div>
    </motion.div>
  );
}
