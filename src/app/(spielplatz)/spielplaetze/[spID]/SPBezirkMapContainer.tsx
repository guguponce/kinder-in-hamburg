import {
  getSpielplaetzeFromBezirk,
  getSpielplaetzeFromStadtteile,
} from "@app/api/spActions";
import { checkBezirk, parseParams } from "@app/utils/functions";
import { iBezirk } from "@app/utils/types";

import React from "react";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import dynamic from "next/dynamic";
import TriangleIcon from "@app/components/@Icons/TriangleIcon";

const DynamicBezirkSPMap = dynamic(() => import("./SPBezirkMap"), {
  ssr: false,
  loading: () => (
    <div
      className={
        "w-full max-w-[400px] md:max-w-full sm:w-1/2 lg:w-full aspect-[4/3] sm:aspect-auto sm:h-full shadow-md bg-hh-700 bg-opacity-90  flex flex-col md:flex-row lg:flex-col items-stretch lg:items-center p-2 gap-2 rounded mx-auto overflow-hidden"
      }
    >
      <article className="w-full py-2 px-1 md:w-1/2 lg:w-full flex-grow h-full flex flex-col items-center rounded bg-hh-800">
        <div className="w-full flex flex-wrap justify-around gap-2 mx-auto px-4 py-2 rounded-[2px_2px_0_0] bg-hh-50">
          <div className="flex gap-1 items-center">
            <TriangleIcon color="#b72f1e" rotate={90} size="1rem" />
            <h2
              className={"text-xs leading-none font-semibold text-negative-700"}
            >
              Spielplatz
            </h2>
          </div>
        </div>
        <div className="w-full h-full rounded-[0_0_2px_2px] overflow-hidden flex-grow">
          <img
            src="/assets/bezirke/hamburg.webp"
            className="object-cover w-full h-full"
            alt=""
          />
        </div>
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
  if (!BezirkSPList) return null;
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
        maxDistance={1500}
        currentSP={currentSP}
        spList={[...BezirkSPList, ...(OtherBezirkSPList || [])]}
      />
    </section>
  );
}
