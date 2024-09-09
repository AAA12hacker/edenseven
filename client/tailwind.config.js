module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' for using prefers-color-scheme
  theme: {
    extend: {
      colors: {
        light: {
          navbg: "#f3f4f6", // light gray background for navbar
          nav: "#1f2937", // dark gray for navbar text
          background: "#ffffff", // white background
          text: "#111827", // black text
          heading: "#374151", // dark gray for headings
          button1: "#60a5fa", // blue button
          button1h: "#3b82f6", // darker blue on hover
          button2: "#e5e7eb", // very light gray button
          button2h: "#d1d5db", // light gray on hover
          border: "#d1d5db", // light gray border
        },
        dark: {
          navbg: "#000000", // black
          nav: "#f97316",
          background: "#111827", // gray-900
          text: "#ffffff", // white
          heading: "#ffdab9", // orange-100
          button1: "#f97316", // orange-500
          button1h: "#ea580c", // orange-600
          button2: "#374151", // gray-700
          button2h: "#4b5563", // gray-600
          border: "#4b5563",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
