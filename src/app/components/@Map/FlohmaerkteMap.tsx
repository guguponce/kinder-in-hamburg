"use client";
import React, { useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import {
  iBezirk,
  iFlohmarkt,
  iFlohmarktWithCoordinates,
} from "@app/utils/types";
import Link from "next/link";
import { getDate } from "@app/utils/functions";
import WeitereFlohmaerkte from "../WeitereFlohmaerkte";

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

const FlohmaerkteMap = ({
  flohmarktID,
  flohmaerkteWithCoordinates,
  currentTarget,
  displayList = true,
}: {
  displayList?: boolean;
  flohmarktID: string | number | undefined;
  currentTarget?: iFlohmarktWithCoordinates | iFlohmarkt;
  flohmaerkteWithCoordinates: iFlohmarktWithCoordinates[] | iFlohmarkt[];
}) => {
  const bezirke = useRef(
    Array.from(new Set(flohmaerkteWithCoordinates.map((p) => p.bezirk).flat()))
  );
  const dates = useRef(
    Array.from(new Set(flohmaerkteWithCoordinates.map((p) => p.date))).sort(
      (a, b) => a - b
    )
  );

  const flohmaerkteBezirke = useRef(
    Array.from(new Set(flohmaerkteWithCoordinates.map(({ bezirk }) => bezirk)))
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
    const dateFlohmaerkte = flohmaerkteWithCoordinates.filter(
      ({ date }) => !selectedDate || date === selectedDate
    );
    const restFlohmaerkte = dateFlohmaerkte.filter(
      ({ id }) => id.toString() !== flohmarktID
    );
    return selectedBezirk
      ? restFlohmaerkte.filter((p) => p.bezirk === selectedBezirk)
      : restFlohmaerkte;
  }, [selectedBezirk, flohmaerkteWithCoordinates, selectedDate, flohmarktID]);

  const centralFlohmarkt = currentTarget || displayedMarkers[0];

  return (
    <section className="w-full sm:w-full md:max-w-[800px] flex flex-wrap gap-2 sm:gap-4 rounded">
      <article className="max-h-[60vh] flex-grow xs:min-w-[300px] max-w-[800px] aspect-square flex justify-center rounded overflow-hidden">
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
              : flohmaerkteBezirke.current.includes("Wandsbek")
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
          {displayedMarkers.map(
            ({ title, address, date, id, lat, lon, stadtteil, time }) =>
              lat && lon ? (
                <React.Fragment key={id}>
                  <Marker
                    position={[lat, lon]}
                    icon={
                      currentTarget?.id === id
                        ? MainLocationIcon
                        : stadtteilLocationIcon
                    }
                  >
                    <Popup className="font-sans">
                      <Link
                        href={`/flohmaerkte/${id}`}
                        className="font-semibold text-base block"
                      >
                        {title}
                      </Link>
                      <small className="font-semibold italic">
                        {getDate(date)} ({time}) - {stadtteil}
                      </small>
                      <p className="text-xs">{address}</p>
                    </Popup>
                  </Marker>
                </React.Fragment>
              ) : null
          )}
        </MapContainer>
      </article>
      <aside
        id="flohmaerkte-map-filters-aside"
        className="w-full sm:w-[300px] flex flex-col"
      >
        {[
          ["Termine", dates.current],
          ["Bezirke", bezirke.current],
        ].map(([name, arr]) =>
          arr.length > 1 && typeof arr === "object" ? (
            <div className="flex w-full flex-col" key={name as string}>
              <h3 className="font-bold text-lg p-2 text-hh-800">{name}</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {arr.map((item) => (
                  <button
                    key={item}
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
                    className={`text-sm p-1 tex-base xs:text-lg xs:p-2 rounded-md ${
                      (name === "Termine" && selectedDate === item) ||
                      (name === "Bezirke" && selectedBezirk === item)
                        ? "bg-hh-800 text-white  hover:bg-hh-600 hover:text-white"
                        : "bg-white text-hh-800  hover:bg-hh-600 hover:text-white"
                    } transition-all`}
                  >
                    {name === "Termine" ? getDate(item as number) : item}
                  </button>
                ))}
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
};

export default FlohmaerkteMap;
