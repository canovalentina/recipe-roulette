export interface MealBase {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail extends MealBase {
  strInstructions: string;
  strYoutube: string | null;
  strSource: string | null;
  strArea: string;
  strCategory: string;
  [key: string]: string | null; // For strIngredient1-20 and strMeasure1-20
}

export async function getRecipesByArea(area: string): Promise<MealBase[]> {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`, {
      // Add cache options if appropriate, or revalidate
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.meals || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getRecipeDetails(id: string): Promise<MealDetail | null> {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch detail");
    const data = await res.json();
    if (!data.meals || data.meals.length === 0) return null;
    return data.meals[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getRandomRecipesByArea(area: string, count: number = 5): Promise<MealBase[]> {
  const allMeals = await getRecipesByArea(area);
  if (allMeals.length <= count) return allMeals;
  
  // Shuffle array and return subset
  const shuffled = [...allMeals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
