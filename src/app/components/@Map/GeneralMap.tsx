"use client";
import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { iAddress, iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import {
  isTypeEvent,
  isTypeFlohmarkt,
  isTypePost,
  isTypeSpielplatz,
  joinAddress,
} from "@app/utils/functions";
import SpielplatzPopUP from "@components/@Map/PopUpsMarkers/SpielplatzPopUP";
import FlohmarktPopUP from "./PopUpsMarkers/FlohmarktPopUP";
import PostPopUP from "./PopUpsMarkers/PostPopUP";
import { createStandortMapIcon } from "./functions";

const MainLocationIcon = divIcon({
  html: createStandortMapIcon("#b72f1e", 35, "#b72f1e80", true),
  className: "bg-transparent",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const GeneralMap = ({
  currentTarget,
  children,
  zoom = 10,
  rounded = true,
}: {
  zoom?: number;
  rounded?: boolean;
  children?: React.ReactNode;
  currentTarget?: iPost | iFlohmarkt | iSpielplatz;
}) => {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={
          currentTarget?.lat && currentTarget?.lon
            ? `${currentTarget.lat},${currentTarget.lon}`
            : "default"
        }
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        center={[currentTarget?.lat || 53.5511, currentTarget?.lon || 9.9937]}
        zoom={zoom}
        scrollWheelZoom={true}
        closePopupOnClick
        className={"relative " + rounded ? "rounded" : ""}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentTarget?.lat && currentTarget?.lon && (
          <Marker
            position={[currentTarget.lat, currentTarget.lon]}
            icon={MainLocationIcon}
          >
            {isTypeSpielplatz(currentTarget) ? (
              <SpielplatzPopUP
                title={(currentTarget as iSpielplatz).title}
                id={currentTarget.id}
                type={(currentTarget as iSpielplatz).type}
                spielgeraete={(currentTarget as iSpielplatz).spielgeraete || []}
                address={
                  currentTarget.address
                    ? joinAddress(currentTarget.address as iAddress)
                    : ""
                }
                image={currentTarget.image?.[0]}
              />
            ) : isTypeFlohmarkt(currentTarget) ? (
              <FlohmarktPopUP
                id={currentTarget.id}
                title={(currentTarget as iFlohmarkt).title}
                address={currentTarget.address as string}
                date={(currentTarget as iFlohmarkt).date}
                endDate={currentTarget.endDate}
                image={currentTarget.image}
                type={isTypeEvent(currentTarget) ? "events" : "flohmaerkte"}
              />
            ) : (
              isTypePost(currentTarget) && (
                <PostPopUP
                  image={
                    currentTarget.image &&
                    typeof currentTarget.image === "string"
                      ? currentTarget.image
                      : currentTarget.image?.[0]
                  }
                  address={currentTarget.address as iAddress}
                  categories={(currentTarget as iPost).categories}
                  id={currentTarget.id}
                  title={currentTarget.title}
                />
              )
            )}
          </Marker>
        )}
        {children}
      </MapContainer>
    </div>
  );
};

export default GeneralMap;
