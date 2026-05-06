import localFont from "next/font/local";
import { Shantell_Sans } from "next/font/google";

export const descriptionFont = Shantell_Sans({
  weight: ["400", "700", "800"],

  subsets: ["latin"],
});
export const logoFont = localFont({
  src: "./PartyConfetti-Logo.ttf",
  // display: "swap",
  variable: "--font-logo",
});
