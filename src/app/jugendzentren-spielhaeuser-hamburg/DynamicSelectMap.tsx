"use client";
import GeneralMap from "@components/@Map/GeneralMap";
import MarkersLists from "@components/@Map/PopUpsMarkers/MarkersLists";
import { BEZIRK_TO_STADTTEILE } from "@app/utils/constants";
import { iBezirk, iPost, iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
interface iDynamicSelectMapProps {
  items: iPost[];
}
export default function DynamicSelectMap({ items }: iDynamicSelectMapProps) {
  const [selectedBezirk, setSelectedBezirk] = React.useState<iBezirk | null>(
    null
  );
  const [selectedStadtteil, setSelectedStadtteil] = React.useState<
    string | null
  >(null);
  const { current: bezirke } = useRef(
    Array.from(new Set(items.map((item) => item.bezirk)))
  );
  const { current: stadtteile } = useRef(
    new Set(items.map((item) => item.stadtteil))
  );
  const availableStadtteile = useMemo(() => {
    if (!selectedBezirk) return [];
    const bezirkStadtteile = BEZIRK_TO_STADTTEILE[selectedBezirk];
    return bezirkStadtteile.filter((st) => stadtteile.has(st));
  }, [selectedBezirk, stadtteile]);
  const filteredItems = useMemo(() => {
    if (!selectedStadtteil && !selectedBezirk) return items;
    if (!selectedStadtteil)
      return items.filter((item) => item.bezirk === selectedBezirk);
    return items.filter((item) => item.stadtteil === selectedStadtteil);
  }, [selectedStadtteil, selectedBezirk, items]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-start w-full">
        <select
          name="bezirk"
          id="bezirk-select"
          className="px-2 py-1 ml-2 rounded-md font-semibold w-fit bg-hh-600 text-white"
          onChange={(e) => {
            const { value } = e.target;
            setSelectedBezirk(value === "all" ? null : (value as iBezirk));
            setSelectedStadtteil(null);
          }}
        >
          <option value="all">In allen Bezirken</option>
          {bezirke.map((bezirk) => (
            <option key={bezirk} value={bezirk}>
              {bezirk}
            </option>
          ))}
        </select>
        {availableStadtteile.length > 0 && (
          <select
            name="stadtteil"
            id="stadtteil-select"
            className="px-2 py-1 ml-2 rounded-md font-semibold w-fit bg-hh-600 text-white"
            onChange={(e) => {
              const { value } = e.target;
              setSelectedStadtteil(value === "all" ? null : value);
            }}
          >
            <option value="all">In allen Stadtteilen</option>
            {availableStadtteile.map((stadtteil) => (
              <option key={stadtteil} value={stadtteil}>
                {stadtteil}
              </option>
            ))}
          </select>
        )}
      </div>
      <GeneralMap>
        <MarkersLists lists={{ posts: filteredItems }} />
      </GeneralMap>
    </>
  );
}
