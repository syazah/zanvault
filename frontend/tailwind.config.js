/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#00712D",
        tertiary: "#859F3D",
      },
    },
  },
  plugins: [],
};
