const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './renderer/pages/**/*.{js,ts,jsx,tsx}',
    './renderer/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        white: colors.white,
        gray: colors.gray,
        blue: colors.blue,
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blinkCaret: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'black' },
        },
      },
      animation: {
        typing: 'typing 3.5s steps(40, end)',
        blinkCaret: 'blinkCaret .75s step-end infinite',
      },
      display: {
        'display': 'flex',
        'flexDirection': 'column',
        'alignItems': 'center',
        'padding': '20px',
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      fontStyle: {
        normal: 'normal',
        italic: 'italic',
      },
    },
  },
  plugins: [],
}
