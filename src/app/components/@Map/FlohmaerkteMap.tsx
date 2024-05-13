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

  const flohmaerkteIDS = useRef(
    flohmaerkteWithCoordinates
      .map(({ id }) => id)
      .sort((a) => (a === (currentTarget?.id || 0) ? -1 : 0))
  );
  const [selectedFlohmarkt, setSelectedFlohmarkt] = React.useState<
    number | undefined
  >(currentTarget?.id);
  const [selectedBezirk, setSelectedBezirk] = React.useState<
    iBezirk | undefined
  >();
  const displayedMarkers = useMemo(
    () =>
      selectedBezirk
        ? flohmaerkteWithCoordinates.filter((p) => p.bezirk === selectedBezirk)
        : flohmaerkteWithCoordinates,
    [selectedBezirk, flohmaerkteWithCoordinates]
  );

  const centralFlohmarkt = currentTarget || flohmaerkteWithCoordinates[0];
  return (
    <section className="w-[calc(100%-2rem)] max-w-[800px] flex flex-col gap-2 items-center rounded">
      {bezirke.current.length > 1 && (
        <aside className="flex flex-wrap justify-center gap-2">
          {bezirke.current.map((bezirk) => (
            <button
              key={bezirk}
              onClick={() => setSelectedBezirk(bezirk)}
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
      )}
      <article className="h-[60vh] w-full max-w-[800px] flex justify-center rounded overflow-hidden">
        <MapContainer
          style={{ height: "100%", width: "100%", zIndex: 10 }}
          center={[
            selectedBezirk || selectedBezirk !== centralFlohmarkt.bezirk
              ? displayedMarkers[0].lat
              : centralFlohmarkt.lat || 53.5511,
            selectedBezirk || selectedBezirk !== centralFlohmarkt.bezirk
              ? displayedMarkers[0].lon
              : centralFlohmarkt.lon || 9.9937,
          ]}
          zoom={11}
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
    </section>
  );
};

export default Map;
