import { iSPType } from "@app/utils/types";
import { getTypeSpielplaetze } from "@app/api/spActions";
import NotFound from "@app/components/NotFound";
import { joinAddress } from "@app/utils/functions";
import dynamic from "next/dynamic";
import React from "react";
// import Planschbecken from "./Planschbecken";

const SpielplatzMap = dynamic(
  () => import("@app/components/@Map/SpielplatzMap"),
  {
    ssr: false,
  }
);

export default async function SingleSpielplatzType({
  params: { type },
}: {
  params: { type: string };
}) {
  const spType = decodeURIComponent(type).toLocaleLowerCase();
  if (!spType.includes(spType)) return <NotFound type="spielplatzType" />;
  const spielplaetze = await getTypeSpielplaetze(spType as iSPType);
  if (!spielplaetze) return <NotFound type="spielplatzType" />;

  return (
    <main>
      <div className="flex flex-wrap gap-4">
        {/* {type === "planschbecken" && <Planschbecken />} */}
        {spielplaetze.map((sp) => (
          <div
            key={sp.id}
            className="flex flex-col gap-2 bg-white rounded p-2 "
          >
            <p>{sp.stadtteil}</p>
            <h2>{sp.title}</h2>
            {sp.address && <p>{joinAddress(sp.address)}</p>}
          </div>
        ))}
      </div>
      <SpielplatzMap spielplaetzeList={spielplaetze} />
    </main>
  );
}
