import React from "react";
import { getApprovedSpielplaetze } from "@app/api/spActions";
import AdminRoute from "@app/providers/AdminRoute";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createMetadata } from "@app/utils/functions";
import type { Metadata } from "next";
import URLFilteredListSuspense from "@app/components/Filters/URLFilteredListSuspense";
import ErrorComponent from "@app/components/ErrorComponent";
import { unstable_cache } from "next/cache";
import MainIntroductionText from "@app/components/@Templates/MainIntroductionText";

const URLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredSpielplaetzeList"),
  { ssr: false, loading: () => <URLFilteredListSuspense /> },
);

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Spielplätze in Hamburg",
    description:
      "Hier findet ihr eine Übersicht von Spielplätzen aus verschiedenen Orten in Hamburg. Ihr könnt nach verschiedenen Kategorien, Bezirken, Altersempfehlungen und Spielgeräten filtern, um den perfekten Ort für eure Kinder oder eure Familie zu finden.",
    pathname: "/spielplaetze",
    image: process.env.BASE_URL + "opengraph-image.png",
    keywords: [
      "Spielplätze Hamburg",
      "Spielplatz Hamburg",
      "Spielplätze in Hamburg",
      "Spielplatz in der Nähe Hamburg",
      "beste Spielplätze Hamburg",
      "Kinder Spielplätze Hamburg",
      "Ausflugsziele Spielplatz Hamburg",
      "Outdoor Spielplatz Hamburg",
      "Indoor Spielplatz Hamburg",
      "Abenteuerspielplatz Hamburg",
      "Waldspielplatz Hamburg",
      "Wasserspielplatz Hamburg",
      "Planschbecken Hamburg",
      "Skatepark Hamburg",
      "Sportplatz für Kinder Hamburg",
      "Tierpark für Kinder Hamburg",
      "Abenteuerspielplätze für Kinder",
      "Natur Spielplätze",
      "Wald Spielplätze für Kinder",
      "Wasser Spielplätze für Kinder",
      "Spielplätze mit Wasser Hamburg",
      "Spielplätze mit Schatten Hamburg",
      "ruhige Spielplätze Hamburg",
      "große Spielplätze Hamburg",
      "kleinkind Spielplätze Hamburg",
      "Spielplätze für kleine Kinder",
      "was sind die besten Spielplätze in Hamburg",
      "schöne Spielplätze für Kinder in Hamburg",
      "Spielplätze zum Ausfliegen Hamburg",
      "wo gibt es Spielplätze in Hamburg",
      "Kinder Ausflüge Spielplatz Hamburg",
      "Wochenend Ausflug Spielplatz Hamburg",
      "Spielplätze für Familien Hamburg",
    ],
    robots: true,
  });
}

const cachedSpielplaetze = unstable_cache(getApprovedSpielplaetze, ["posts"], {
  revalidate: 300,
});
export default async function SpielplaeztePage() {
  const spList = await cachedSpielplaetze();
  if (!spList)
    return (
      <ErrorComponent text="Es gab ein Problem beim Abrufen der Beiträge." />
    );
  return (
    <main className="w-full flex flex-col items-center gap-4 p-1 sm:p-4 md:px-8">
      <AdminRoute>
        <>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/new-spielplatz"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              New Spielplatz
            </Link>

            <Link
              href="/add-sp"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Add premade Spielplatz
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {spList
              .filter(
                ({ tags, type }) =>
                  tags?.some((tag) => tag.includes("sport")) &&
                  !type.includes("sportplatz"),
              )
              .map(({ title, id, type }) => (
                <React.Fragment key={title}>
                  <Link href={`/update-spielplatz/${id}`}>
                    {title} - {JSON.stringify(type)}
                  </Link>
                </React.Fragment>
              ))}
          </div>
        </>
      </AdminRoute>
      <MainIntroductionText
        title="Spielplätze"
        variant="light"
        text={`Hier findet ihr eine Übersicht von Spielplätzen aus verschiedenen Orten in Hamburg.<br>
Ihr könnt nach verschiedenen Kategorien, Bezirken, Altersempfehlungen und Spielgeräten filtern, um den perfekten Ort für eure Kinder oder eure Familie zu finden.<br>

Außerdem sind auch Sportplätze aufgeführt, die sich ebenfalls gut für Jugendliche und Erwachsene eignen.<br>

Wenn ihr einen Spielplatz kennt, der noch nicht aufgelistet ist, gebt uns gerne Bescheid!`}
      />

      <URLFilteredList spielplaetzeList={spList}></URLFilteredList>
    </main>
  );
}
