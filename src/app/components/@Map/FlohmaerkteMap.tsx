"use client";
import React, { useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { iBezirk, iFlohmarktWithCoordinates } from "@app/utils/types";
import Link from "next/link";
import { getDate } from "@app/utils/functions";

const stadtteilLocationIcon = new Icon({
  iconUrl: "/assets/icons/stadtteilLocation.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MainLocationIcon = new Icon({
  iconUrl: "/assets/icons/currentLocation.svg",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
});

const Map = ({
  flohmarktID,
  flohmaerkteWithCoordinates,
  currentTarget,
}: {
  flohmarktID: string | undefined;
  currentTarget?: iFlohmarktWithCoordinates;
  flohmaerkteWithCoordinates: iFlohmarktWithCoordinates[];
}) => {
  const bezirke = useRef(
    Array.from(new Set(flohmaerkteWithCoordinates.map((p) => p.bezirk).flat()))
  );

  const flohmaerkteBezirke = useRef(
    Array.from(new Set(flohmaerkteWithCoordinates.map(({ bezirk }) => bezirk)))
  );
  const [selectedFlohmarkt, setSelectedFlohmarkt] = React.useState<
    number | undefined
  >(currentTarget?.id);
  const [selectedBezirk, setSelectedBezirk] = React.useState<
    iBezirk | undefined
  >();
  const displayedMarkers = useMemo(() => {
    const restFlohmaerkte = flohmaerkteWithCoordinates.filter(
      ({ id }) => id.toString() !== flohmarktID
    );
    return selectedBezirk
      ? restFlohmaerkte.filter((p) => p.bezirk === selectedBezirk)
      : restFlohmaerkte;
  }, [selectedBezirk, flohmaerkteWithCoordinates, flohmarktID]);

  const centralFlohmarkt = currentTarget || displayedMarkers[0];

  return (
    <section className="w-full sm:w-[calc(100%-2rem)] md:max-w-[800px] flex flex-col gap-2 sm:gap-4 items-center rounded">
      <article className="h-[60vh] w-full max-w-[800px] flex justify-center rounded overflow-hidden">
        <MapContainer
          style={{ height: "100%", width: "100%", zIndex: 10 }}
          center={[
            centralFlohmarkt.lat || 53.5511,
            centralFlohmarkt.lon || 9.9937,
          ]}
          zoom={
            flohmaerkteBezirke.current.length === 1
              ? 15
              : flohmaerkteBezirke.current.includes("Wandsbek")
              ? 10
              : 11
          }
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {currentTarget && (
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
            ({ title, address, date, id, lat, lon, stadtteil, time }) => (
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
            )
          )}
        </MapContainer>
      </article>
      {bezirke.current.length > 1 && (
        <aside className="flex w-full gap-2 my-2 p-2">
          <h3 className="font-bold text-lg p-2 text-hh-800">Bezirke:</h3>
          <div className="flex flex-wrap gap-2 items-center">
            {bezirke.current.map((bezirk) => (
              <button
                key={bezirk}
                onClick={() =>
                  setSelectedBezirk((prev) =>
                    prev === bezirk ? undefined : bezirk
                  )
                }
                className={`p-2 rounded-md ${
                  selectedBezirk === bezirk
                    ? "bg-hh-800 text-white  hover:bg-hh-600 hover:text-white"
                    : "bg-white text-hh-800  hover:bg-hh-600 hover:text-white"
                } transition-all`}
              >
                {bezirk}
              </button>
            ))}
            {selectedBezirk && (
              <button
                onClick={() => setSelectedBezirk(undefined)}
                className="p-2 rounded-md bg-white text-hh-800 hover:bg-hh-600 hover:text-white"
              >
                Alle Bezirke
              </button>
            )}
          </div>
        </aside>
      )}
      <hr className="w-full border-t border-hh-800" />
      {displayedMarkers.length > 0 && (
        <section className="w-full max-w-[800px] flex flex-col gap-2 items-center my-4">
          <h3 className="font-bold text-2xl text-hh-800">
            Flohmärkte dieser Woche:
          </h3>
          <ul className="w-full flex flex-wrap justify-center gap-2 items-stretch">
            {[...displayedMarkers]
              .sort((a, b) => a.date - b.date)
              .map(({ title, address, date, id, time, image }) => (
                <li
                  key={id}
                  className="w-[360px] sm:w-1/3 max-w-[380px] h-32 sm:flex-grow justify-center flex gap-2 items-center bg-white rounded-md overflow-hidden hover:shadow-md"
                >
                  <div className="h-full aspect-square min-w-1/3 w-1/3 bg-hh-50 bg-25 overflow-hidden flex justify-center items-center">
                    <img
                      src={image || "/assets/icons/market.svg"}
                      alt="location"
                      className={`${
                        image ? "w-full h-full" : "w-3/4 h-3/4"
                      } object-contain`}
                    />
                  </div>
                  <Link
                    href={`/flohmaerkte/${id}`}
                    className="flex flex-col w-2/3 h-full hover:text-hh-700 justify-between gap-2  p-2 pl-0 sm:pr-4 sm:p-2"
                  >
                    <span className="font-semibold text-base block">
                      {title}
                    </span>
                    <div className="flex flex-col">
                      <small className="font-semibold italic">
                        {getDate(date)} ({time})
                      </small>
                      <p className="text-xs">{address}</p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}
    </section>
  );
};

export default Map;
