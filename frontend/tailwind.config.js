import forms from "@tailwindcss/forms";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dbdbdb: "#dbdbdb",
        111216: "#111216",
        "0F0E0E": "#0F0E0E",
        F7F2EB: "#F7F2EB",
        FFF2D7: "#FFF2D7",
        FF3D00: "#FF3D00",
        lotus: {
          50: "#fbf5f5",
          100: "#f7e9e9",
          200: "#f2d7d6",
          300: "#e7bbba",
          400: "#d89391",
          500: "#c76f6c",
          600: "#b15451",
          700: "#944341",
          800: "#803d3b",
          900: "#683634",
          950: "#371918",
        },
        royal: {
          50: "#f1f6fd",
          100: "#dfebfa",
          200: "#c6dbf7",
          300: "#9fc5f1",
          400: "#72a6e8",
          500: "#5185e0",
          600: "#3c6ad4",
          700: "#3356c2",
          800: "#334eac",
          900: "#2b3f7d",
          950: "#1e284d",
        },
        shark: {
          50: "#f6f7f9",
          100: "#ecedf2",
          200: "#d5d9e2",
          300: "#b0b7c9",
          400: "#858fab",
          500: "#667291",
          600: "#515b78",
          700: "#434961",
          800: "#3a4052",
          900: "#343846",
          950: "#1e2029",
        },
        "copper-rose": {
          50: "#faf7ef",
          100: "#f5f0e2",
          200: "#ece1df",
          300: "#ddc7c4",
          400: "#caa6a2",
          500: "#b38380",
          600: "#996362",
          700: "#805051",
          800: "#6d4446",
          900: "#5e3d3f",
          950: "#331e1f",
        },
      },
      backgroundImage: {
        "linear-light": "linear-gradient(to right, #12c2e9, #c471ed, #f64f59);",
        "linear-dark": "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d);",
        "fade-light": "linear-gradient(to right, rgba(255, 255, 255, 0) 0, #F7F2EB 100%)",
        "fade-dark": "linear-gradient(to right, rgba(0, 0, 0, 0) 0, #111216 100%)",
        "fade-royal": "linear-gradient(to right, rgba(0, 0, 0, 0) 0, #1e284d 100%)",
        "linear-1": "linear-gradient(to right, #00467f, #a5cc82)",
        "linear-2": "linear-gradient(to right, #bbd2c5, #536976, #292e49)",
        "linear-3": "linear-gradient(to right, #0052d4, #4364f7, #6fb1fc)",
      },
      animation: {
        "fade-in": "fadeIn .5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "75%" },
          "100%": { opacity: "1" },
        },
      },
    },
  },

  plugins: [
    forms,
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-hide::-webkit-scrollbar": { display: "none" },
        ".scrollbar-hide": {
          "scrollbar-width": "none",
          "-ms-overflow-style": "none",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
