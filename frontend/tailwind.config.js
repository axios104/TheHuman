/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'primary': '#0df2f2',
        'background-light': '#f5f8f8',
        'background-dark': '#101012', // Updated to match design
        'text-primary': '#F5F5F5',
        'text-secondary': '#888888',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
