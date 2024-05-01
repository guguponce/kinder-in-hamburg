import type { Metadata } from "next";

import { Roboto } from "next/font/google";
import "@styles/globals.scss";
import Header from "@components/@Header/Header";
import { getServerSession } from "next-auth";
import SessionProvider from "@app/providers/SessionProvider";
import Footer from "./components/@Footer/Footer";
import AnalyticsComponent from "./GetAnalytics";
import { Analytics } from "@vercel/analytics/react";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kinder in Hamburg",
  description:
    "Hier findet ihr Flohmärkten aus verschiedenen Orten in Hamburg zusammengestellt.",
  keywords: [
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
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${roboto.className} flex flex-col items-center bg-hh-500 max-w-[1400px] mx-auto gap-4 md:gap-8`}
      >
        <SessionProvider session={session}>
          <Header />
          {/* <LoggedUserComponents> */}
          {children}
          {/* </LoggedUserComponents> */}

          <Footer />
        </SessionProvider>
        <Analytics />
        {/* <AnalyticsComponent></AnalyticsComponent> */}
      </body>
    </html>
  );
}
