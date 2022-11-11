/** @type {import('tailwindcss').Config} */
let plugin = require('tailwindcss/plugin')
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('active', '&[data-state="active"]')
    }),
    plugin(({ addVariant }) => {
      addVariant('inactive', '&[data-state="inactive"]')
    }),
  ],
};
