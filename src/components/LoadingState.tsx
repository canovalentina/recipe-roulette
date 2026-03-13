"use client";

import { Utensils } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-brand-navy min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="text-brand-saffron bg-white p-4 rounded-full shadow-lg border-2 border-brand-orange/20 mb-6"
      >
        <Utensils size={48} />
      </motion.div>
      <h3 className="text-2xl font-display font-medium mb-2">Simmering...</h3>
      <p className="text-gray-500">Checking the world's cookbooks for the best recipes!</p>
    </div>
  );
}
