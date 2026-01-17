/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-green': '#073f35',
        'red-1': '#b12524',
        'red-2': '#c53c3c',
        'green': '#7e9751',
        'beige': '#fef1d6',
        'off-white-1': '#e3dece',
        'off-white-2': '#d2c5ac',
        'hero-beige': '#F5F1ED',
        'hero-gray': '#E8E8E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        brand: ['Satisfy', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
}
