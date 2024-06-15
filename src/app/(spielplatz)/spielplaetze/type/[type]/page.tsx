import { iSPType } from "@app/utils/types";
import { getTypeSpielplaetze } from "@app/api/spActions";
import NotFound from "@app/components/NotFound";
import { joinAddress } from "@app/utils/functions";
import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link";
import AdminRoute from "@app/providers/AdminRoute";
import WasserMap from "./WasserMap";
import { getApprovedPostWithCat } from "@app/api/dbActions";
// import Planschbecken from "./Planschbecken";

const SpielplatzMap = dynamic(() => import("@components/@Map/SpielplatzMap"), {
  ssr: false,
});

export default async function SingleSpielplatzType({
  params: { type },
}: {
  params: { type: string };
}) {
  const spType = decodeURIComponent(type).toLocaleLowerCase();
  if (!spType.includes(spType)) return <NotFound type="spielplatzType" />;
  const spielplaetze = await getTypeSpielplaetze(spType as iSPType);
  const badePosts =
    spType === "planschbecken"
      ? (await await getApprovedPostWithCat("badeplatz")) || []
      : [];
  if (!spielplaetze) return <NotFound type="spielplatzType" />;
  const displayedSP = [...spielplaetze].sort((a, b) =>
    a.bezirk.localeCompare(b.bezirk)
  );
  return (
    <AdminRoute>
      <main>
        <section className="flex flex-wrap gap-4">
          {/* {type === "planschbecken" && <Planschbecken />} */}
          {displayedSP.map((sp) => (
            <article
              key={sp.id}
              className="flex flex-col gap-2 bg-white rounded p-2 "
            >
              <div className="flex flex-col">
                <h2 className="font-bold">{sp.title}</h2>
                {sp.address && <p>{joinAddress(sp.address)}</p>}
                <p className="font-semibold">
                  {sp.bezirk}-{sp.stadtteil}
                </p>
              </div>
              <div className="flex gap-2 justify-between">
                <Link
                  href={`/update-spielplatz/${sp.id}`}
                  className="bg-positive-500 hover:bg-positive-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Edit
                </Link>
                <Link
                  href={`/update-spielplatz/${sp.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Check
                </Link>
              </div>
            </article>
          ))}
        </section>
        {spType === "planschbecken" ? (
          <WasserMap lists={{ posts: badePosts, spielplaetze: spielplaetze }} />
        ) : (
          <SpielplatzMap spielplaetzeList={spielplaetze} />
        )}
      </main>
    </AdminRoute>
  );
}
