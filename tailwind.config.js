const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./resources/views/**/*.edge', './resources/js/**/*.js'],
  theme: {
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      14: '14',
      15: '15',
      16: '16',
    },
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
      linearBorderGradients: ({ theme }) => ({
        colors: {
          'associations': [theme('colors.primary.base'), theme('colors.primary.variation-1')],
          'associations-light': [
            theme('colors.primary.base / 0.3'),
            theme('colors.primary.variation-1 / 0.3'),
          ],
        },
        background: theme('colors'),
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-border-gradient-radius'),
  ],
}
