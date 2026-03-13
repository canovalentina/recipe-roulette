Build me a fun web app called **"Recipe Roulette"** — a random country cuisine generator for weekly cooking adventures.

## Core Functionality

1. **Spinning Globe Animation + Random Country Button**: 
   - A big, satisfying "SPIN" button that triggers an **animated 3D globe** (or stylized 2D globe) that spins dramatically before landing on a random country
   - The globe should rotate/spin for 2-3 seconds with easing, then slow down and "land" on the selected country
   - Consider libraries like `react-globe.gl`, `three.js` with a globe, or a creative CSS/SVG animation
   - Make it feel like a game show wheel or slot machine — the anticipation is part of the fun!

2. **Country Display**: After the globe lands, show:
   - The country name and flag emoji or image
   - **An interactive map** zooming into the country's location (use `react-simple-maps` or `leaflet`)
   
3. **Recipe Display**: 
   - Fetch **5 lunch/dinner recipes** from TheMealDB API
   - If the country isn't available in TheMealDB, show a friendly **"Recipes not available yet!"** message with a **"Search Google for {Country} recipes"** button that opens a Google search in a new tab

4. **Recipe Cards**: Each recipe should show:
   - Recipe name (`strMeal`)
   - Recipe image (`strMealThumb`)
   - Click to view details — either:
     - **Option A**: Open a modal/drawer with full instructions (`strInstructions`) and ingredients (`strIngredient1-20`, `strMeasure1-20`)
     - **Option B**: Link to YouTube video if available (`strYoutube`)
     - **Option C**: Link to original source if available (`strSource`)

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **Map library**: `react-simple-maps` (lightweight) or `react-leaflet` (more features)
- Deploy to **Vercel** (no backend needed — all client-side!)

## Recipe Data Source: TheMealDB API

Free API, no key needed:
- Base URL: `https://www.themealdb.com/api/json/v1/1/`
- Filter by area: `filter.php?a={area}` (e.g., `filter.php?a=Italian`) — returns basic meal list
- Get meal details: `lookup.php?i={meal_id}` — returns FULL recipe details
- **Supported cuisines**: American, British, Canadian, Chinese, Croatian, Dutch, Egyptian, Filipino, French, Greek, Indian, Irish, Italian, Jamaican, Japanese, Kenyan, Malaysian, Mexican, Moroccan, Polish, Portuguese, Russian, Spanish, Thai, Tunisian, Turkish, Ukrainian, Vietnamese

### API Response Structure
The `filter.php` endpoint returns minimal data (just `idMeal`, `strMeal`, `strMealThumb`).
You need to call `lookup.php?i={idMeal}` to get full details including:
```typescript
{
  idMeal: string;
  strMeal: string;           // Recipe name
  strMealThumb: string;      // Image URL
  strInstructions: string;   // Full cooking instructions
  strYoutube: string | null; // YouTube video link (if available)
  strSource: string | null;  // Original recipe URL (if available)
  strIngredient1-20: string; // Ingredients (up to 20)
  strMeasure1-20: string;    // Measurements (up to 20)
  strArea: string;           // Cuisine/country
  strCategory: string;       // Category (e.g., "Seafood", "Vegetarian")
}
```

**Handling unsupported countries:**
- The random selector should include ALL world countries (for fun discovery!)
- When a country isn't in TheMealDB, show a friendly empty state:
  - Message: "Recipes for {Country} aren't in our database yet!"
  - Button: "Search Google for {Country} recipes →" 
  - Link format: `https://www.google.com/search?q={Country}+traditional+recipes`
- Make the empty state feel fun, not like an error — it's an adventure!

## Design Style: Colorful & Playful

Create a **joyful, vibrant interface** that makes cooking feel like an adventure:

### Visual Direction
- **Color palette**: Bold, appetizing colors — think saffron yellows, tomato reds, herb greens, warm oranges. Use gradients playfully.
- **Typography**: Fun, characterful fonts. A playful display font for headings (try Google Fonts: Fredoka, Baloo 2, Nunito, or Quicksand) paired with a clean readable body font.
- **The button**: Make it DELIGHTFUL to press! Think: 
  - Satisfying hover/click animations
  - Maybe a slot-machine or dice-roll effect when generating
  - Confetti or sparkles on selection
