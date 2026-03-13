# Recipe Roulette 🌍🍽️

A fun, interactive web application that randomly selects a country and fetches traditional recipes for you to try!

## What We Built

The application was built as a single-page Next.js App using standard React hooks and Framer Motion for delightful animations. Here are the core features:

1. **Spinning Globe Animation**
   - The [SpinningGlobe] (../src/components/SpinningGlobe.tsx) uses D3's orthographic projection and HTML5 Canvas to render a beautiful 3D-looking spinning globe.
   - The [SpinButton] (../src/components/SpinButton.tsx) controls the 2.5 second spinning sequence and trigger a confetti celebration upon landing using `canvas-confetti`.

2. **Interactive Selection Display**
   - The [CountryDisplay](../src/components/CountryDisplay.tsx) highlights the selected country's flag and location.
   - Powered by `react-simple-maps`, the [CountryMap](../src/components/CountryMap.tsx) shows exactly where the country is located with a pin.

3. **Recipe Fetching via TheMealDB**
   - We mapped 250 countries to TheMealDB's 28 supported nationalities using a custom [mapping script](../scripts/generate-countries.mjs) storing the data in [lib/countries.ts](../lib/countries.ts).
   - If recipes exist, the app shuffles and displays up to 5 options in a [RecipeGrid](../src/components/RecipeGrid.tsx).

4. **Dynamic Empty States**
   - If the selected country isn't in TheMealDB, a playful [EmptyState](../src/components/EmptyState.tsx) appears, inviting the user to search Google for traditional recipes with one click.

5. **Full Recipe Modal**
   - Clicking a card opens the [RecipeModal](../src/components/RecipeModal.tsx), offering a responsive split-view of the meal image, ingredients (filtered from the raw API response), and instructions.
   - Quick links to YouTube video tutorials and the original source are offered if available!

## Design Aesthetics

The app uses a playful, vibrant aesthetic utilizing standard modern web practices:
- **Fonts:** "Nunito" for clean body text, paired with the rounded, friendly "Fredoka" for display headings.
- **Colors:** A curated palette of Saffron yellow, Tomato red, Herb green, Navy, and Cream.
- **Interactions:** Subtle hover lifts, gradient reveals, and bouncy spring animations via Framer Motion make simple actions feel alive.

## Technical Details

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3
- **Icons:** Lucide React
- **Data Source:** TheMealDB API (Free Tier)

## Verification
- Next.js build (`npm run build`) completed successfully with 0 errors.
- TypeScript compilation is successful.
- Linter checks passed.

---

## 🏗️ Technical Architecture & Stack

Recipe Roulette is built using a modern frontend stack. Here is how the different technologies and languages work together to create the final application:

### 1. **Next.js 14 (App Router)**
Next.js is the core React framework that powers the application. 
- **Role:** It handles the routing, server configuration, and the build process. Even though this app is a purely Client-Side Single Page Application (SPA), Next.js provides the infrastructure (Webpack, Babel/SWC) to bundle our files, manage static assets, and optimize images out-of-the-box.
- **Entry Point:** The application starts at `src/app/layout.tsx` (which sets up the HTML shell and fonts) and `src/app/page.tsx` (which holds the main UI logic).

### 2. **TypeScript (TSX/TS)**
TypeScript is a superset of JavaScript that adds static typing.
- **Role:** It ensures our code is predictable and catches errors during development instead of at runtime. 
- **How it works here:** Throughout the `lib/` and `src/components/` folders, we define `interfaces` (like `MealDetail` or `Country`). When we pass data between the API (`lib/mealdb.ts`) and our React components, TypeScript guarantees that the components receive exactly the data fields they expect (e.g., `strMeal`, `strInstructions`). 

### 3. **React 18**
React is a JavaScript library for building user interfaces.
- **Role:** It allows us to build encapsulated "Components" that manage their own state.
- **How it works here:** We use React Hooks like `useState` (to track if the globe is spinning, or which recipes are loaded) and `useEffect` (to trigger fetching data when a meal is selected). Every file ending in `.tsx` under `src/components/` is a React component. 

### 4. **Tailwind CSS v3**
Tailwind is a utility-first CSS framework.
- **Role:** Instead of writing custom CSS files, we style our components by applying pre-existing utility classes directly in our TSX (e.g., `className="flex flex-col items-center"`).
- **How it works here:** Tailwind scans our `.tsx` files, finds all the classes we used, and generates a minimal CSS file bridging our design. We customized the theme in `tailwind.config.js` and `src/app/globals.css` to include our specific brand colors (Saffron, Tomato, Navy) and fonts (Nunito, Fredoka).

