"use client";
import { Marker } from "react-leaflet";
import GeneralMap from "@app/components/@Map/GeneralMap";
import { iEventType, iFlohmarkt } from "@app/utils/types";
import { divIcon, point } from "leaflet";
import React from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import FlohmarktPopUP from "@app/components/@Map/PopUpsMarkers/FlohmarktPopUP";
import {
  createNormalSizeIcon,
  createWeihnachtsmarktIcon,
} from "@app/components/@Map/functions";
import { addressWithoutCity } from "@app/utils/functions";

const weihnachtsmarktIcon = createWeihnachtsmarktIcon(24);
const desatWeihnachtsmarktIcon = createWeihnachtsmarktIcon(24, true);
const smallWeihnachtsmarktIcon = createWeihnachtsmarktIcon(20);
const eventIcon = createNormalSizeIcon("#405b3a", 30, "#2d3d2a");
const selectedEventIcon = createNormalSizeIcon("#ed5946", 35, "#da3c28", true);
export default function WeihMap({
  children,
  weihnachtsmaerkte = [],
  events = [],
  eventTypes,
}: {
  children?: React.ReactNode;
  events: iFlohmarkt[];
  weihnachtsmaerkte: iFlohmarkt[];
  eventTypes?: (iEventType | "flohmaerkte")[];
}) {
  return (
    <GeneralMap zoom={11}>
      <>
        {children}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={10}
          iconCreateFunction={(cluster: any) =>
            divIcon({
              html: `<div class="clusterIcon clusterIconSpielplatz">${cluster.getChildCount()}</div>`,
              className: "custom-marker-cluster",
              iconSize: point(32, 32, true),
            })
          }
        >
          {eventTypes?.includes("adventsevent") &&
            events.map(
              ({
                id,
                lat,
                lon,
                address,
                date,
                title,
                endDate,
                stadtteil,
                type,
              }) => (
                <React.Fragment key={id}>
                  <Marker
                    icon={eventIcon}
                    key={id}
                    zIndexOffset={200}
                    position={[lat || 53.5511, lon || 9.9937]}
                  >
                    <FlohmarktPopUP
                      endDate={endDate}
                      id={id}
                      address={addressWithoutCity(address) + " " + stadtteil}
                      date={date}
                      title={title}
                      type={!type ? "flohmaerkte" : "events"}
                    />
                  </Marker>
                </React.Fragment>
              )
            )}
        </MarkerClusterGroup>
        {eventTypes?.includes("weihnachtsmarkt") &&
          weihnachtsmaerkte.map(
            ({
              id,
              lat,
              lon,
              address,
              date,
              title,
              stadtteil,
              endDate,
              type,
            }) => (
              <React.Fragment key={id}>
                <Marker
                  icon={smallWeihnachtsmarktIcon}
                  key={id}
                  zIndexOffset={1}
                  position={[lat || 53.5511, lon || 9.9937]}
                >
                  <FlohmarktPopUP
                    endDate={endDate}
                    id={id}
                    address={addressWithoutCity(address) + " " + stadtteil}
                    date={date}
                    title={title}
                    type={!type ? "flohmaerkte" : "events"}
                  />
                </Marker>
              </React.Fragment>
            )
          )}
      </>{" "}
    </GeneralMap>
  );
}
