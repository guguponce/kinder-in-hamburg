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
        sky: "#73A9BF",
        positive: {
          50: "#EEFBF7",
          100: "#DEF8EF",
          200: "#C0F1E1",
          300: "#9FEAD1",
          400: "#82E3C3",
          500: "#61DCB2",
          600: "#2ED19B",
          700: "#229A72",
          800: "#17684D",
          900: "#0B3225",
          950: "#061913",
        },
        negative: {
          50: "#FCEEEE",
          100: "#FAE1E0",
          200: "#F5C4C2",
          300: "#F0A6A3",
          400: "#EB8885",
          500: "#E56A66",
          600: "#E04945",
          700: "#BC251F",
          800: "#7F1915",
          900: "#3D0C0A",
          950: "#1F0605",
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

// oldNegatives:
// 50: "#FBEEEE",
// 100: "#F8DEDE",
// 200: "#EFB9B8",
// 300: "#E89896",
// 400: "#E17775",
// 500: "#D9524F",
// 600: "#D1302E",
// 700: "#B02926",
// 800: "#8A201E",
// 900: "#691917",
// 950: "#360D0C",
