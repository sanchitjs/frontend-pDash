/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      screens: {
        "14inch" : "1280px",
        "second" : "1900px",
        "third" : "2300px",
      }
    },
  },
  plugins: [],
}