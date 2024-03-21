import type { Metadata } from "next";

import { Roboto } from "next/font/google";
import "@styles/globals.scss";
import Header from "@components/@Header/Header";
import { getServerSession } from "next-auth";
import SessionProvider from "@app/providers/SessionProvider";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kinder in Hamburg",
  description: "Suche eure nächste Ausflugsziele in Hamburg",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${roboto.className} flex flex-col items-center bg-hh-500`}
      >
        <SessionProvider session={session}>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
