/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './node_modules/flowbite-react/**/*.js',
    './app/**/*.{jsx,tsx}',
  ],
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {},
  plugins: [],
}

