/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        rosarivo: ['Rosarivo', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
