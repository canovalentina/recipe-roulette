"use client";

import { Search, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Country } from "../../lib/countries";

interface EmptyStateProps {
  country: Country;
}

export function EmptyState({ country }: EmptyStateProps) {
  const handleGoogleSearch = () => {
    const query = encodeURIComponent(`${country.name} traditional recipes`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/50 backdrop-blur-sm p-6 md:p-8 lg:p-12 border-2 border-dashed border-brand-orange/40 rounded-[2rem] text-center w-full max-w-2xl mx-auto shadow-inner h-full flex flex-col justify-center"
    >
      <div className="w-24 h-24 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center mb-6 text-brand-orange">
        <Map size={48} />
      </div>
      <h3 className="text-3xl font-display text-brand-navy mb-4">
        We're still exploring here!
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
        It looks like recipes for {country.name} aren't in our database yet. But don't let the adventure stop!
      </p>
      
      <button
        onClick={handleGoogleSearch}
        className="bg-white text-brand-navy border-2 border-brand-navy hover:bg-brand-navy hover:text-white transition-colors duration-300 font-bold py-4 px-8 rounded-full flex items-center gap-3 mx-auto shadow-sm"
      >
        <Search size={20} />
        Search Google for {country.name} recipes
      </button>
    </motion.div>
  );
}
