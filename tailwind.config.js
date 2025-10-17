/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spanish: {
          red: '#c60b1e',
          yellow: '#ffc400',
        },
        paper: {
          light: '#fff5e6',
          DEFAULT: '#ffe8cc',
        },
        wood: {
          light: '#d4a574',
          DEFAULT: '#8b4513',
          dark: '#5c2e0f',
        },
      },
      fontFamily: {
        handwritten: ['Caveat', 'cursive'],
        playful: ['Fredoka One', 'cursive'],
        marker: ['Permanent Marker', 'cursive'],
        indie: ['Indie Flower', 'cursive'],
      },
    },
  },
  plugins: [],
}
