/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem',
      },
      colors: {
        forest: "#252B26",
        anchor: "#1C1C1C",
        tablet: "#222222",
        ash: "#2B2B2B",
        smoke: "#666666",
        verdant: "#228A33",
        cement: "#909090",
        night: '#333333',
        nectarine: '#FFBD59',
        meadows: '#228A33',
        lipstick: '#D0616C',
      }
    },
  },
  plugins: [],
};
