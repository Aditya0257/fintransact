/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        90: "22.5rem", // 90 divided by 4 gives 22.5rem if 1rem equals 4px
        100: "25rem",
      },
      maxHeight: {
        90: "22.5rem", // 90 divided by 4 gives 22.5rem if 1rem equals 4px
        100: "25rem",
      },
    },
  },
  plugins: [],
};