### 5. **Framer Motion**
Framer Motion is a production-ready motion library for React.
- **Role:** It powers the smooth, physics-based animations seen throughout the app.
- **How it works here:** By replacing standard HTML tags with `<motion.div>` or `<motion.button>`, we easily add entrance animations (`initial`, `animate`), hover effects (`whileHover`), and exit animations (`AnimatePresence`) without relying on complex CSS keyframes.

### 6. **D3 (d3-geo) & HTML5 Canvas**
D3 is a JavaScript library for manipulating documents based on data.
- **Role:** D3 does the heavy mathematical lifting to project a 3D sphere onto a 2D screen. 
- **How it works here:** In `SpinningGlobe.tsx`, `d3.geoOrthographic()` calculates exactly how the lines of a globe should curve. We then use a native HTML `<canvas>` to rapidly draw and rotate those curved lines 60 times a second, creating the illusion of a spinning 3D globe.

### 7. **React Simple Maps**
A wrapper around D3 specifically built for React.
- **Role:** It renders the interactive flat map displayed after a country is selected.
- **How it works here:** In `CountryMap.tsx`, it takes TopoJSON data (a format that encodes geographic shapes) and renders SVG paths for every country in the world, allowing us to easily drop a `<Marker>` pin on the coordinates of our selected country.

---

## 📂 Project Structure

Here is a detailed breakdown of the repository structure:

\`\`\`text
recipe-roulette/
├── lib/                        # Core Data & API Logic (Data Layer)
│   ├── countries.ts            # Hardcoded array mapping 250 countries to MealDB areas
│   └── mealdb.ts               # API fetch functions & TypeScript interfaces for TheMealDB
│
├── scripts/                    # Build / Utility Scripts
│   └── generate-countries.mjs  # A Node.js script used once to generate lib/countries.ts
│
├── src/                        
│   ├── app/                    # Next.js App Router (Routing & Layouts)
│   │   ├── globals.css         # Global Tailwind imports and base styles
│   │   ├── layout.tsx          # The HTML shell, global fonts, and metadata
│   │   └── page.tsx            # The MAIN application file pulling everything together
│   │
│   └── components/             # Reusable React UI Elements (Presentation Layer)
│       ├── CountryDisplay.tsx  # Shows the selected country name, flag, and map
│       ├── CountryMap.tsx      # Renders the SVG topology map using react-simple-maps
│       ├── EmptyState.tsx      # The fallback UI shown if a country has no recipes
│       ├── LoadingState.tsx    # The "Simmering..." loading spinner
│       ├── RecipeCard.tsx      # Individual square recipe card with image & hover effects
│       ├── RecipeGrid.tsx      # The CSS Grid layout wrapping multiple RecipeCards
│       ├── RecipeModal.tsx     # The popup overlay showing full instructions & ingredients
│       ├── SpinButton.tsx      # The main trigger button logic
│       └── SpinningGlobe.tsx   # The D3 Canvas spinning globe animation
│
├── tailwind.config.js          # Tailwind styling configuration (colors, fonts)
├── next.config.js              # Next.js settings (allowing external images from TheMealDB)
└── package.json                # Project dependencies and npm scripts
\`\`\`

## 🔄 The Application Flow (How it all connects)

1. **User interaction:** The user opens the app and clicks the `SpinButton` in `page.tsx`.
2. **State changes:** `page.tsx` updates its React state (`isSpinning = true`). 
3. **Animation triggers:** The state change causes the `SpinningGlobe` component to dramatically increase its rotation speed.
4. **Data Selection:** After 2.5 seconds, Javascript picks a random item from the `lib/countries.ts` list.
5. **API Fetch:** If that country has a mapped `mealDbArea` (e.g., "Italian"), `page.tsx` calls `getRandomRecipesByArea` from `lib/mealdb.ts`. Note: This happens purely in the client browser.
6. **Rendering Results:** 
   - The UI updates, firing confetti.
   - The `CountryDisplay` component renders, passing coordinates to `CountryMap` to draw the pin.
   - The raw JSON recipe data from the API is passed into `RecipeGrid`, which loops through the array and renders a `RecipeCard` for each meal.
7. **Deep Dive:** If the user clicks a `RecipeCard`, it sets the `selectedRecipe` state. The App passes the ID to `RecipeModal`, which makes a final API call to fetch exactly how to cook the meal!
