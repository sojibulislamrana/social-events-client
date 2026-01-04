import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#22c55e",      // Fresh Green - Nature & Growth
          "secondary": "#84cc16",     // Lime Green - Energy & Freshness
          "accent": "#16a34a",        // Forest Green - Deep Nature
          "neutral": "#78716c",       // Earthy Brown - Natural & Grounded
          "base-100": "#fefdfb",      // Warm White - Natural
          "base-200": "#f5f5f0",      // Soft Beige
          "base-300": "#e8e6e1",      // Light Earthy
          "base-content": "#1c1917",  // Dark Earthy
          "info": "#22c55e",
          "success": "#16a34a",
          "warning": "#eab308",
          "error": "#dc2626",
        },
        dark: {
          "primary": "#4ade80",      // Bright Fresh Green
          "secondary": "#a3e635",     // Vibrant Lime
          "accent": "#22c55e",        // Fresh Green
          "neutral": "#a8a29e",       // Light Earthy
          "base-100": "#1c1917",      // Dark Earthy
          "base-200": "#292524",      // Darker Earthy
          "base-300": "#44403c",      // Medium Earthy
          "base-content": "#f5f5f0",  // Light Natural
          "info": "#4ade80",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
};

