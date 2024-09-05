"use client";
import ShuffleGallery from "@app/components/ShuffleGallery";
import { iPost, iSpielplatz } from "@app/utils/types";
import React from "react";

interface BadenGalleryProps {
  badeseen: iPost[];
  freibaeder: iPost[];
  wasserspiele: iSpielplatz[];
  planschbecken: iSpielplatz[];
}

export default function BadenGallery({
  badeseen,
  freibaeder,
  wasserspiele,
  planschbecken,
}: BadenGalleryProps) {
  const [whichList, setWhichList] =
    React.useState<keyof BadenGalleryProps>("badeseen");
  const list: BadenGalleryProps = {
    badeseen,
    freibaeder,
    wasserspiele,
    planschbecken,
  };
  if (
    [...badeseen, ...freibaeder, ...wasserspiele, ...planschbecken].length === 0
  )
    return null;
  return (
    <div className="w-full flex items-center h-fit sm:items-stretch justify-around flex-col sm:flex-row gap-4 bg-hh-100 bg-opacity-50 p-2 rounded-[0_0_6px_6px] sm:rounded">
      <div className="flex flex-col items-center gap-2 mt-auto self-center min-w-full py-2">
        <select
          name="bezirk"
          id="bezirk-select"
          className="px-2 py-1 rounded-md bg-hh-600 font-semibold text-white w-fit capitalize"
          onChange={(e) =>
            setWhichList(e.target.value as keyof BadenGalleryProps)
          }
        >
          <option value="all">Alle Badestelle</option>
          {["badeseen", "freibaeder", "planschbecken", "wasserspiele"].map(
            (badestelle) => (
              <option
                key={badestelle}
                value={badestelle}
                className="capitalize"
              >
                {badestelle}
              </option>
            )
          )}
        </select>
        <div className="w-full max-w-[300px] aspect-[6/7] rounded bg-hh-900 bg-opacity-10">
          <ShuffleGallery list={list[whichList]} shuffle={true} />
        </div>
      </div>
    </div>
  );
}
