"use client";
import { iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";

import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import Link from "next/link";
import TriangleIcon from "@components/@Icons/TriangleIcon";
import ShuffleGallery from "@app/components/@Cards/ShuffleGallery";
import GeneralMap from "@app/components/@Map/GeneralMap";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import { createStandortMapIcon } from "@app/components/@Map/functions";
import { distanceFilter } from "@app/utils/functions";

const CurrentSelectedSpielplatzIcon = divIcon({
  html: createStandortMapIcon("#F6AA1C", 30),
  className: "bg-transparent",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function SPBezirkMap({
  spList,
  currentSP,
  selector = false,
  maxDistance = 2000,
}: {
  selector?: boolean;
  spList: iSpielplatz[];
  currentSP?: number;
  maxDistance?: number;
}) {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const { current: currentSpielplatz } = useRef(
    spList.find((sp) => sp.id === currentSP)
  );
  const displayedSpList = useMemo(() => {
    if (!currentSpielplatz?.lat && !currentSpielplatz?.lon) return spList;
    const veryNearSpielplaetze = distanceFilter(
      spList,
      currentSpielplatz,
      maxDistance
    );

    const nearSpielplaetze = !!veryNearSpielplaetze.length
      ? veryNearSpielplaetze
      : distanceFilter(spList, currentSpielplatz, maxDistance + 1000);

    return (nearSpielplaetze as { sp: iSpielplatz; distance: number }[]).map(
      ({ sp }) => sp
    );
  }, [spList, currentSpielplatz, maxDistance]);

  const filteredCurrentList = useMemo(
    () => displayedSpList.filter((sp) => sp.id !== currentSP),
    [displayedSpList, currentSP]
  );
  const { selectedSP, otherSP } = useMemo(() => {
    return {
      selectedSP: filteredCurrentList[selectedIndex],
      otherSP: filteredCurrentList.filter((s) => s.id !== selectedIndex),
    };
  }, [selectedIndex, filteredCurrentList]);

  return (
    <div
      className={`w-full max-w-[400px] md:max-w-full ${
        !!filteredCurrentList.length
          ? "max-h-[80vh] md:max-h-[300px] lg:max-h-[calc(100dvh-1rem)] h-full"
          : "h-[400px]"
      }  aspect-[0.5] shadow-md bg-hh-700 bg-opacity-90  flex flex-col md:flex-row lg:flex-col items-stretch lg:items-center p-2 gap-2 rounded mx-auto`}
    >
      <article className="w-full py-2 px-1 md:w-1/2 lg:w-full flex-grow md:h-full flex flex-col items-center rounded bg-hh-800">
        <div className="w-full flex flex-wrap justify-around gap-2 mx-auto px-4 py-2 rounded-[2px_2px_0_0] bg-hh-50">
          {[
            { title: currentSpielplatz?.title, color: "negative-700" },
            {
              title: !!otherSP.length && "Spielplätze in der Nähe",
              color: "positive-700",
            },
          ].map(({ title, color }) =>
            title ? (
              <div className="flex gap-1 items-center" key={title}>
                <TriangleIcon
                  color={color === "negative-700" ? "#b72f1e" : "#344a31"}
                  rotate={90}
                  size="1rem"
                />
                <h2
                  className={`text-xs leading-none font-semibold text-${color}`}
                >
                  {title}
                </h2>
              </div>
            ) : null
          )}
        </div>
        <div className="w-full h-full rounded-[0_0_2px_2px] overflow-hidden">
          <GeneralMap currentTarget={currentSpielplatz} zoom={12}>
            <MarkersLists
              cluster={false}
              lists={{
                spielplaetze: otherSP,
              }}
            />
            {selectedSP && (
              <Marker
                zIndexOffset={300}
                position={[selectedSP.lat, selectedSP.lon]}
                icon={CurrentSelectedSpielplatzIcon}
              >
                <Popup
                  className="font-sans"
                  keepInView={true}
                  autoPan={true}
                  maxWidth={200}
                >
                  <Link
                    href={`/spielplaetze/${selectedSP.id}`}
                    className="font-semibold text-base block"
                    target="_blank"
                  >
                    {selectedSP.title}
                  </Link>
                  <small className="text-sm font-bold capitalize block">
                    {selectedSP.type?.join(" / ") || ""}
                  </small>
                  {selectedSP.spielgeraete && (
                    <small className="text-xs font-semibold italic  capitalize block">
                      {selectedSP.spielgeraete.slice(0, 8).join(" - ") || ""}
                      {selectedSP.spielgeraete.length > 8 ? "..." : ""}
                    </small>
                  )}
                </Popup>
              </Marker>
            )}
          </GeneralMap>
        </div>
      </article>
      {selector && !!filteredCurrentList.length && (
        <article className="w-full md:w-1/2 lg:w-full h-1/2 md:h-full lg:h-1/2 min-h-fit border-4 border-orange-300 rounded-md">
          <ShuffleGallery
            idSetter={setSelectedIndex}
            list={filteredCurrentList}
            shuffle={true}
            size="medium"
          ></ShuffleGallery>
        </article>
      )}
    </div>
  );
}
