# Recipe Roulette 🌍🍽️

A fun, interactive web application that randomly selects a country and fetches traditional recipes for you to try!

## Motivation
The idea behind this project was to create an engaging app to help discover and test different recipes on a weekly basis. Instead of wondering what to cook, just spin the globe, let fate decide your culinary destination, and get cooking!

## Features
- **Interactive Spinning Globe**: A 3D-styled animated globe that lands on a random country.
- **Recipe Discovery**: Fetches verified, traditional recipes from [TheMealDB API](https://www.themealdb.com/).
- **Detailed Instructions**: View the required ingredients, step-by-step cooking instructions, and even YouTube video tutorials directly in the app.
- **Responsive Design**: Beautiful, playful UI that works seamlessly across desktop and mobile devices.

## Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Globe & Maps**: D3.js (d3-geo), HTML5 Canvas, and `react-simple-maps`
- **Data Source**: [TheMealDB API](https://www.themealdb.com/api.php)

## Getting Started Locally

First, install the dependencies (if you haven't already) and then run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying

The app is a standard Next.js application, which means the easiest way to deploy it is by using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Simply push your code to a GitHub repository, link it to Vercel, and it will deploy instantly!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
