import localFont from "next/font/local";
import {
  // Cabin,
  Coming_Soon,
  // Gloria_Hallelujah,
  // Sniglet,
} from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
export const descriptionFont = Coming_Soon({
  weight: ["400"],

  subsets: ["latin"],
});
export const logoFont = localFont({
  src: "./PartyConfetti-Logo.ttf",
  // display: "swap",
  variable: "--font-logo",
});
