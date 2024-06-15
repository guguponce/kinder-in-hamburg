import React from "react";
import { getAllSpielplaetze } from "@app/api/spActions";
import AdminRoute from "@app/providers/AdminRoute";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicSielplaetzeMap = dynamic(() => import("./DynamicSielplaetzeMap"), {
  ssr: false,
});

export default async function SpielplaeztePage() {
  const spList = await getAllSpielplaetze();
  if (!spList) return <div>There was a problem retrieving posts</div>;
  const distributedSP = spList.reduce((acc, sp) => {
    const { bezirk } = sp;
    if (!acc[bezirk]) acc[bezirk] = [sp];
    else acc[bezirk].push(sp);
    return acc;
  }, {} as { [key: string]: typeof spList });

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
                <article
                  key={bezirk}
                  className="flex flex-col gap-2 bg-white bg-opacity-25 rounded p-2 "
                >
                  <h2 className="font-bold text-center text-lg">
                    {bezirk} - ({list.length})
                  </h2>
                  <div className="flex flex-wrap gap-4 items-stretch mx-auto w-full justify-around">
                    {list.map((sp) => (
                      <div
                        key={sp.id}
                        className="min-w-[275px] w-1/2 lg:w-1/3 max-w-[400px] h-[168px]"
                      >
                        <HorizontalCard
                          id={sp.id}
                          title={sp.title}
                          description={sp.text}
                          image={!!sp.image?.length ? sp.image[0] : ""}
                          link={`/spielplaetze/${sp.id}`}
                          spielgeraete={sp.spielgeraete}
                        />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
          </section>
        </div>
      </main>
    </AdminRoute>
  );
}
