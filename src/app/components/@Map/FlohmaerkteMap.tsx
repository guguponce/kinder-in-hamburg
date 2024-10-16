"use client";
import React, { useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
import { getDate } from "@app/utils/functions";
import WeitereFlohmaerkte from "../WeitereFlohmaerkte";
import MarkersLists from "./PopUpsMarkers/MarkersLists";
import Button from "../Button";

const stadtteilLocationIcon = new Icon({
  iconUrl: "/assets/icons/stadtteilLocation.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MainLocationIcon = new Icon({
  iconUrl: "/assets/icons/currentLocation.svg",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

export default function FlohmaerkteMap({
  flohmarktID,
  flohmaerkte,
  currentTarget,
  displayList = true,
}: {
  displayList?: boolean;
  flohmarktID: string | number | undefined;
  currentTarget?: iFlohmarkt;
  flohmaerkte: iFlohmarkt[];
}) {
  const bezirke = useRef(
    Array.from(new Set(flohmaerkte.map((p) => p.bezirk).flat()))
  );
  const dates = useRef(
    Array.from(new Set(flohmaerkte.map((p) => p.date))).sort((a, b) => a - b)
  );

  const flohmaerkteBezirke = useRef(
    Array.from(new Set(flohmaerkte.map(({ bezirk }) => bezirk)))
  );
  const [selectedFlohmarkt, setSelectedFlohmarkt] = React.useState<
    number | undefined
  >(currentTarget?.id);
  const [selectedDate, setSelectedDate] = React.useState<number | undefined>(
    undefined
  );
  const [selectedBezirk, setSelectedBezirk] = React.useState<
    iBezirk | undefined
  >();
  const displayedMarkers = useMemo(() => {
    const dateFlohmaerkte = flohmaerkte.filter(
      ({ date }) => !selectedDate || date === selectedDate
    );
    const restFlohmaerkte = dateFlohmaerkte.filter(
      ({ id }) => id.toString() !== flohmarktID
    );
    return selectedBezirk
      ? restFlohmaerkte.filter((p) => p.bezirk === selectedBezirk)
      : restFlohmaerkte;
  }, [selectedBezirk, flohmaerkte, selectedDate, flohmarktID]);

  const centralFlohmarkt = currentTarget;

  return (
    <section className="w-full sm:w-full flex flex-col md:flex-row md:flex-wrap items-stretch gap-2 sm:gap-4 rounded">
      <article className="max-h-[60vh] min-h-[250px] flex-grow xs:min-w-[300px] max-w-[800px] md:max-w-[calc(75%-2rem)] lg:max-w-[800px] aspect-[3/2] md:aspect-auto lg:aspect-square flex justify-center rounded overflow-hidden">
        <MapContainer
          doubleClickZoom={true}
          touchZoom={true}
          zoomControl={true}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", zIndex: 10 }}
          center={[
            centralFlohmarkt?.lat || 53.5511,
            centralFlohmarkt?.lon || 9.9937,
          ]}
          zoom={
            flohmaerkteBezirke.current.length === 1
              ? 15
              : ["Wandsbek", "Bergedorf"].some((b) =>
                    flohmaerkteBezirke.current.includes(b as iBezirk)
                  )
                ? 10
                : 11
          }
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {currentTarget && currentTarget.lat && currentTarget.lon && (
            <Marker
              position={[currentTarget.lat, currentTarget.lon]}
              icon={MainLocationIcon}
            >
              <Popup className="font-sans">
                <Link
                  href={`/flohmaerkte/${flohmarktID}`}
                  className="font-semibold text-base block"
                >
                  {currentTarget.title}
                </Link>
                <small className="font-semibold italic">
                  {getDate(currentTarget.date)} ({currentTarget.time}) -{" "}
                  {currentTarget.stadtteil}
                </small>
                <p className="text-xs">{currentTarget.address}</p>
              </Popup>
            </Marker>
          )}
          <MarkersLists
            cluster={displayedMarkers.length > 15}
            lists={{ flohmaerkte: displayedMarkers }}
          />
        </MapContainer>
      </article>
      <aside
        id="flohmaerkte-map-filters-aside"
        className="px-2 pb-2 w-full md:w-1/4 xs:min-w-[300px] max-w-full lg:w-full flex flex-col"
      >
        {[
          ["Termine", dates.current],
          ["Bezirke", bezirke.current],
        ].map(([name, arr]) =>
          arr.length > 1 && typeof arr === "object" ? (
            <div className="flex w-full flex-col" key={name as string}>
              <h3 className="font-bold text-lg p-2 text-hh-800">{name}</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {arr.map((item) => {
                  const selected =
                    (name === "Termine" && selectedDate === item) ||
                    (name === "Bezirke" && selectedBezirk === item);
                  return (
                    <React.Fragment key={item}>
                      <Button
                        onClick={() => {
                          if (name === "Termine")
                            setSelectedDate((prev) =>
                              prev === (item as number)
                                ? undefined
                                : (item as number)
                            );
                          else
                            setSelectedBezirk((prev) =>
                              prev === (item as iBezirk)
                                ? undefined
                                : (item as iBezirk)
                            );
                        }}
                        fontWeight="normal"
                        variant={selected ? "hh-dark" : "white"}
                        size="fit"
                        fontSize="sm"
                      >
                        {name === "Termine" ? getDate(item as number) : item}
                      </Button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ) : null
        )}
      </aside>
      {displayList && (
        <>
          <hr className="w-full border-t border-hh-800" />
          {displayedMarkers.length > 0 && (
            <section className="w-full max-w-[800px] flex flex-col gap-2 items-center my-4">
              <h3 className="font-bold text-2xl text-hh-800">
                Weitere Märkte diese Woche:
              </h3>
              <WeitereFlohmaerkte displayedMarkers={displayedMarkers} />
            </section>
          )}
        </>
      )}
    </section>
  );
}
