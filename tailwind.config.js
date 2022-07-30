const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./resources/views/**/*.edge', './resources/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'primary': {
          'base': '#ff6944',
          'variation-1': '#f9b666',
          'variation-2': '#fff6ea',
        },
        'accent': {
          purple: '#4b3069',
          blue: '#0a6b72',
        },
        'black': '#291B25',
        'light-grey': '#d4d4d4',
        'ultra-light-grey': '#f9f9f9',
      },
      fontFamily: {
        montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
