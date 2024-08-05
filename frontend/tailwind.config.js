/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 25s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
    },
    screens: {
      xl: { max: "1280px" },
      sm: { max: "600px" },
      lg: { max: "1024px" },
      md: { max: "800px" },
    },
  },
  plugins: [],
}