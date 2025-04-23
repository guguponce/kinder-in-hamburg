"use client";
import { iBezirk, iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
import GeneralMap from "../../components/@Map/GeneralMap";
import MarkersLists from "@components/@Map/PopUpsMarkers/MarkersLists";

export default function DynamicSielplaetzeMap({
  spielplaetze,
}: {
  spielplaetze: iSpielplatz[];
}) {
  const [selectedBezirk, setSelectedBezirk] = React.useState<
    iBezirk | undefined
  >();
  const bezirke = useRef(
    Array.from(new Set(spielplaetze.map(({ bezirk }) => bezirk).flat()))
  );
  const displayedMarkers = useMemo(
    () =>
      selectedBezirk
        ? spielplaetze.filter(
            (p) =>
              p.bezirk.toLocaleLowerCase() ===
              selectedBezirk.toLocaleLowerCase()
          )
        : spielplaetze,
    [selectedBezirk, spielplaetze]
  );

  return (
    <section className="w-full h-fit p-4 flex flex-col md:flex-row justify-center  gap-4 items-center rounded">
      <article className="w-full h-[600px] flex justify-center rounded overflow-hidden">
        <GeneralMap>
          <MarkersLists lists={{ spielplaetze: displayedMarkers }} />
        </GeneralMap>
      </article>
      <aside className="flex flex-col justify-center gap-2">
        <button
          onClick={() => setSelectedBezirk(undefined)}
          className={`p-2 rounded-md mb-2 outline-2 outline outline-offset-1 outline-hh-800 ${
            !selectedBezirk ? "bg-hh-900 text-white" : "bg-white text-hh-900"
          }`}
        >
          Alle Bezirke
        </button>
        <div className="flex flex-wrap md:flex-col justify-center gap-2">
          {bezirke.current.map((bezirk) => (
            <button
              key={bezirk}
              onClick={() => {
                setSelectedBezirk(
                  selectedBezirk === bezirk ? undefined : (bezirk as iBezirk)
                );
              }}
              className={`p-2 rounded-md ${
                selectedBezirk === bezirk
                  ? "bg-hh-900 text-white"
                  : "bg-white text-hh-900"
              }`}
            >
              {bezirk}
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}
