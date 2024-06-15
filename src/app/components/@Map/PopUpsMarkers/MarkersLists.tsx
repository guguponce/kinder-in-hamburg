"use client";
import FlohmarktPopUP from "@app/components/@Map/PopUpsMarkers/FlohmarktPopUP";
import PostPopUP from "@app/components/@Map/PopUpsMarkers/PostPopUP";
import SpielplatzPopUP from "@app/components/@Map/PopUpsMarkers/SpielplatzPopUP";
import { createStandortMapIcon, joinAddress } from "@app/utils/functions";
import { iListsFPS } from "@app/utils/types";
import { divIcon } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";

const createNormalSizeIcon = (color: string) =>
  divIcon({
    html: createStandortMapIcon(color, 30),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    className: "bg-transparent",
  });
const flohmarktIcon = createNormalSizeIcon("#7B3E5E");
const postIcon = createNormalSizeIcon("#33404D");
const spielplatzIcon = createNormalSizeIcon("#17684D");

export default function MarkersLists({
  lists,
  showSpielplaetze = true,
  showFlohmaerkte = true,
  showPosts = true,
}: {
  lists: iListsFPS;
  showSpielplaetze?: boolean;
  showFlohmaerkte?: boolean;
  showPosts?: boolean;
}) {
  const flohmaerkte = lists.flohmaerkte || [];
  const posts = lists.posts || [];
  const spielplaetze = lists.spielplaetze || [];
  return (
    <>
      {showFlohmaerkte &&
        flohmaerkte
          .filter(({ lat, lon }) => !!lat && !!lon)
          .map(({ lon, lat, address, id, title, date }) => (
            <Marker icon={flohmarktIcon} key={id} position={[lat!, lon!]}>
              <FlohmarktPopUP
                address={address}
                date={date}
                title={title}
                id={id}
              />
            </Marker>
          ))}
      {showPosts &&
        posts
          .filter(({ lat, lon, address }) => !!lat && !!lon && !!address)
          .map(({ lon, lat, address, id, title, categories }) => (
            <Marker icon={postIcon} key={id} position={[lat!, lon!]}>
              <PostPopUP
                address={address!}
                categories={categories}
                title={title}
                id={id}
              />
            </Marker>
          ))}
      {showSpielplaetze &&
        spielplaetze
          .filter(({ address }) => !!address)
          .map(({ lon, lat, address, id, title, type, spielgeraete }) => (
            <Marker key={id} position={[lat!, lon!]} icon={spielplatzIcon}>
              <SpielplatzPopUP
                address={joinAddress(address!)}
                title={title}
                id={id}
                spielgeraete={spielgeraete || []}
                type={type}
              />
            </Marker>
          ))}
    </>
  );
}
