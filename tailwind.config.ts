import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-fixel)"],
        logo: ["var(--font-logo)"],
      },

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
          // "50": "hsl(204,  30%, 96%)",
          // "100": "hsl(208, 35%, 94%)",
          // "200": "hsl(204, 35%, 90%)",
          // "300": "hsl(199, 34%, 80%)",
          // "400": "hsl(199, 32%, 75%)",
          // "500": "hsl(200, 25%, 61%)",
          // "600": "hsl(201, 31%, 50%)",
          // "700": "hsl(200, 30%, 42%)",
          // "800": "hsl(199, 25%, 24%)",
          // "900": "hsl(201, 25%, 25%)",
          // "950": "hsl(202, 20%, 20%)",
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
          50: "#FEF2F1",
          100: "#FCE5E3",
          200: "#F9C6C2",
          300: "#F7ACA6",
          400: "#F48D86",
          500: "#F1736A",
          600: "#EE564B",
          700: "#D62114",
          800: "#90160E",
          900: "#460B07",
          950: "#250604",
        },
        currentLocation: "#BC251F",
        stadtteilLocation: "#7B3E5E",
        bezirkLocation: "#39579D",

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
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
export default config;

// #74b9d1
// #ffb23e
// #fdcd49

// EE564B
// #81bfd0
// #fafdfc
// #1d1818
// #c73a35
// #f5bfb3

//Logo
//#9ed0e6
//#FFF9F3
