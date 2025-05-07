import localFont from "next/font/local";
import {
  // Cabin,
  Coming_Soon,
  // Gloria_Hallelujah,
  // Sniglet,
  Shantell_Sans,
} from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
export const descriptionFont = Shantell_Sans({
  weight: ["400", "700", "800"],

  subsets: ["latin"],
});
export const logoFont = localFont({
  src: "./PartyConfetti-Logo.ttf",
  // display: "swap",
  variable: "--font-logo",
});
