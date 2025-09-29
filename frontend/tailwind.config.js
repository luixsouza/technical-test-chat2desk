/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#303cfc",
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c1c6ff",
          300: "#a2aaff",
          400: "#838dfe",
          500: "#303cfc",
          600: "#2734f0",
          700: "#202bd1",
          800: "#1a23ac",
          900: "#141c89",
        },
      },
    },
  },
  plugins: [],
};
