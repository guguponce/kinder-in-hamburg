"use client";
import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { createStandortMapIcon } from "./functions";

const MainLocationIcon = divIcon({
  html: createStandortMapIcon("#b72f1e", 35),
  className: "bg-transparent",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const LatLonSetterMap = ({
  lat,
  lon,
  latlonSetter,
  setValue,
}: {
  lat: number;
  lon: number;
  latlonSetter: React.Dispatch<
    React.SetStateAction<{
      lat: number | undefined;
      lon: number | undefined;
    }>
  >;
  setValue: (key: "lat" | "lon", value: any) => void;
}) => {
  const [mapLatLon, setMapLatLon] = React.useState({ lat, lon });
  const [confirmed, setConfirmed] = React.useState(false);
  return (
    <section className="w-full max-w-[800px] flex flex-col gap-2 items-center rounded">
      <article className="h-[60vh] w-full max-w-[400px] flex justify-center rounded overflow-hidden">
        <MapContainer
          style={{ height: "100%", width: "100%", zIndex: 10 }}
          center={[lat, lon]}
          zoom={18}
          scrollWheelZoom={true}
          touchZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[mapLatLon.lat, mapLatLon.lon]}
            icon={MainLocationIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                setMapLatLon({
                  lat: e.target.getLatLng().lat,
                  lon: e.target.getLatLng().lng,
                });
                setConfirmed(false);
              },
            }}
          ></Marker>
        </MapContainer>
      </article>
      {lat !== mapLatLon.lat && lon !== mapLatLon.lon && (
        <button
          className="p-2 rounded break-words bg-positive-400 hover:bg-positive-500 text-positive-950 w-fit"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setValue("lat", mapLatLon.lat);
            setValue("lon", mapLatLon.lon);

            latlonSetter({
              lat: mapLatLon.lat,
              lon: mapLatLon.lon,
            });
            setConfirmed(true);
          }}
        >
          Confirm [{mapLatLon.lat}, {mapLatLon.lon}]
        </button>
      )}
      {confirmed && (
        <p className="p-2 rounded bg-positive-700  text-positive-100">
          Confirmed
        </p>
      )}
    </section>
  );
};

export default LatLonSetterMap;
