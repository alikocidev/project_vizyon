import forms from "@tailwindcss/forms";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          primary: "#F7F2EB", // Main light background
          secondary: "#FFF2D7", // Secondary light background
          surface: "#dbdbdb", // Light surface color
          text: "#111216", // Dark text on light background
        },

        // Dark theme colors
        dark: {
          primary: "#111216", // Main dark background
          secondary: "#0F0E0E", // Secondary dark background
          surface: "#1e2029", // Dark surface color
          text: "#F7F2EB", // Light text on dark background
        },

        // Primary brand colors (blue theme)
        primary: "#1e284d",

        // Secondary accent colors (rose/red theme)
        secondary: "#c76f6c",

        // Neutral colors (gray theme)
        neutral: {
          50: "#f6f7f9",
          100: "#ecedf2",
          200: "#d5d9e2",
          300: "#b0b7c9",
          400: "#858fab",
          500: "#667291", // Main neutral color
          600: "#515b78",
          700: "#434961",
          800: "#3a4052",
          900: "#343846",
          950: "#1e2029",
        },

        // Accent color for highlights
        accent: "#FF3D00",
      },
      backgroundImage: {
        "linear-light": "linear-gradient(to right, #12c2e9, #c471ed, #f64f59);",
        "linear-dark": "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d);",
        "fade-light": "linear-gradient(to right, rgba(255, 255, 255, 0) 0, #F7F2EB 100%)",
        "fade-dark": "linear-gradient(to right, rgba(0, 0, 0, 0) 0, #0F0E0E 100%)",
        "fade-primary": "linear-gradient(to right, rgba(0, 0, 0, 0) 0, #1e284d 100%)",
        "primary-gradient": "linear-gradient(to right, #5185e0, #3356c2)",
        "secondary-gradient": "linear-gradient(to right, #c76f6c, #944341)",
        "accent-gradient": "linear-gradient(to right, #5185e0, #c76f6c)",
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
