"use client";

import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

interface SpinButtonProps {
  onClick: () => void;
  isSpinning: boolean;
}

export function SpinButton({ onClick, isSpinning }: SpinButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isSpinning}
      onClick={onClick}
      className={`
        relative overflow-hidden group font-display font-bold text-2xl px-10 py-5 rounded-full
        transition-all duration-300 shadow-[0_8px_0_0_#b91c1c] active:shadow-[0_0px_0_0_#b91c1c] active:translate-y-2
        ${
          isSpinning
            ? "bg-gray-400 text-gray-200 shadow-[0_0px_0_0_#6b7280] translate-y-2 cursor-not-allowed"
            : "bg-brand-tomato text-white hover:bg-red-500"
        }
      `}
    >
      <div className="absolute inset-0 bg-white/20 w-0 group-hover:w-full transition-all duration-300 ease-out skew-x-[-20deg] origin-left z-0" />
      <span className="relative z-10 flex items-center gap-3">
        {isSpinning ? "Spinning..." : "SPIN THE GLOBE!"}
        {!isSpinning && <Utensils className="w-6 h-6 animate-pulse" />}
      </span>
    </motion.button>
  );
}
