import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        white: "#fefefe",
        black: "#121212",
        hh: {
          50: "#F0F2F5",
          100: "#E3E8ED",
          200: "#C8D1DA",
          300: "#ACBAC8",
          400: "#91A3B6",
          500: "#758CA3",
          600: "#5C738A",
          700: "#47596B",
          800: "#33404D",
          900: "#1F262E",
          950: "#141A1F",
        },
        salmon: "rgb(245, 191, 179)",
        astronaut: {
          50: "#E9EDF7",
          100: "#D2DBEF",
          200: "#A9B9E0",
          300: "#7C95CF",
          400: "#5071BF",
          500: "#39579D",
          600: "#293E70",
          650: "#243763",
          700: "#1F3056",
          750: "#1A2847",
          800: "#151F38",
          850: "#10182B",
          900: "#0B111E",
          950: "#05080F",
        },
      },
    },
  },
  plugins: [],
};
export default config;
