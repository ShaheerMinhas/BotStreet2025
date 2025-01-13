/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    'white': '#ffffff',
    'purple': '#7D1B77',
    'midnight': '#121063',
    'metal': '#565584',
    'tahiti': '#3ab7bf',
    'silver': '#ecebff',
    'bubble-gum': '#ff77e9',
    'bermuda': '#78dcca',
  },
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
]
}