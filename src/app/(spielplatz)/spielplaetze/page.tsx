import React from "react";
import { getAllSpielplaetze } from "@app/api/spActions";
import AdminRoute from "@app/providers/AdminRoute";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import Link from "next/link";
import dynamic from "next/dynamic";
import { separateInBezirke } from "@app/utils/functions";
import ExpandableContainer from "@app/components/ExpandableContainer";
import ApproveButton from "@app/components/ApproveButton";

const DynamicSielplaetzeMap = dynamic(() => import("./DynamicSielplaetzeMap"), {
  ssr: false,
});

export default async function SpielplaeztePage() {
  const spList = await getAllSpielplaetze();
  if (!spList) return <div>There was a problem retrieving posts</div>;
  const distributedSP = separateInBezirke(spList);
  Object.entries(distributedSP).forEach(
    ([bezirk, list]) =>
      (distributedSP[bezirk] = list.sort((a) => (a.pinnedSpielplatz ? -1 : 1)))
  );
  return (
    <AdminRoute>
      <main className="w-full flex flex-col items-center gap-4 p-8">
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
        <div className="flex flex-wrap items-start justify-center gap-2">
          <DynamicSielplaetzeMap spielplaetze={spList} />
          <section className="flex-grow flex flex-wrap  gap-4 items-stretch mx-auto justify-around">
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
                              link={`/spielplaetze/${sp.id}`}
                            >
                              <HorizontalCard.PostInfo
                                title={sp.title}
                                description={
                                  sp.text ? sp.text.slice(0, 100) + "..." : ""
                                }
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
