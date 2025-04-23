"use client";
import { iBezirk, iSpielplatz } from "@app/utils/types";
import React, { useMemo } from "react";
import ShuffleGallery from "@components/@Cards/ShuffleGallery";
import WasserSectionTemplate from "./WasserSectionTemplate";

export default function Wasserspiele({
  wasserspiele,
}: {
  wasserspiele: iSpielplatz[];
}) {
  const availableBezirke = useMemo(
    () => Array.from(new Set(wasserspiele.map(({ bezirk }) => bezirk))),
    [wasserspiele]
  );
  const [bezirk, setBezirk] = React.useState<iBezirk | "all">("all");
  const filteredList = useMemo(
    () =>
      bezirk === "all"
        ? wasserspiele
        : wasserspiele.filter((spielplatz) => spielplatz.bezirk === bezirk),
    [bezirk, wasserspiele]
  );
  return (
    <WasserSectionTemplate
      title="Spielplätze mit Wasserspiele"
      text="Kurz vor Sommerbeginn werden auf vielen Spielplätzen die Wasserspiele wie Wasserpumpen, Wasserrinnen und -kanäle aktiviert."
    >
      {/* Matsch- und Sandbereiche bieten zusätzlichen Spaß durch die Kombination von Wasser
          und Sand. So finden Kinder eine erfrischende Abwechslung. */}
      <div className="flex flex-col items-center gap-2 mt-auto self-center min-w-full py-2">
        <select
          name="bezirk"
          id="bezirk-select"
          className="px-2 py-1 rounded-md bg-hh-600 font-semibold text-white w-fit"
          onChange={(e) => setBezirk(e.target.value as iBezirk)}
        >
          <option value="all">In allen Bezirken</option>
          {availableBezirke.map((bezirk) => (
            <option key={bezirk} value={bezirk}>
              {bezirk}
            </option>
          ))}
        </select>
        <div className="w-full max-w-[300px] aspect-[6/7] rounded bg-hh-900 bg-opacity-10">
          <ShuffleGallery list={filteredList} shuffle={true} />
        </div>
      </div>
    </WasserSectionTemplate>
  );
}
