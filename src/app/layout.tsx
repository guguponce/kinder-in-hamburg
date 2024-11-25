import type { Metadata } from "next";

import Script from "next/script";

import localFont from "next/font/local";
import "@styles/globals.scss";
import Header from "@components/@Header/Header";
import Footer from "./components/@Footer/Footer";
import GetAnalytics from "./GetAnalytics";
const fixelFont = localFont({
  src: "./styles/fonts/FixelVariable.ttf",
  display: "swap",
  variable: "--font-fixel",
});

export const metadata: Metadata = {
  title: {
    default: "Kinder in Hamburg",
    template: "%s | Kinder in Hamburg",
  },
  icons: "/favicon.ico",
  description:
    "Hier findet ihr Aktivitäten und Flohmärkte für die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
  keywords: [
    "kinder in hamburg",
    "KINDER IN HAMBURG",
    "kinder hamburg",
    "hamburg mit kinder",
    "hamburg familie",
    "hamburg kinder",
    "hamburg ausflug",
    "hamburg flohmarkt",
    "hamburg kinder flohmarkt",
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
  openGraph: {
    title: "Kinder in Hamburg",
    description:
      "Hier findet ihr Aktivitäten und Flohmärkte für die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
    url: "https://www.kinder-in-hamburg.de",
    images: "https:www.kinder-in-hamburg.de/opengraph-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinder in Hamburg",
    description:
      "Hier findet ihr Aktivitäten und Flohmärkte für die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",

    images: `${process.env.BASE_URL}opengraph-image.png`,
  },
  // metadataBase: new URL("https://www.kinder-in-hamburg.de"), // Base URL for resolving relative URLs
};

export const revalidate = 60 * 60 * 6; // 6 hours
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:type" content="<generated>" />
        <meta property="og:image:width" content="<generated>" />
        <meta property="og:image:height" content="<generated>" />
      </head>
      <body
        className={`${fixelFont.className}
         flex flex-col items-center bg-hh-600 max-w-[1400px] mx-auto gap-2`}
      >
        {/* <SessionProvider> */}
        <Header />
        {children}
        <Footer />
        {/* </SessionProvider> */}
        <GetAnalytics />
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
