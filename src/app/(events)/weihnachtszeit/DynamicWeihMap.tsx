"use client";
import FlohmarktPopUP from "@components/@Map/PopUpsMarkers/FlohmarktPopUP";
import { iEventType, iFlohmarkt } from "@app/utils/types";
import { Marker } from "react-leaflet";
import React, { useMemo } from "react";
import {
  addressWithoutCity,
  cn,
  getTodayNexMonday,
} from "@app/utils/functions";
import {
  createWeihnachtsmarktIcon,
  createNormalSizeIcon,
} from "@components/@Map/functions";
import Button from "@components/@Buttons/Button";
import WeihnachtsmarktIcon from "@components/@Icons/@Events/WeihnachtsmarktIcon";
import BoyGirlIcon from "@components/@Icons/@Events/BoyGirlIcon";
import WeihMap from "@components/@Map/WeihMap";

const weihnachtsmarktIcon = createWeihnachtsmarktIcon(24);
const desatWeihnachtsmarktIcon = createWeihnachtsmarktIcon(24, true);
const smallWeihnachtsmarktIcon = createWeihnachtsmarktIcon(20);
const eventIcon = createNormalSizeIcon("#405b3a", 30, "#2d3d2a");
const selectedEventIcon = createNormalSizeIcon("#ed5946", 35, "#da3c28", true);
export default function DynamicWeihMap({
  selectedEventID,
  weihnachtsmaerkte = [],
  events = [],
  mapContainerClassName,
}: {
  selectedEventID?: number;
  eventType?: iEventType | "flohmaerkte";
  today?: number;
  darkBackground?: boolean;
  weihnachtsmaerkte?: iFlohmarkt[];
  events?: iFlohmarkt[];
  mapContainerClassName?: string;
}) {
  const [eventTypes, setEventTypes] = React.useState<
    (iEventType | "flohmaerkte")[]
  >(["weihnachtsmarkt"]);
  const { today } = getTodayNexMonday();
  const selectedEvent = useMemo(
    () =>
      events.length
        ? events.find(({ id }) => id === selectedEventID)
        : undefined,
    [selectedEventID, events]
  );
  const locationTypes = (
    [
      weihnachtsmaerkte.length ? "weihnachtsmarkt" : null,
      events.length ? "adventsevent" : null,
    ] as iEventType[]
  ).filter(Boolean);

  return (
    <div className="w-full max-w-full sm:w-full flex flex-col gap-2 rounded">
      <section
        className={cn(
          `min-w-full h-[60vh] max-h-[300px] min-h-[250px] sm:max-h-[360px] flex-grow flex justify-center rounded overflow-hidden`,
          mapContainerClassName
        )}
      >
        <WeihMap
          events={events}
          weihnachtsmaerkte={weihnachtsmaerkte}
          eventTypes={eventTypes}
        >
          {selectedEvent &&
            eventTypes.some((type) => type !== "weihnachtsmarkt") && (
              <Marker
                icon={selectedEventIcon}
                key={selectedEvent.id}
                zIndexOffset={200}
                position={[
                  selectedEvent.lat || 53.5511,
                  selectedEvent.lon || 9.9937,
                ]}
              >
                <FlohmarktPopUP
                  endDate={selectedEvent.endDate}
                  id={selectedEvent.id}
                  address={
                    addressWithoutCity(selectedEvent.address) +
                    " " +
                    selectedEvent.stadtteil
                  }
                  date={selectedEvent.date}
                  title={selectedEvent.title}
                  type={!selectedEvent.type ? "flohmaerkte" : "events"}
                />
              </Marker>
            )}
        </WeihMap>
      </section>
      <aside className="flex flex-wrap items-center gap-2 w-full">
        {locationTypes.map((type) => (
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
              <WeihnachtsmarktIcon color="#fefefe" />
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
