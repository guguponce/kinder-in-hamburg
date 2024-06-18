import type { Metadata } from "next";

import { Roboto } from "next/font/google";
import "@styles/globals.scss";
import Header from "@components/@Header/Header";
import { getServerSession } from "next-auth";
import SessionProvider from "@app/providers/SessionProvider";
import Footer from "./components/@Footer/Footer";
import GetAnalytics from "./GetAnalytics";

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
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`
         flex flex-col items-center bg-hh-500 max-w-[1400px] mx-auto gap-2`}
      >
        <SessionProvider session={session}>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
        <GetAnalytics />
      </body>
    </html>
  );
}
