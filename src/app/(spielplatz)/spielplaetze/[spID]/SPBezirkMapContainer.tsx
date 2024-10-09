import {
  getSpielplaetzeFromBezirk,
  getSpielplaetzeFromStadtteile,
} from "@app/api/spActions";
import NotFound from "@app/components/@NotFound/NotFound";
import { checkBezirk, parseParams } from "@app/utils/functions";
import { iBezirk } from "@app/utils/types";

import React from "react";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import dynamic from "next/dynamic";

const DynamicBezirkSPMap = dynamic(() => import("./SPBezirkMap"), {
  ssr: false,
  loading: () => (
    <div
      className={`w-full max-w-[400px] md:max-w-full h-[400px] aspect-[0.5] shadow-md bg-hh-700 bg-opacity-90  flex flex-col md:flex-row lg:flex-col items-stretch lg:items-center p-2 gap-2 rounded mx-auto`}
    >
      <article className="w-full md:w-1/2 lg:w-full max-h-fit h-1/2 md:h-full lg:h-1/2 flex-grow  flex flex-col items-center gap-2 rounded bg-hh-900">
        <img
          src="/assets/bezirke/hamburg.webp"
          className="object-cover w-full h-full"
          alt=""
        />
      </article>
    </div>
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
  if (!checkBezirk(bezirk)) return null;

  const BezirkSPList = await getSpielplaetzeFromBezirk(bezirk as iBezirk);
  if (!BezirkSPList) return <NotFound type="spielplatz" />;
  const OtherBezirkSPList =
    stadtteil && PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil]
      ? await getSpielplaetzeFromStadtteile(
          PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil]
        )
      : [];

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
