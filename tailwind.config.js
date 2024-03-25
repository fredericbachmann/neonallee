/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./node_modules/flowbite-react/**/*.js', './app/**/*.{jsx,tsx}'],
  plugins: [require('flowbite/plugin')],
  theme: {
    colors: {
      highlight: '#e5b7de',
      background: '#e1f16b',
      'off-white': '#e6e6e6',
      gray_: '#272727',
      'profile-purple': '#590E44',
      'profile-blue': {
        500: '#0F00FF',
        400: '#8780FF',
        100: '#DEE2FE',
        200: '#2E5671',
      },
      'profile-yellow': {
        900: '#F0FE01',
        500: '#F0B351',
        400: '#FFDF58',
      },
    },
  },
}
