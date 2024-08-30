"use client";
import FlohmarktPopUP from "@app/components/@Map/PopUpsMarkers/FlohmarktPopUP";
import PostPopUP from "@app/components/@Map/PopUpsMarkers/PostPopUP";
import SpielplatzPopUP from "@app/components/@Map/PopUpsMarkers/SpielplatzPopUP";
import { createStandortMapIcon, joinAddress } from "@app/utils/functions";
import { iAddress, iListsFPS } from "@app/utils/types";
import { divIcon, point } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

export const createNormalSizeIcon = (color: string, size: number = 30) =>
  divIcon({
    html: createStandortMapIcon(color, size),
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
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

const ConditionalCluster = ({
  cluster,
  children,
  type,
}: {
  type: "flohmarkt" | "spielplatz" | "post";
  cluster: boolean;
  children: React.ReactNode;
}) =>
  cluster ? (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterGroupIcon(type)}
    >
      {children}
    </MarkerClusterGroup>
  ) : (
    <>{children}</>
  );

export default function MarkersLists({
  lists,
  showSpielplaetze = true,
  showFlohmaerkte = true,
  showPosts = true,
  cluster = true,
  customPostMarker,
}: {
  lists: iListsFPS;
  showSpielplaetze?: boolean;
  showFlohmaerkte?: boolean;
  showPosts?: boolean;
  customPostMarker?: ({
    lat,
    lon,
    id,
    title,
    minAge,
    maxAge,
    stadtteil,
    bezirk,
    address,
  }: {
    address: iAddress | undefined;
    title: string;
    minAge?: number;
    maxAge?: number;
    lat?: number;
    lon?: number;
    id: number;
    stadtteil?: string;
    bezirk?: string;
  }) => React.JSX.Element;
  cluster?: boolean;
}) {
  const flohmaerkte = lists.flohmaerkte || [];
  const posts = lists.posts || [];
  const spielplaetze = lists.spielplaetze || [];

  return (
    <>
      {showFlohmaerkte && (
        <ConditionalCluster cluster={cluster} type="flohmarkt">
          {flohmaerkte
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
        </ConditionalCluster>
      )}
      {showPosts && (
        <ConditionalCluster cluster={cluster} type="post">
          {posts
            .filter(({ lat, lon, address }) => !!lat && !!lon && !!address)
            .map(
              ({
                lon,
                lat,
                address,
                id,
                minAge,
                image,
                maxAge,
                title,
                categories,
                stadtteil,
                bezirk,
              }) => (
                <>
                  {customPostMarker ? (
                    customPostMarker({
                      lat,
                      lon,
                      id,
                      title,
                      minAge,
                      maxAge,
                      address,
                      stadtteil,
                      bezirk,
                    })
                  ) : (
                    <Marker icon={postIcon} key={id} position={[lat!, lon!]}>
                      <PostPopUP
                        image={image && image[0]}
                        address={address!}
                        categories={categories}
                        title={title}
                        id={id}
                      />
                    </Marker>
                  )}
                </>
              )
            )}
        </ConditionalCluster>
      )}

      {showSpielplaetze && (
        <ConditionalCluster cluster={cluster} type="spielplatz">
          {spielplaetze
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
        </ConditionalCluster>
      )}
    </>
  );
}
