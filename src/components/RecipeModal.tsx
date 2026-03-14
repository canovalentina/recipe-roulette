"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Youtube, ExternalLink, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecipeDetails, MealDetail } from "../../lib/mealdb";

interface RecipeModalProps {
  mealId: string | null;
  onClose: () => void;
}

export function RecipeModal({ mealId, onClose }: RecipeModalProps) {
  const [recipe, setRecipe] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mealId) {
      setRecipe(null);
      return;
    }

    setLoading(true);
    getRecipeDetails(mealId).then((data) => {
      setRecipe(data);
      setLoading(false);
    });
  }, [mealId]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (mealId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mealId]);

  if (!mealId) return null;

  // Extract ingredients and measures
  const ingredients: { name: string; measure: string }[] = [];
  if (recipe) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm cursor-pointer"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col pt-16 md:pt-0 pointer-events-auto z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur-md hover:bg-white text-brand-navy p-2 rounded-full transition-colors drop-shadow-sm"
          >
            <X size={24} />
          </button>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 min-h-[50vh]">
              <ChefHat className="text-brand-saffron animate-bounce w-16 h-16 mb-4" />
              <p className="text-brand-navy text-xl font-display animate-pulse">Fetching recipe...</p>
            </div>
          ) : recipe ? (
            <div className="flex-1 w-full flex flex-col md:flex-row overflow-y-auto md:overflow-hidden rounded-3xl min-h-0 bg-white">
              {/* Image Header / Sidebar */}
              <div className="md:w-[40%] bg-brand-cream relative shrink-0">
                <div className="aspect-square relative w-full md:absolute md:inset-0 md:h-full">
                  <Image
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white pt-24 pb-8">
                    <span className="bg-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block">
                      {recipe.strCategory}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display leading-tight">{recipe.strMeal}</h2>
                  </div>
                </div>
              </div>

              {/* Content area */}
              <div className="p-6 md:p-10 pb-20 md:pb-12 md:w-[60%] space-y-8 bg-white md:overflow-y-auto min-h-0">
                
                {/* Ingredients section */}
                <section>
                  <h3 className="text-2xl font-display text-brand-tomato mb-4 flex items-center gap-2">
                    <UtensilsIcon /> Ingredients
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ingredients.map((ing, idx) => (
                      <li key={idx} className="flex justify-between items-baseline border-b border-gray-100 py-1">
                        <span className="font-semibold text-brand-navy">{ing.name}</span>
                        <span className="text-gray-500 text-sm text-right">{ing.measure}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Instructions section */}
                <section>
                  <h3 className="text-2xl font-display text-brand-tomato mb-4 border-t border-gray-100 pt-6">
                    Instructions
                  </h3>
                  <div className="prose prose-brand max-w-none text-gray-700 space-y-4 whitespace-pre-line">
                    {recipe.strInstructions}
                  </div>
                </section>

                {/* External links */}
                <AuthzLinks recipe={recipe} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-center text-red-500">
              <p>Could not load the recipe.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function UtensilsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function AuthzLinks({ recipe }: { recipe: MealDetail }) {
  if (!recipe.strYoutube && !recipe.strSource) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-100 pb-4">
      {recipe.strYoutube && (
        <a
          href={recipe.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center"
        >
          <Youtube size={20} className="shrink-0" /> Watch on YouTube
        </a>
      )}
      {recipe.strSource && (
        <a
          href={recipe.strSource}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-brand-navy hover:text-white px-4 py-3 rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center cursor-pointer"
        >
          <ExternalLink size={20} className="shrink-0" /> Original Source
        </a>
      )}
    </div>
  );
}
