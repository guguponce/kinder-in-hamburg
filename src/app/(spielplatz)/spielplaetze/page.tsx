import React from "react";
import { getAllSpielplaetze } from "@app/api/spActions";
import AdminRoute from "@app/providers/AdminRoute";
import ScrollableContainer from "@app/components/ScrollableContainer";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import currentLocation from "./currentLocation.svg";
import GetSPdata from "../getData/GetSPdata";
import Link from "next/link";

export default async function SpielplaeztePage() {
  const spList = await getAllSpielplaetze();
  if (!spList) return <div>There was a problem retrieving posts</div>;
  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px] flex flex-col items-center gap-8">
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
        <section className="flex flex-wrap gap-4 items-stretch">
          {spList.map((sp) => (
            <React.Fragment key={sp.id}>
              <HorizontalCard
                id={sp.id}
                title={sp.title}
                description={sp.text}
                image={!!sp.image?.length ? sp.image[0] : currentLocation.src}
                link={`/spielplaetze/${sp.id}`}
              />
            </React.Fragment>
          ))}
        </section>
      </main>
    </AdminRoute>
  );
}
