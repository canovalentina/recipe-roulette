"use client";

import { MealBase } from "../../lib/mealdb";
import { RecipeCard } from "./RecipeCard";

interface RecipeGridProps {
  recipes: MealBase[];
  onRecipeClick: (id: string) => void;
}

export function RecipeGrid({ recipes, onRecipeClick }: RecipeGridProps) {
  if (recipes.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <h2 className="text-2xl md:text-3xl font-display text-brand-navy text-center mb-6">
        Your Culinary Adventure Awaits
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            index={index}
            onClick={() => onRecipeClick(recipe.idMeal)}
          />
        ))}
      </div>
    </div>
  );
}
