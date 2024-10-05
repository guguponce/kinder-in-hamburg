import type { Metadata } from "next";

import Script from "next/script";

import localFont from "next/font/local";
import "@styles/globals.scss";
import Header from "@components/@Header/Header";
import Footer from "./components/@Footer/Footer";
import GetAnalytics from "./GetAnalytics";
import { SessionProvider } from "./providers/SessionContext";
const fixelFont = localFont({
  src: "./styles/fonts/FixelVariable.ttf",
  display: "swap",
  variable: "--font-fixel",
});

export const metadata: Metadata = {
  title: "Kinder in Hamburg",
  description:
    "Hier findet ihr Flohmärkten aus verschiedenen Orten in Hamburg zusammengestellt.",
  keywords: [
    "hamburg mit kinder",
    "hamburg familie",
    "hamburg kinder",
    "hamburg ausflug",
    "hamburg flohmarkt",
    "hamburg kinder flohmarkt",
    "kinder in hamburg",
    "kinder hamburg",
    "hamburg",
    "flohmarkt",
    "kinder",
    "familie",
    "ausflug",
    "flohmarkt hamburg",
    "flohmarkt kinder",
    "flohmarkt familie",
    "flohmarkt hamburg kinder",
    "flohmarkt hamburg familie",
    "flea market",
  ],
};

export const revalidate = 3600;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fixelFont.className}
         flex flex-col items-center bg-hh-600 max-w-[1400px] mx-auto gap-2`}
      >
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
        <GetAnalytics />
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
