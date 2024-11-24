"use client";
import GeneralMap from "@components/@Map/GeneralMap";
import FlohmarktPopUP from "@components/@Map/PopUpsMarkers/FlohmarktPopUP";
import { iEventType, iFlohmarkt } from "@app/utils/types";
import { Marker } from "react-leaflet";
import React, { useRef } from "react";
import { divIcon, point } from "leaflet";
import { addressWithoutCity } from "@app/utils/functions";
import MarkerClusterGroup from "react-leaflet-cluster";
import { createWeihnachtsmarktMapIcon } from "@components/@Map/functions";

const weihnachtsmarktIcon = divIcon({
  html: createWeihnachtsmarktMapIcon(30),
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  className: "bg-transparent",
});
const desaturatedWeihnachtsmarktIcon = divIcon({
  html: createWeihnachtsmarktMapIcon(24),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  className: "bg-transparent grayscale",
});

export default function DynamicEventsMap({
  today,
  currentEvents,
  future = [],
  square = true,
  darkBackground = false,
  eventType,
}: {
  eventType?: iEventType | "flohmaerkte";
  today: number;
  darkBackground?: boolean;
  currentEvents: iFlohmarkt[];
  future?: iFlohmarkt[];
  square?: boolean;
}) {
  //   const [selectedDate, setSelectedDate] = React.useState<number | undefined>(
  //     undefined
  //   );
  //   const [selectedBezirk, setSelectedBezirk] = React.useState<
  //     iBezirk | undefined
  //   >();
  //   const [futureSelected, setFutureSelected] = React.useState(false);

  //   const bezirke = useRef(
  //     Array.from(new Set([...currentEvents, ...future].map((p) => p.bezirk).flat()))
  //   );

  const eventsByDate = useRef(
    currentEvents.reduce(
      (acc, curr) => {
        if (acc[curr.date]) {
          acc[curr.date].push(curr);
        } else {
          acc[curr.date] = [curr];
        }
        return acc;
      },
      {} as { [key: string]: iFlohmarkt[] }
    )
  );

  return (
    <div className="w-full sm:w-full flex flex-col md:flex-row md:flex-wrap items-stretch gap-2 rounded">
      <section
        className={`max-h-[60vh] min-h-[250px] flex-grow xs:min-w-[300px] sm:max-w-[800px] aspect-square sm:aspect-[3/2] md:aspect-auto md:mx-auto ${square ? "w-full lg:aspect-square  lg:max-w-full" : "md:aspect-video lg:aspect-auto lg:h-[50vh] lg:max-w-full"} flex justify-center rounded overflow-hidden`}
      >
        <div>
          <div></div>
        </div>
        <GeneralMap zoom={11}>
          <>
            {" "}
            {currentEvents.map(
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
                    icon={weihnachtsmarktIcon}
                    key={id}
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
            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={(cluster: any) =>
                divIcon({
                  html: `<div class="clusterIcon clusterIconPost">${cluster.getChildCount()}</div>`,
                  className: "custom-marker-cluster",
                  iconSize: point(32, 32, true),
                })
              }
            >
              {future.map(
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
                      icon={desaturatedWeihnachtsmarktIcon}
                      key={id}
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
          </>{" "}
        </GeneralMap>
      </section>
    </div>
  );
}
