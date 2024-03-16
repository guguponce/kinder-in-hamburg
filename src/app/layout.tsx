import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kinder in Hamburg",
  description: "Suche eure nächste Ausflugsziele in Hamburg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <h1 className="text-3xl text-center font-bold">Kinder in Hamburg</h1>
        {children}
      </body>
    </html>
  );
}
