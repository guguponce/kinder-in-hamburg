"use client";
import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { iAddress, iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import {
  isTypeFlohmarkt,
  isTypePost,
  isTypeSpielplatz,
  joinAddress,
} from "@app/utils/functions";
import SpielplatzPopUP from "@app/components/@Map/PopUpsMarkers/SpielplatzPopUP";
import FlohmarktPopUP from "./PopUpsMarkers/FlohmarktPopUP";
import PostPopUP from "./PopUpsMarkers/PostPopUP";
import { createStandortMapIcon } from "./functions";
import { UserLocationIcon } from "./MarkerIcons";

const MainLocationIcon = divIcon({
  html: createStandortMapIcon("#b72f1e", 35),
  className: "bg-transparent",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const GeneralMap = ({
  currentTarget,
  children,
  zoom = 10,
  userLocation,
  centerUserLocation = false,
}: {
  zoom?: number;
  children?: React.ReactNode;
  currentTarget?: iPost | iFlohmarkt | iSpielplatz;
  userLocation?: { lat: number; lon: number } | null;
  centerUserLocation?: boolean;
}) => {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%", zIndex: 10 }}
      center={[
        centerUserLocation && userLocation
          ? userLocation?.lat
          : currentTarget?.lat || 53.5511,
        centerUserLocation && userLocation
          ? userLocation.lon
          : currentTarget?.lon || 9.9937,
      ]}
      zoom={zoom}
      scrollWheelZoom={true}
      closePopupOnClick
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lon]}
          icon={UserLocationIcon}
        />
      )}

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
            />
          ) : isTypeFlohmarkt(currentTarget) ? (
            <FlohmarktPopUP
              address={currentTarget.address as string}
              date={(currentTarget as iFlohmarkt).date}
              id={currentTarget.id}
              title={(currentTarget as iFlohmarkt).title}
            />
          ) : (
            isTypePost(currentTarget) && (
              <PostPopUP
                image={
                  currentTarget.image && typeof currentTarget.image === "string"
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
  );
};

export default GeneralMap;
