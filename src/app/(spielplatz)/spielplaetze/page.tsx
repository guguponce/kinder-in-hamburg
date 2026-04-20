import React from "react";
import { getAllSpielplaetze } from "@app/api/spActions";
import AdminRoute from "@app/providers/AdminRoute";
import HorizontalCard from "@components/@Cards/HorizontalCard";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  createMetadata,
  parseDescriptionWithTags,
  separateInBezirke,
} from "@app/utils/functions";
import ExpandableContainer from "@components/ExpandableContainer";
import ApproveButton from "@components/@Buttons/ApproveButton";
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

const cachedSpielplaetze = unstable_cache(getAllSpielplaetze, ["posts"], {
  revalidate: 300,
});
export default async function SpielplaeztePage() {
  const spList = await cachedSpielplaetze();
  if (!spList)
    return (
      <ErrorComponent text="Es gab ein Problem beim Abrufen der Beiträge." />
    );
  const distributedSP = separateInBezirke(spList);
  Object.entries(distributedSP).forEach(
    ([bezirk, list]) =>
      (distributedSP[bezirk] = list.sort((a) => (a.pinnedSpielplatz ? -1 : 1))),
  );
  return (
    <AdminRoute>
      <main className="w-full flex flex-col items-center gap-4 p-1 sm:p-4 md:px-8">
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
        <MainIntroductionText
          title="Spielplätze"
          variant="light"
          text={`Hier findet ihr eine Übersicht von Spielplätzen aus verschiedenen Orten in Hamburg.<br>
Ihr könnt nach verschiedenen Kategorien, Bezirken, Altersempfehlungen und Spielgeräten filtern, um den perfekten Ort für eure Kinder oder eure Familie zu finden.<br>

Außerdem sind auch Sportplätze aufgeführt, die sich ebenfalls gut für Jugendliche und Erwachsene eignen.<br>

Wenn ihr einen Spielplatz kennt, der noch nicht aufgelistet ist, gebt uns gerne Bescheid!`}
        />

        <URLFilteredList spielplaetzeList={spList}></URLFilteredList>
        <div className="flex flex-wrap items-start justify-center gap-2">
          {/* <DynamicSielplaetzeMap spielplaetze={spList} /> */}
          <section className="flex-grow flex flex-wrap gap-4 items-stretch mx-auto justify-around">
            {Object.entries(distributedSP)
              .sort(([_, alist], [__, blist]) => blist.length - alist.length)
              .map(([bezirk, list]) => (
                <div key={bezirk} className="w-full lg:w-[calc(50%-1rem)]">
                  <ExpandableContainer
                    type="Spielplätze"
                    contentHeight={420}
                    initialHeight={400}
                  >
                    <article
                      key={bezirk}
                      className="flex flex-col gap-2 bg-white bg-opacity-25 rounded p-2"
                    >
                      <h2 className="font-bold text-center text-lg">
                        {bezirk} - ({list.length})
                      </h2>
                      <div className="flex flex-wrap gap-4 items-stretch mx-auto w-full justify-around  max-h-full">
                        {list.map((sp) => (
                          <div
                            key={sp.id}
                            className={` flex gap-2 flex-wrap ${
                              sp.status === "approved"
                                ? "p-2 bg-positive-300"
                                : sp.status === "pending"
                                  ? "p-2 bg-orange-300"
                                  : "p-2 bg-negative-300"
                            }`}
                          >
                            <HorizontalCard
                              title={sp.title}
                              image={sp.image ? sp.image[0] : ""}
                              type="spielplatz"
                              id={sp.id}
                              imgSize="object-cover"
                              link={`/spielplaetze/${sp.id}`}
                            >
                              <HorizontalCard.PostInfo
                                title={sp.title}
                                description={parseDescriptionWithTags(
                                  sp.text,
                                  100,
                                )}
                                stadtteil={sp.stadtteil}
                              />
                            </HorizontalCard>
                            {sp.status !== "approved" && (
                              <ApproveButton
                                size="medium"
                                spielplatzID={sp.id.toString()}
                                redirect={false}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </article>
                  </ExpandableContainer>
                </div>
              ))}
          </section>
        </div>
      </main>
    </AdminRoute>
  );
}
