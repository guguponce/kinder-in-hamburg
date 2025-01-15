"use client";
import { iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";

import "leaflet/dist/leaflet.css";
import { Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import TriangleIcon from "@components/@Icons/TriangleIcon";
import ShuffleGallery from "@app/components/@Cards/ShuffleGallery";
import GeneralMap from "@app/components/@Map/GeneralMap";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import { createStandortMapIcon } from "@app/components/@Map/functions";
import { distanceFilter } from "@app/utils/functions";
import SpielplatzPopUP from "@app/components/@Map/PopUpsMarkers/SpielplatzPopUP";

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

  const otherSpielplaetzeList = useMemo(
    () => displayedSpList.filter((sp) => sp.id !== currentSP),
    [displayedSpList, currentSP]
  );
  const { selectedSP, otherSP } = useMemo(() => {
    return {
      selectedSP: otherSpielplaetzeList[selectedIndex],
      otherSP: otherSpielplaetzeList.filter((s) => s.id !== selectedIndex),
    };
  }, [selectedIndex, otherSpielplaetzeList]);

  return (
    <div
      className={`w-full max-w-[400px] sm:max-w-full ${
        !!otherSpielplaetzeList.length
          ? "sm:max-h-[300px] lg:max-h-[calc(100dvh-1rem)] h-fit max-h-fit sm:aspect-[0.5] bg-hh-700 shadow-md p-2 "
          : "sm:h-[300px] justify-center bg-transparent"
      } bg-opacity-90  flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-center gap-2 rounded mx-auto`}
    >
      <article
        className={`w-full p-2 ${otherSpielplaetzeList.length ? "sm:w-1/2" : "sm:max-w-[600px]"} lg:w-full aspect-[4/3] sm:aspect-auto sm:h-full flex flex-col items-center rounded bg-hh-800`}
      >
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
                <SpielplatzPopUP
                  title={selectedSP.title}
                  id={selectedSP.id}
                  type={selectedSP.type}
                  spielgeraete={selectedSP.spielgeraete || []}
                />
              </Marker>
            )}
          </GeneralMap>
        </div>
      </article>
      {selector && !!otherSpielplaetzeList.length && (
        <article className="w-full sm:w-1/2 lg:w-full  aspect-[4/3] sm:aspect-auto sm:h-full lg:h-1/2 min-h-fit border-4 border-orange-300 rounded-md">
          <ShuffleGallery
            idSetter={setSelectedIndex}
            list={otherSpielplaetzeList}
            shuffle={true}
            size="medium"
          ></ShuffleGallery>
        </article>
      )}
    </div>
  );
}
