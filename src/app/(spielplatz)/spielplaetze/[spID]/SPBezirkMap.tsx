"use client";
import { iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";

import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import { latLng, divIcon } from "leaflet";
import Link from "next/link";
import { createStandortMapIcon, haversineDistance } from "@app/utils/functions";
import TriangleIcon from "@components/@Icons/TriangleIcon";
import ShuffleGallery from "@app/components/ShuffleGallery";
import GeneralMap from "@app/components/@Map/GeneralMap";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";

const CurrentSelectedSpielplatzIcon = divIcon({
  // iconUrl: "/assets/icons/selectedLocation.svg",
  html: createStandortMapIcon("#F6AA1C", 30),
  className: "bg-transparent",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

export default function SPBezirkMap({
  spList,
  currentSP,
  selector = false,
}: {
  selector?: boolean;
  spList: iSpielplatz[];
  currentSP?: number;
}) {
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const currentSpielplatz = useRef(spList.find((sp) => sp.id === currentSP));

  const displayedSpList = useMemo(() => {
    if (!currentSpielplatz.current) return spList;
    if (!currentSpielplatz.current.lat && !currentSpielplatz.current.lon)
      return spList;
    return spList
      .filter(
        (sp) =>
          latLng(
            currentSpielplatz.current!.lat,
            currentSpielplatz.current!.lon
          ).distanceTo(latLng(sp.lat, sp.lon)) < 2000
      )
      .sort(
        (a, b) =>
          haversineDistance(
            a.lat,
            a.lon,
            currentSpielplatz.current!.lat,
            currentSpielplatz.current!.lon
          ) -
          haversineDistance(
            b.lat,
            b.lon,
            currentSpielplatz.current!.lat,
            currentSpielplatz.current!.lon
          )
      );
  }, [spList]);
  const filteredCurrentList = useMemo(
    () => displayedSpList.filter((s) => s.id !== currentSP),
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
          ? "max-h-[80vh] md:max-h-[300px] lg:max-h-[calc(100dvh-1rem)]"
          : "h-[400px]"
      }  aspect-[0.5] shadow-md bg-hh-700 bg-opacity-90  flex flex-col md:flex-row lg:flex-col items-stretch lg:items-center p-2 gap-2 rounded mx-auto`}
    >
      <article className="w-full md:w-1/2 lg:w-full max-h-fit h-1/2 md:h-full lg:h-1/2 flex-grow  flex flex-col items-center gap-2 rounded bg-hh-900">
        <GeneralMap currentTarget={currentSpielplatz.current} zoom={12}>
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

        <div className="w-full flex flex-wrap justify-around gap-2 mx-auto px-4 pb-2">
          {[
            { title: currentSpielplatz.current?.title, color: "#BC251F" },
            {
              title: !!otherSP.length && "Spielplätze in der Nähe",
              color: "#17684D",
            },
            {
              title: filteredCurrentList[selectedIndex]?.title,
              color: "#F6AA1C",
            },
          ].map(({ title, color }) =>
            title ? (
              <div className="flex gap-1 items-center" key={title}>
                <TriangleIcon color={color} rotate={90} size="1rem" />
                <h2 className="text-xs leading-none text-white">
                  {/* {!title?.includes("Spielplatz") && "Spielplatz"}  */}
                  {title}
                </h2>
              </div>
            ) : null
          )}
        </div>
      </article>
      {selector && !!filteredCurrentList.length && (
        <article className="w-full md:w-1/2 lg:w-full h-1/2 md:h-full lg:h-1/2 min-h-fit">
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
