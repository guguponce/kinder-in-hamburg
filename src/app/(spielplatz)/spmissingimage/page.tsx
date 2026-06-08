import { getAllSpielplaetze } from "@app/api/spActions";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import AdminPage from "@app/providers/AdminPage";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import React from "react";

const GeneralMap = dynamic(() => import("../../components/@Map/GeneralMap"), {
  ssr: false,
});

const spielplaetze = unstable_cache(
  async () => {
    const sps = (await getAllSpielplaetze()) || [];
    return sps.filter((sp) => sp.image?.length === 0);
  },
  [],
  {
    revalidate: 60 * 60 * 24,
    tags: ["spielplaetze", "posts"],
  },
);
export default async function page() {
  const sps = (await spielplaetze()).sort((a, b) =>
    a.bezirk.localeCompare(b.bezirk),
  );
  return (
    <AdminPage>
      <div className="w-full flex flex-col items-center gap-4 py-8">
        <h1 className="text-2xl font-bold">Spielplätze ohne Bilder</h1>
        <div className="w-full max-w-4xl h-screen max-h-[800px]">
          <GeneralMap centerUserLocation showUserLocation>
            <MarkersLists lists={{ spielplaetze: sps }} />
          </GeneralMap>
        </div>
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {sps.map((sp) => (
            <div
              key={sp.id}
              className="w-full p-4 bg-gray-100 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold">{sp.title}</h2>
              <p className="text-gray-600">{sp.bezirk}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
