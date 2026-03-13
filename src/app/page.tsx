"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { COUNTRIES, Country } from "../../lib/countries";
import { getRandomRecipesByArea, MealBase } from "../../lib/mealdb";
import { SpinningGlobe } from "../components/SpinningGlobe";
import { SpinButton } from "../components/SpinButton";
import { CountryDisplay } from "../components/CountryDisplay";
import { RecipeGrid } from "../components/RecipeGrid";
import { RecipeModal } from "../components/RecipeModal";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { motion, AnimatePresence } from "framer-motion";

const RECIPES_LIMIT = 12;
const PROBABILITY_MEAL_DB_COUNTRY = 0.7

export default function Home() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [recipes, setRecipes] = useState<MealBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const handleSpin = () => {
    setIsSpinning(true);
    setSelectedCountry(null);
    setRecipes([]);
    
    // Spin for 2.5 seconds
    setTimeout(async () => {
      setIsSpinning(false);
      
      // PROBABILITY_MEAL_DB_COUNTRY chance to pick a country with recipes, 1 - PROBABILITY_MEAL_DB_COUNTRY chance for true random
      let country: Country;
      if (Math.random() < PROBABILITY_MEAL_DB_COUNTRY) {
        const supportedCountries = COUNTRIES.filter(c => c.mealDbArea !== null);
        const randomIdx = Math.floor(Math.random() * supportedCountries.length);
        country = supportedCountries[randomIdx];
      } else {
        const randomIdx = Math.floor(Math.random() * COUNTRIES.length);
        country = COUNTRIES[randomIdx];
      }
      setSelectedCountry(country);
      
      // Shoot confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F4B333', '#E63946', '#2A9D8F']
      });

      if (country.mealDbArea) {
        // Fetch recipes
        setLoading(true);
        const randomRecipes = await getRandomRecipesByArea(country.mealDbArea, RECIPES_LIMIT);
        setRecipes(randomRecipes);
        setLoading(false);
      }
    }, 2500);
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      {/* Decorative background vectors */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-saffron/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-tomato/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 pt-12 text-center relative z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <h1 className="text-6xl md:text-8xl text-brand-tomato font-display mb-4 drop-shadow-md">
            Recipe Roulette
          </h1>
          <p className="text-xl md:text-2xl text-brand-navy/80 font-medium mb-12 max-w-2xl mx-auto">
            Spin the globe and let fate decide what you're cooking next!
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center gap-12 max-w-5xl mx-auto w-full">
          
          {/* Results Area (Appears on top when country is selected) */}
          <AnimatePresence mode="wait">
            {selectedCountry && !isSpinning && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                className="w-full space-y-8 mt-4"
              >
                <CountryDisplay country={selectedCountry} />
                
                {loading ? (
                  <LoadingState />
                ) : selectedCountry.mealDbArea && recipes.length > 0 ? (
                  <RecipeGrid recipes={recipes} onRecipeClick={setSelectedRecipe} />
                ) : (
                  <EmptyState country={selectedCountry} />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Area (Always visible, moves down when results appear) */}
          <motion.div 
            layout
            className="flex flex-col items-center justify-center gap-6"
          >
            <SpinningGlobe isSpinning={isSpinning} />
            <SpinButton onClick={handleSpin} isSpinning={isSpinning} />
          </motion.div>

        </div>
      </div>

      <RecipeModal mealId={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </main>
  );
}
