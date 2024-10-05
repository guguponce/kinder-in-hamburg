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
          // 50: "#F0F2F5",
          // 100: "#E3E8ED",
          // 200: "#C8D1DA",
          // 300: "#ACBAC8",
          // 400: "#91A3B6",
          // 500: "#758CA3",
          // 600: "#5C738A",
          // 700: "#47596B",
          // 800: "#33404D",
          // 900: "#1F262E",
          // 950: "#141A1F",
          "50": "#f0f1f2",
          "100": "#e1e4e5",
          "200": "#d0d7da",
          "300": "#becad0",
          "400": "#abbec7",
          "500": "#97b2bf",
          "600": "#7896a5",
          "700": "#607884",
          "800": "#4b5960",
          "900": "#343b3e",
          "950": "#1b1d1e",
        },

        sun: {
          "50": "#fffcf4",
          "100": "#fff9e5",
          "200": "#fff1cb",
          "300": "#ffe7b0",
          "400": "#ffd487",
          "500": "#ffcb7d",
          "600": "#fbb25e",
          "700": "#f88d29",
          "800": "#de6c13",
          "900": "#b35b14",
          "950": "#602d07",
        },
        sky: "#73A9BF",
        positive: {
          // 50: "#EEFBF7",
          // 100: "#DEF8EF",
          // 200: "#C0F1E1",
          // 300: "#9FEAD1",
          // 400: "#82E3C3",
          // 500: "#61DCB2",
          // 600: "#2ED19B",
          // 700: "#229A72",
          // 800: "#17684D",
          // 900: "#0B3225",
          // 950: "#061913",
          "50": "#f5f9f4",
          "100": "#e9f1e7",
          "200": "#d4e2d0",
          "300": "#9ebf97",
          "400": "#85ab7d",
          "500": "#628d5a",
          "600": "#4e7247",
          "700": "#405b3a",
          "800": "#344a31",
          "900": "#2d3d2a",
          "950": "#152013",
        },
        negative: {
          // 50: "#FEF2F1",
          // 100: "#FCE5E3",
          // 200: "#F9C6C2",
          // 300: "#F7ACA6",
          // 400: "#F48D86",
          // 500: "#F1736A",
          // 600: "#EE564B",
          // 700: "#D62114",
          // 800: "#90160E",
          // 900: "#460B07",
          // 950: "#250604",
          "50": "#fef3f2",
          "100": "#fee5e2",
          "200": "#fdd1cb",
          "300": "#fbb0a6",
          "400": "#f7887a",
          "500": "#ed5946",
          "600": "#da3c28",
          "700": "#b72f1e",
          "800": "#982a1c",
          "900": "#7e291e",
          "950": "#44110b",
        },
        currentLocation: "#BC251F",
        stadtteilLocation: "#7B3E5E",
        bezirkLocation: "#39579D",

        salmon: "rgb(245, 191, 179)",
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
