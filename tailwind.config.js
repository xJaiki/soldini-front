/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#79a471",
        secondary: "#105a37",
        outSelect: "#da8080",
        inSelect: "#96e196",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui()
  ],
}

