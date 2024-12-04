"use client";
import GeneralMap from "@components/@Map/GeneralMap";
import FlohmarktPopUP from "@components/@Map/PopUpsMarkers/FlohmarktPopUP";
import { iEventType, iFlohmarkt } from "@app/utils/types";
import { Marker } from "react-leaflet";
import React from "react";
import { divIcon, point } from "leaflet";
import { addressWithoutCity, cn } from "@app/utils/functions";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  createWeihnachtsmarktIcon,
  createNormalSizeIcon,
} from "@components/@Map/functions";
import Button from "@app/components/@Buttons/Button";
import WeihnachtsmaarktIcon from "@app/components/@Icons/@Events/WeihnachtsmarktIcon";
import BoyGirlIcon from "@app/components/@Icons/@Events/BoyGirlIcon";

const weihnachtsmarktIcon = createWeihnachtsmarktIcon(24);
const smallWeihnachtsmarktIcon = createWeihnachtsmarktIcon(20);
const eventIcon = createNormalSizeIcon("#405b3a", 30, "#2d3d2a");
export default function DynamicEventsMap({
  currentEvents,
  future = [],
  square = true,
  mapContainerClassName,
}: {
  eventType?: iEventType | "flohmaerkte";
  today: number;
  darkBackground?: boolean;
  currentEvents: iFlohmarkt[];
  future?: iFlohmarkt[];
  square?: boolean;
  mapContainerClassName?: string;
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
  const [eventTypes, setEventTypes] = React.useState<
    (iEventType | "flohmaerkte")[]
  >(["weihnachtsmarkt"]);
  return (
    <div className="w-full sm:w-full flex flex-col gap-2 rounded">
      <section
        className={cn(
          `min-h-full min-w-full flex justify-center rounded overflow-hidden`,
          mapContainerClassName
        )}
      >
        <GeneralMap zoom={11}>
          <>
            {" "}
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
              {eventTypes.includes("adventsevent") &&
                future.map(
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
                          address={
                            addressWithoutCity(address) + " " + stadtteil
                          }
                          date={date}
                          title={title}
                          type={!type ? "flohmaerkte" : "events"}
                        />
                      </Marker>
                    </React.Fragment>
                  )
                )}
            </MarkerClusterGroup>
            {eventTypes.includes("weihnachtsmarkt") &&
              currentEvents.map(
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
                      icon={
                        eventTypes.includes("adventsevent")
                          ? smallWeihnachtsmarktIcon
                          : weihnachtsmarktIcon
                      }
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
      </section>
      <aside className="flex flex-wrap items-center gap-2 w-full">
        {(["weihnachtsmarkt", "adventsevent"] as iEventType[]).map((type) => (
          <Button
            key={type}
            onClick={() =>
              setEventTypes((prev) =>
                prev.length === 1
                  ? prev.includes(type)
                    ? prev
                    : [...prev, type]
                  : prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type]
              )
            }
            variant="positive-dark"
            size="small"
            fontWeight="semibold"
            fontSize="xs"
            className={`px-2 py-1 rounded-lg text-sm capitalize flex gap-2 items-center min-w-fit ${eventTypes?.includes(type) ? "outline-2 outline-positive-900 outline-offset-1" : "opacity-25"} shadow-sm`}
          >
            {type === "weihnachtsmarkt" ? (
              <WeihnachtsmaarktIcon color="#fefefe" />
            ) : (
              <BoyGirlIcon color="#fefefe" />
            )}
            <span>
              {type === "weihnachtsmarkt"
                ? "Weihnachtsmarkt"
                : "Veranstaltungen"}
            </span>
          </Button>
        ))}
      </aside>
    </div>
  );
}
