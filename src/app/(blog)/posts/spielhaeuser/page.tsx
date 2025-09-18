import { getPostsWithCat } from "@app/api/dbActions";
import AdminRoute from "@app/providers/AdminRoute";
import dynamic from "next/dynamic";
import React from "react";
import type { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Spielhäuser in Hamburg",
    icons: "/favicon.ico",
    description:
      "Entdecke Spielhäuser in Hamburg – Gemeinschaftszentren für Kinder und Familien mit kreativen Aktivitäten, Veranstaltungen und Unterstützung.",
    keywords: [
      "spielhaus hamburg",
      "spielhäuser hamburg",
      "kinder hamburg",
      "familie hamburg",
      "freizeit kinder hamburg",
      "gemeinschaftszentrum hamburg",
      "spielhaus",
      "spielhäuser",
      "hamburg kinder",
      "hamburg familie",
      "aktivitäten kinder hamburg",
      "veranstaltungen kinder hamburg",
      "kinder in hamburg",
      "hamburg mit kindern",
      "hamburg familie",
      "hamburg kinder",
      "spielmöglichkeiten hamburg",
      "spielzentrum hamburg",
    ],
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/posts/spielhaeuser",
      title: "Spielhäuser in Hamburg",
      description:
        "Finde Spielhäuser in Hamburg – sichere und kreative Orte für Kinder und Familien mit vielfältigen Aktivitäten und Veranstaltungen.",
      images: process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title: "Spielhäuser in Hamburg",
      description:
        "Entdecke Spielhäuser in Hamburg – Gemeinschaftszentren für Kinder und Familien mit kreativen Aktivitäten und Unterstützung.",
      images: process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/posts/spielhaeuser",
      card: "summary_large_image",
    },
  };
}

const SpielhaeuserMap = dynamic(() => import("./SpielhaeuserMap"), {
  ssr: false,
});

export default async function SpielhaeuserPage() {
  const sphList = await getPostsWithCat(["Spielhaus"]);
  if (!sphList) throw Error("No Spielhaus retrieved");
  return (
    <AdminRoute>
      <main className="w-full text-hh-50 mx-auto flex flex-col gap-4 items-center">
        <section id="hero" className="max-w-[800px] w-4/5">
          <h1 className="p-8 text-center font-bold text-4xl">Spielhäuser</h1>
          <p className="xl:text-lg italic">
            Spielhäuser sind Gemeinschaftszentren für Kinder und ihre Familien,
            die eine sichere und kreative Umgebung bieten. Sie ermöglichen
            Aktivitäten wie Basteln, Sport und Bildungsworkshops. Kinder können
            spielen, lernen und ihre sozialen Fähigkeiten entwickeln, während
            Eltern sich beteiligen oder Unterstützung erhalten. Diese Zentren
            organisieren auch besondere Veranstaltungen wie Jahreszeitenfeste,
            Ausflüge und kulturelle Austauschprogramme, die das
            Gemeinschaftsgefühl und die Inklusion fördern.
          </p>
        </section>
        <SpielhaeuserMap sphList={sphList} />
      </main>
    </AdminRoute>
  );
}
