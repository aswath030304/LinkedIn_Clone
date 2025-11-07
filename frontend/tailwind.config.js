/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: "#ffffff",
      black: "#000000",
      primary: "#5C6BC0",
      accent: "#7E57C2",
      bgLight: "#F3F4F6",
      gray: {
        100: "#f5f5f5",
        200: "#e5e5e5",
        500: "#737373",
        700: "#404040",
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
