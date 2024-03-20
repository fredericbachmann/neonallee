/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./node_modules/flowbite-react/**/*.js', './app/**/*.{jsx,tsx}'],
  plugins: [require('flowbite/plugin')],
  theme: {
    colors: {
      'light-purple': '#e5b7de',
      'yellow-green': '#e1f16b',
      'off-white': '#e6e6e6',
      'profile-purple': '#590E44',
      'profile-blue': {
        100: '#DEE2FE',
        200: '#2E5671',
      },
      'profile-yellow': {
        500: '#F0B351',
        400: '#FFDF58',
      },
    },
  },
}
