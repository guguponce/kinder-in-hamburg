"use client";
import FlohmarktPopUP from "@components/@Map/PopUpsMarkers/FlohmarktPopUP";
import PostPopUP from "@components/@Map/PopUpsMarkers/PostPopUP";
import SpielplatzPopUP from "@components/@Map/PopUpsMarkers/SpielplatzPopUP";
import { haversineDistance, joinAddress } from "@app/utils/functions";
import { iAddress, iListsFPS } from "@app/utils/types";
import { DivIcon, divIcon, point } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { createNormalSizeIcon, createWeihnachtsmarktIcon } from "../functions";
import { createBuecherhalleIcon, createMarktIcon } from "../mapUtils/constants";

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
const spielplatzIcon = createNormalSizeIcon("#405b3a", undefined, "#2d3d2a");
const eventIcon = createNormalSizeIcon("#de6c13");
const weihnachtsmarktIcon = createWeihnachtsmarktIcon(24);
const desaturatedWeihnachtsmarktIcon = createWeihnachtsmarktIcon(24, true);

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
  currentLocation,
  customIcon,
  popUpIcon,
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
  customIcon?: DivIcon | "flohmarkt" | "buecherhalle";
  popUpIcon?: React.JSX.Element;
  currentLocation?: { lat?: number; lon?: number };
}) {
  const flohmaerkte = lists.flohmaerkte || [];
  const posts = lists.posts || [];
  const spielplaetze = lists.spielplaetze || [];
  const events = lists.events || [];
  const today = Date.now();
  const memoPopUpIcon = React.useMemo(() => popUpIcon, [popUpIcon]);
  const memoCustomIcon = React.useMemo(
    () =>
      typeof customIcon !== "string"
        ? customIcon
        : customIcon === "buecherhalle"
          ? createBuecherhalleIcon()
          : customIcon === "flohmarkt"
            ? createMarktIcon()
            : undefined,
    [customIcon]
  );
  return (
    <>
      {showFlohmaerkte && (
        <ConditionalCluster cluster={cluster} type="flohmarkt">
          {flohmaerkte
            .filter(({ lat, lon }) => !!lat && !!lon)
            .map(({ lon, lat, image, address, id, title, date, type }) => (
              <Marker
                icon={memoCustomIcon || flohmarktIcon}
                key={"marker" + id}
                position={[lat!, lon!]}
              >
                <FlohmarktPopUP
                  distance={
                    currentLocation?.lat && currentLocation?.lon
                      ? haversineDistance(
                          currentLocation.lon,
                          currentLocation.lat,
                          lon!,
                          lat!
                        )
                      : undefined
                  }
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
                    memoCustomIcon || type === "weihnachtsmarkt"
                      ? date < today
                        ? weihnachtsmarktIcon
                        : desaturatedWeihnachtsmarktIcon
                      : eventIcon
                  }
                  key={"marker" + id}
                  position={[lat!, lon!]}
                >
                  <FlohmarktPopUP
                    distance={
                      currentLocation?.lat && currentLocation?.lon
                        ? haversineDistance(
                            currentLocation.lon,
                            currentLocation.lat,
                            lon!,
                            lat!
                          )
                        : undefined
                    }
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
                      icon={memoCustomIcon || postIcon}
                      key={"marker" + id + i}
                      position={[lat!, lon!]}
                    >
                      <PostPopUP
                        distance={
                          currentLocation?.lat && currentLocation?.lon
                            ? haversineDistance(
                                currentLocation.lon,
                                currentLocation.lat,
                                lon!,
                                lat!
                              )
                            : undefined
                        }
                        icon={memoPopUpIcon}
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
                icon={memoCustomIcon || spielplatzIcon}
              >
                <SpielplatzPopUP
                  distance={
                    currentLocation?.lat && currentLocation?.lon
                      ? haversineDistance(
                          currentLocation.lon,
                          currentLocation.lat,
                          lon!,
                          lat!
                        )
                      : undefined
                  }
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
