/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          saffron: "#F4B333",
          tomato: "#E63946",
          herb: "#2A9D8F",
          orange: "#F4A261",
          cream: "#FDFBF7",
          navy: "#1D3557",
        }
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito", "sans-serif"],
        display: ["var(--font-fredoka)", "Fredoka", "sans-serif"],
      }
    },
  },
  plugins: [],
};
