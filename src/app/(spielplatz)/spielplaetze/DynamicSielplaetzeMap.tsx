"use client";
import { iBezirk, iSpielplatz } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
import GeneralMap from "../../components/@Map/GeneralMap";
import { Marker, Popup } from "react-leaflet";
import Link from "next/link";
import SpielplatzPopUP from "@app/components/@Map/PopUpsMarkers/SpielplatzPopUP";
import { createStandortMapIcon, joinAddress } from "@app/utils/functions";
import { divIcon } from "leaflet";

const StandortIcon = divIcon({
  html: createStandortMapIcon(undefined, 35),
  className: "bg-transparent",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

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
    <section className="w-full h-fit p-4 md:flex-row flex-wrap justify-center flex flex-col gap-2 items-center rounded">
      <article className="w-full h-[600px] flex justify-center rounded overflow-hidden">
        <GeneralMap>
          <>
            {displayedMarkers.map(
              ({ title, id, lat, lon, address, type, spielgeraete }) => (
                <React.Fragment key={id}>
                  <Marker position={[lat, lon]} icon={StandortIcon}>
                    <SpielplatzPopUP
                      title={title}
                      id={id}
                      type={type}
                      spielgeraete={spielgeraete || []}
                      address={address ? joinAddress(address) : ""}
                    />
                  </Marker>
                </React.Fragment>
              )
            )}
          </>
        </GeneralMap>
      </article>
      <aside className="flex flex-wrap justify-center gap-2">
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
        {selectedBezirk && (
          <button
            onClick={() => setSelectedBezirk(undefined)}
            className="p-2 rounded-md bg-white text-hh-900"
          >
            All Categories
          </button>
        )}
      </aside>
    </section>
  );
}
