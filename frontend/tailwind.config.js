/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green:        '#047857',
          'green-dark': '#065f46',
          'green-deep': '#064e3b',
          gold:         '#f59e0b',
          'gold-dark':  '#d97706',
        }
      }
    },
  },
  plugins: [],
}

