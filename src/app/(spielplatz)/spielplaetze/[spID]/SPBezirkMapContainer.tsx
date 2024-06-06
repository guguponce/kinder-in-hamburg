import {
  getSpielplaetzeFromBezirk,
  getSpielplaetzeFromStadtteile,
} from "@app/api/spActions";
import NotFound from "@app/components/NotFound";
import { checkBezirk, parseParams } from "@app/utils/functions";
import { iBezirk, iSpielplatz } from "@app/utils/types";

import React from "react";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import dynamic from "next/dynamic";

export const revalidate = 10;

const DynamicBezirkSPMap = dynamic(() => import("./SPBezirkMap"), {
  ssr: false,
  loading: () => (
    <img
      src="/assets/bezirke/mitte.webp"
      className="object-cover w-full h-full"
      alt=""
    />
  ),
});

export default async function SPBezirkMapContainer({
  bezirk: bez,
  stadtteil,
  currentSP,
}: {
  currentSP?: number;
  bezirk: string;
  stadtteil?: string;
}) {
  const bezirk = parseParams(bez);
  if (!checkBezirk(bezirk)) return <NotFound type="bezirk" />;

  const BezirkSPList = await getSpielplaetzeFromBezirk(bezirk as iBezirk);
  if (!BezirkSPList) return <NotFound type="spielplatz" />;
  const OtherBezirkSPList =
    stadtteil && PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil]
      ? await getSpielplaetzeFromStadtteile(
          PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil]
        )
      : [];

  const reducedBezirkSPList = BezirkSPList.reduce(
    (acc, sp) => {
      if (!!currentSP && sp.id === currentSP) return acc;
      if (!!stadtteil && sp.stadtteil === stadtteil)
        return { ...acc, stadtteil: [...acc.stadtteil, sp] };
      else return { ...acc, bezirk: [...acc.bezirk, sp] };
    },
    { stadtteil: [], bezirk: [], andere: OtherBezirkSPList || [] } as {
      [key: string]: iSpielplatz[];
    }
  );
  return (
    <section id="sp-map-container" className="w-full">
      <DynamicBezirkSPMap
        selector={true}
        currentSP={currentSP}
        spList={[...BezirkSPList, ...(OtherBezirkSPList || [])]}
      />
    </section>
  );
}
