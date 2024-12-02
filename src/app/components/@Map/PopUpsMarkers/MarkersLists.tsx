"use client";
import FlohmarktPopUP from "@components/@Map/PopUpsMarkers/FlohmarktPopUP";
import PostPopUP from "@components/@Map/PopUpsMarkers/PostPopUP";
import SpielplatzPopUP from "@components/@Map/PopUpsMarkers/SpielplatzPopUP";
import { createStandortMapIcon, joinAddress } from "@app/utils/functions";
import { iAddress, iListsFPS } from "@app/utils/types";
import { divIcon, point } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  desaturatedWeihnachtsmarktIcon,
  weihnachtsmarktIcon,
} from "../functions";

export const createNormalSizeIcon = (color: string, size: number = 30) =>
  divIcon({
    html: createStandortMapIcon(color, size),
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    className: "bg-transparent",
  });

const createClusterGroupIcon =
  (type: "spielplatz" | "flohmarkt" | "post" | "event") => (cluster: any) =>
    divIcon({
      html: `<div class="clusterIcon ${
        type === "flohmarkt"
          ? "clusterIconFlohmarkt"
          : type === "spielplatz"
            ? "clusterIconSpielplatz"
            : type === "event"
              ? "clusterIconEvent"
              : "clusterIconPost"
      }">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(32, 32, true),
    });
const flohmarktIcon = createNormalSizeIcon("#7B3E5E");
const postIcon = createNormalSizeIcon("#33404D");
const spielplatzIcon = createNormalSizeIcon("#405b3a");
const eventIcon = createNormalSizeIcon("#de6c13");

const ConditionalCluster = ({
  cluster,
  children,
  type,
}: {
  type: "flohmarkt" | "spielplatz" | "post" | "event";
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
  const events = lists.events || [];
  const today = Date.now();
  return (
    <>
      {showFlohmaerkte && (
        <ConditionalCluster cluster={cluster} type="flohmarkt">
          {flohmaerkte
            .filter(({ lat, lon }) => !!lat && !!lon)
            .map(({ lon, lat, image, address, id, title, date, type }) => (
              <Marker
                icon={flohmarktIcon}
                key={"marker" + id}
                position={[lat!, lon!]}
              >
                <FlohmarktPopUP
                  address={address}
                  date={date}
                  title={title}
                  image={image}
                  id={id}
                  type={!type ? "flohmaerkte" : "events"}
                />
              </Marker>
            ))}
        </ConditionalCluster>
      )}
      {!!events.length && (
        <ConditionalCluster cluster={cluster} type="event">
          {events
            .filter(({ lat, lon }) => !!lat && !!lon)
            .map(
              ({
                lon,
                lat,
                image,
                address,
                id,
                title,
                date,
                type,
                endDate,
              }) => (
                <Marker
                  icon={
                    type === "weihnachtsmarkt"
                      ? date < today
                        ? weihnachtsmarktIcon
                        : desaturatedWeihnachtsmarktIcon
                      : eventIcon
                  }
                  key={"marker" + id}
                  position={[lat!, lon!]}
                >
                  <FlohmarktPopUP
                    id={id}
                    title={title}
                    address={address}
                    date={date}
                    image={image}
                    endDate={endDate}
                    type={!type ? "flohmaerkte" : "events"}
                  />
                </Marker>
              )
            )}
        </ConditionalCluster>
      )}
      {showPosts && (
        <ConditionalCluster cluster={cluster} type="post">
          {posts
            .filter(({ lat, lon, address }) => !!lat && !!lon && !!address)
            .map(
              (
                {
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
                },
                i
              ) => (
                <React.Fragment key={"marker" + id}>
                  {customPostMarker ? (
                    <>
                      {customPostMarker({
                        lat,
                        lon,
                        id,
                        title,
                        minAge,
                        maxAge,
                        address,
                        stadtteil,
                        bezirk,
                      })}
                    </>
                  ) : (
                    <Marker
                      icon={postIcon}
                      key={"marker" + id + i}
                      position={[lat!, lon!]}
                    >
                      <PostPopUP
                        image={image && image[0]}
                        address={address!}
                        categories={categories}
                        title={title}
                        id={id}
                      />
                    </Marker>
                  )}
                </React.Fragment>
              )
            )}
        </ConditionalCluster>
      )}

      {showSpielplaetze && (
        <ConditionalCluster cluster={cluster} type="spielplatz">
          {spielplaetze
            .filter(({ address }) => !!address)
            .map(({ lon, lat, address, id, title, type, spielgeraete }) => (
              <Marker
                key={"marker" + id}
                position={[lat!, lon!]}
                icon={spielplatzIcon}
              >
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
