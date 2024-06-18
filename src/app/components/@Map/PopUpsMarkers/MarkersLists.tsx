"use client";
import FlohmarktPopUP from "@app/components/@Map/PopUpsMarkers/FlohmarktPopUP";
import PostPopUP from "@app/components/@Map/PopUpsMarkers/PostPopUP";
import SpielplatzPopUP from "@app/components/@Map/PopUpsMarkers/SpielplatzPopUP";
import { createStandortMapIcon, joinAddress } from "@app/utils/functions";
import { iListsFPS } from "@app/utils/types";
import { divIcon, point } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const createNormalSizeIcon = (color: string) =>
  divIcon({
    html: createStandortMapIcon(color, 30),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    className: "bg-transparent",
  });
const createClusterGroupIcon =
  (type: "spielplatz" | "flohmarkt" | "post") => (cluster: any) =>
    divIcon({
      html: `<div class="clusterIcon ${
        type === "flohmarkt"
          ? "clusterIconFlohmarkt"
          : type === "spielplatz"
          ? "clusterIconSpielplatz"
          : "clusterIconPost"
      }">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(32, 32, true),
    });
const flohmarktIcon = createNormalSizeIcon("#7B3E5E");
const postIcon = createNormalSizeIcon("#33404D");
const spielplatzIcon = createNormalSizeIcon("#17684D");

export default function MarkersLists({
  lists,
  showSpielplaetze = true,
  showFlohmaerkte = true,
  showPosts = true,
  cluster = true,
}: {
  lists: iListsFPS;
  showSpielplaetze?: boolean;
  showFlohmaerkte?: boolean;
  showPosts?: boolean;
  cluster?: boolean;
}) {
  const flohmaerkte = lists.flohmaerkte || [];
  const posts = lists.posts || [];
  const spielplaetze = lists.spielplaetze || [];
  if (!cluster)
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
  return (
    <>
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterGroupIcon("flohmarkt")}
      >
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
      </MarkerClusterGroup>

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterGroupIcon("post")}
      >
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
      </MarkerClusterGroup>

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterGroupIcon("spielplatz")}
      >
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
      </MarkerClusterGroup>
    </>
  );
}
