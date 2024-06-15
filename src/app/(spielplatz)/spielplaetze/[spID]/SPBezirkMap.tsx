"use client";
import { iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { latLng, divIcon } from "leaflet";
import Link from "next/link";
import { createStandortMapIcon, joinAddress } from "@app/utils/functions";
import TriangleIcon from "@components/@Icons/TriangleIcon";
import ShuffleGallery from "@app/components/ShuffleGallery";

const bezirkLocationIcon = divIcon({
  html: createStandortMapIcon("#39579D", 30),
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: "bg-transparent",
  shadowAnchor: [4, 62],
  shadowSize: [68, 95],
});

const stadtteilLocationIcon = divIcon({
  // iconUrl: "/assets/icons/selectedLocation.svg",
  html: createStandortMapIcon("#F6AA1C", 30),
  className: "bg-transparent",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MainLocationIcon = divIcon({
  html: createStandortMapIcon("#BC251F", 35),
  className: "bg-transparent",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function groupSpielgeraete(geraete: string[]) {
  return geraete.map((g) =>
    ["rutsche", "kleinkindrutsche", "röhrenrutsche"].includes(g)
      ? "rutsche"
      : ["schaukel", "kleinkindschaukel", "nestschaukel"].includes(g)
      ? "schaukel"
      : g
  );
}

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
  const currentSPLocation = currentSpielplatz.current
    ? latLng(currentSpielplatz.current.lat, currentSpielplatz.current.lon)
    : undefined;

  const displayedSpList = useMemo(() => {
    if (!currentSpielplatz.current) return spList;
    return spList.filter(
      (sp) =>
        latLng(
          currentSpielplatz.current!.lat,
          currentSpielplatz.current!.lon
        ).distanceTo(latLng(sp.lat, sp.lon)) < 2000
    );
  }, [spList]);
  const filteredCurrentList = useMemo(
    () => displayedSpList.filter((s) => s.id !== currentSP),
    [displayedSpList, currentSP]
  );
  const selectedSP = useMemo(() => {
    return filteredCurrentList[selectedIndex];
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
        <MapContainer
          style={{ height: "100%", width: "100%", zIndex: 10 }}
          center={[
            currentSpielplatz.current?.lat || 53.5511,
            currentSpielplatz.current?.lon || 9.9937,
          ]}
          zoom={currentSpielplatz.current ? 13 : 10}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {currentSpielplatz.current && (
            <Marker
              position={[
                currentSpielplatz.current.lat,
                currentSpielplatz.current.lon,
              ]}
              icon={MainLocationIcon}
            >
              <Popup className="font-sans" keepInView={true} maxWidth={200}>
                <Link
                  href={"/spielplaetze/" + currentSpielplatz.current.id}
                  className="font-semibold text-base block"
                >
                  {currentSpielplatz.current.title}
                </Link>

                <small className="text-sm font-bold capitalize block">
                  {currentSpielplatz.current.type?.join(" / ") || ""}
                </small>
                {currentSpielplatz.current.spielgeraete && (
                  <small className="text-xs font-semibold italic  capitalize block">
                    {currentSpielplatz.current.spielgeraete
                      .slice(0, 8)
                      .join(" - ") || ""}
                    {currentSpielplatz.current.spielgeraete.length > 8
                      ? "..."
                      : ""}
                  </small>
                )}
                <p className="text-xs">
                  {currentSpielplatz.current.address &&
                    joinAddress(currentSpielplatz.current.address)}
                </p>
              </Popup>
            </Marker>
          )}
          {displayedSpList.map(
            ({ title, id, lat, lon, stadtteil, type, spielgeraete }) =>
              id === currentSP ? null : (
                <React.Fragment key={id}>
                  <Marker
                    position={[lat, lon]}
                    icon={
                      selectedSP.id === id
                        ? stadtteilLocationIcon
                        : bezirkLocationIcon
                    }
                  >
                    <Popup
                      className="font-sans"
                      keepInView={true}
                      autoPan={true}
                      maxWidth={200}
                    >
                      <Link
                        href={`/spielplaetze/${id}`}
                        className="font-semibold text-base block"
                        target="_blank"
                      >
                        {title}
                      </Link>
                      <small className="text-sm font-bold capitalize block">
                        {type?.join(" / ") || ""}
                      </small>
                      {spielgeraete && (
                        <small className="text-xs font-semibold italic  capitalize block">
                          {spielgeraete.slice(0, 8).join(" - ") || ""}
                          {spielgeraete.length > 8 ? "..." : ""}
                        </small>
                      )}
                    </Popup>
                  </Marker>
                </React.Fragment>
              )
          )}
        </MapContainer>
        <div className="w-full flex flex-wrap justify-around gap-2 mx-auto px-4 pb-2">
          {[
            { title: currentSpielplatz.current?.title, color: "#BC251F" },
            { title: "Spielplätze in der Nähe", color: "#39579D" },
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
