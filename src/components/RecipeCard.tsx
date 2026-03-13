"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MealBase } from "../../lib/mealdb";

interface RecipeCardProps {
  recipe: MealBase;
  onClick: () => void;
  index: number;
}

export function RecipeCard({ recipe, onClick, index }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border-2 border-transparent hover:border-brand-saffron transition-all duration-300"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-bold tracking-wide text-sm bg-brand-tomato px-3 py-1 rounded-full uppercase">
            View Recipe
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-brand-navy leading-tight line-clamp-2">
          {recipe.strMeal}
        </h3>
      </div>
    </motion.div>
  );
}