- **The map**: Style it to match the playful vibe — maybe custom colors, smooth zoom animations when a country is selected
- **Layout**: Cards with rounded corners, subtle shadows, maybe slight rotation/tilt for playfulness
- **Micro-interactions**: Hover effects on recipe cards, smooth transitions, loading states that spark joy
- **Empty state**: Make "country not available" feel like part of the adventure, not a dead end — playful illustration or emoji, encouraging copy, clear Google search CTA

### Vibe References
Think: a playful cooking show meets a fun travel app. It should feel exciting to discover what country you'll cook from this week!

## Page Structure

```
/                   → Main page with the generator
```

Keep it simple — single page app!

## Component Ideas

- `SpinningGlobe` — The star of the show! Animated globe that spins and lands on a country
- `SpinButton` — Triggers the globe animation
- `CountryDisplay` — Shows selected country with flag and name
- `CountryMap` — Interactive map highlighting/zooming to the selected country
- `RecipeGrid` — Grid of recipe cards
- `RecipeCard` — Individual recipe with image, name, click to view details
- `RecipeModal` — Modal/drawer showing full recipe: instructions, ingredients, YouTube link
- `EmptyState` — Friendly fallback with Google search link
- `LoadingState` — Fun loading animation while fetching

## Country Data & MealDB Mapping

**This is important!** You need to map country names to TheMealDB's "area" names.

### Getting TheMealDB's supported areas
Fetch the list of available cuisines from:
```
https://www.themealdb.com/api/json/v1/1/list.php?a=list
```
This returns all supported areas (e.g., "Italian", "Japanese", "Mexican", etc.)

### Country-to-Area Mapping
Create a `countries.ts` file with ALL world countries containing:
- `name`: Country name (e.g., "Italy")
- `flag`: Flag emoji (e.g., "🇮🇹")
- `coordinates`: `[lat, lng]` for map centering (e.g., `[42.5, 12.5]`)
- `mealDbArea`: The MealDB area name OR `null` if not supported

**Mapping examples:**
```typescript
{ name: "Italy", flag: "🇮🇹", coordinates: [42.5, 12.5], mealDbArea: "Italian" },
{ name: "Japan", flag: "🇯🇵", coordinates: [36.2, 138.2], mealDbArea: "Japanese" },
{ name: "United States", flag: "🇺🇸", coordinates: [37.1, -95.7], mealDbArea: "American" },
{ name: "United Kingdom", flag: "🇬🇧", coordinates: [55.4, -3.4], mealDbArea: "British" },
{ name: "Ethiopia", flag: "🇪🇹", coordinates: [9.1, 40.5], mealDbArea: null },  // Not in MealDB
{ name: "Peru", flag: "🇵🇪", coordinates: [-9.2, -75.0], mealDbArea: null },    // Not in MealDB
```

**Known MealDB areas** (fetch fresh from the API, but these are typically available):
American, British, Canadian, Chinese, Croatian, Dutch, Egyptian, Filipino, French, Greek, Indian, Irish, Italian, Jamaican, Japanese, Kenyan, Malaysian, Mexican, Moroccan, Polish, Portuguese, Russian, Spanish, Thai, Tunisian, Turkish, Ukrainian, Vietnamese

**Data sources for countries:**
- Use `world-countries` npm package, or
- Create a curated JSON/TS file with ~195 countries
- Coordinates can come from `countries-list` or similar packages

## Nice-to-Haves (if you want to keep vibing)

- [ ] "Spin again" button after a country is selected
- [ ] History of previously selected countries (localStorage)
- [ ] Filter to exclude countries you've already cooked
- [ ] Click directly on the map to select a country
- [ ] "Only show countries with recipes" toggle
- [ ] Save/favorite recipes for later
- [ ] Sound effects on spin (whoosh, ding!) — make toggleable

## File Structure Suggestion

```
recipe-roulette/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── SpinningGlobe.tsx     (animated globe component)
│   ├── SpinButton.tsx
│   ├── CountryDisplay.tsx
│   ├── CountryMap.tsx
│   ├── RecipeGrid.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeModal.tsx       (full recipe details view)
│   └── EmptyState.tsx
├── lib/
│   ├── mealdb.ts             (TheMealDB API helpers)
│   ├── countries.ts          (Country data with coordinates + MealDB mapping)
│   └── types.ts              (TypeScript interfaces)
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Deployment

This is fully client-side, so Vercel deployment is straightforward:
- No environment variables needed
- No serverless functions required
- Just push to GitHub and connect to Vercel, or run `vercel deploy`

---

## Let's go! Start by setting up the Next.js project with TypeScript and Tailwind, then build out the main page with the spin button and country display.