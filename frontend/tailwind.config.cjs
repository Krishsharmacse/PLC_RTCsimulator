/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",        // Deep dark background
        surface: "#1a1a1a",           // Elevation panel
        primary: "#10b981",           // Emerald (Modbus)
        secondary: "#6366f1",         // Indigo (S7Comm)
        campusYellow: "#facc15",      // Highlights
        alert: "#f43f5e",             // Pink-red alert
      },
    },
  },
  plugins: [],
}