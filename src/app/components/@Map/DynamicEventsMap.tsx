"use client";
import GeneralMap from "@components/@Map/GeneralMap";
import { iBezirk, iEventType, iFlohmarkt } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
import { divIcon, point } from "leaflet";
import { cn, getDate, getTodayNexMonday } from "@app/utils/functions";
import ScrollableContainer from "@components/ScrollableContainer";
import MarkerClusterGroup from "react-leaflet-cluster";
import { eventTypesNames } from "@app/utils/constants";
import { DisplayedMarkers } from "./PopUpsMarkers/DisplayedMarkers";
import { MapIndexes } from "./PopUpsMarkers/MapIndexes";
import StandortIcon from "../@Icons/StandortIcon";

interface iDynamicEventsMap {
  children?: React.ReactNode;
  showTermine?: boolean;
  showBezirke?: boolean;
  showEventType?: boolean;
  today: number;
  darkBackground?: boolean;
  thisWeek: iFlohmarkt[];
  nextWeek?: iFlohmarkt[];
  future?: iFlohmarkt[];
  square?: boolean;
  className?: string;
  showMapIndexes?: boolean;
  cluster?: boolean;
  zoom?: number;

  outline?: boolean;
}

const lightButtonStyle =
  "bg-hh-50 text-hh-800  hover:bg-hh-200 focus:outline-0 outline outline-1 outline-hh-200 outline-offset-1";
const darkButtonStyle =
  "bg-hh-800 text-hh-50  hover:bg-hh-700 focus:outline-0 outline outline-1 outline-hh-200 outline-offset-1";

export default function DynamicEventsMap({
  today,
  zoom,
  thisWeek,
  nextWeek = [],
  future = [],
  outline = false,
  square = true,
  darkBackground = false,
  showEventType = true,
  showTermine = true,
  showBezirke = true,
  children,
  className,
  showMapIndexes = true,
  cluster = true,
}: iDynamicEventsMap) {
  const [selectedDate, setSelectedDate] = React.useState<
    number | string | undefined
  >(undefined);
  const [selectedBezirk, setSelectedBezirk] = React.useState<
    iBezirk | undefined
  >();
  const [selectedEvent, setSelectedEvent] = React.useState<
    iEventType | undefined
  >();

  const { current: bezirke } = useRef(
    Array.from(
      new Set(
        [...thisWeek, ...nextWeek, ...future].map((p) => p.bezirk).flat(),
      ),
    ).sort((a, b) =>
      a === "Umland Hamburg"
        ? 1
        : b === "Umland Hamburg"
          ? -1
          : a.localeCompare(b),
    ),
  );

  const { current: eventsByDate } = useRef(
    thisWeek.reduce(
      (acc, curr) => {
        if (curr.endDate && curr.endDate > today) {
          acc["currentEvents"] = [...(acc["currentEvents"] || []), curr];
          if (curr.date < today && curr.endDate > today) {
            acc[today - 1] = [...(acc[today - 1] || []), curr];
          }
          return acc;
        }
        if (acc[curr.date]) {
          acc[curr.date].push(curr);
        } else {
          acc[curr.date] = [curr];
        }
        return acc;
      },
      {} as { [key: string]: iFlohmarkt[] },
    ),
  );

  const { current: orderedDates } = useRef(
    Object.keys(eventsByDate).sort((a, b) =>
      b === "currentEvents"
        ? -1
        : a === "currentEvents"
          ? 1
          : parseInt(a) - parseInt(b),
    ),
  );
  const allEvents = [...thisWeek, ...nextWeek, ...future];
  const { current: eventTypes } = useRef(
    Array.from(
      new Set(allEvents.map(({ type }) => type).filter(Boolean)),
    ) as iEventType[],
  );

  const { nextMonday } = useMemo(() => getTodayNexMonday(), []);
  const todayString = useMemo(() => getDate(today), [today]);

  const filteredBySelectedDate = useMemo(() => {
    if (
      selectedDate &&
      selectedDate !== "nextWeek" &&
      selectedDate !== "future"
    ) {
      return { [selectedDate]: eventsByDate[selectedDate] };
    }
    return eventsByDate;
  }, [selectedDate, eventsByDate]);
  const singleEvent = allEvents.length === 1 ? allEvents[0] : undefined;
  const futureSelected = selectedDate === "future";
  const nextWeekSelected = selectedDate === "nextWeek";
  const currentEventsSelected = selectedDate === "currentEvents";

  return (
    <div
      id="dynamic-events-map-container"
      className={cn(
        "w-full sm:w-full flex flex-col md:flex-row md:flex-wrap items-stretch gap-1 rounded",
        className,
      )}
    >
      <section
        className={cn(
          "max-h-[60vh] min-h-[250px] flex justify-center rounded overflow-hidden flex-grow xs:min-w-[300px] sm:max-w-[800px] aspect-square sm:aspect-[3/2] md:aspect-auto md:mx-auto",
          square
            ? "w-full lg:aspect-square  lg:max-w-full"
            : "md:aspect-video lg:aspect-auto lg:h-[50vh] lg:max-w-full",
          outline ? "outline outline-2 outline-hh-800-50" : "",
        )}
      >
        <GeneralMap zoom={zoom || 11} currentTarget={singleEvent}>
          {children}

          {!selectedDate ? (
            <React.Fragment>
              <DisplayedMarkers
                eventsList={
                  cluster
                    ? [...thisWeek, ...nextWeek]
                    : [...thisWeek, ...nextWeek, ...future]
                }
                selectedBezirk={selectedBezirk}
                selectedEvent={selectedEvent}
                todayString={todayString}
                nextMonday={nextMonday}
              />
              {cluster && (
                <MarkerClusterGroup
                  chunkedLoading
                  zoomToBoundsOnClick
                  maxClusterRadius={10}
                  iconCreateFunction={(cluster: any) =>
                    divIcon({
                      html: `<div class="clusterIcon clusterIconPost">${cluster.getChildCount()}</div>`,
                      className: "custom-marker-cluster",
                      iconSize: point(32, 32, true),
                    })
                  }
                >
                  <DisplayedMarkers
                    eventsList={future}
                    selectedBezirk={selectedBezirk}
                    selectedEvent={selectedEvent}
                    todayString={todayString}
                    nextMonday={nextMonday}
                  />
                </MarkerClusterGroup>
              )}
            </React.Fragment>
          ) : futureSelected || nextWeekSelected || currentEventsSelected ? (
            <DisplayedMarkers
              eventsList={
                futureSelected
                  ? future
                  : nextWeekSelected
                    ? nextWeek
                    : eventsByDate["currentEvents"] || []
              }
              selectedBezirk={selectedBezirk}
              selectedEvent={selectedEvent}
              todayString={todayString}
              nextMonday={nextMonday}
            />
          ) : (
            Object.entries(filteredBySelectedDate).map(([day, events]) => {
              return (
                <React.Fragment key={day}>
                  <DisplayedMarkers
                    eventsList={events}
                    selectedBezirk={selectedBezirk}
                    selectedEvent={selectedEvent}
                    todayString={todayString}
                    nextMonday={nextMonday}
                  />
                </React.Fragment>
              );
            })
          )}
        </GeneralMap>
      </section>
      {showMapIndexes && (
        <MapIndexes
          eventTypes={eventTypes}
          today={thisWeek.some(({ date }) => getDate(date) === getDate(today))}
        >
          <StandortIcon size="1rem" color="#7B3E5E50" />
          <p>Flohmärkte</p>
        </MapIndexes>
      )}
      {(!!showBezirke || !!showTermine || !showEventType) && (
        <aside
          id="flohmaerkte-map-filters-aside"
          className="px-2 w-full xs:min-w-[300px] max-w-[80vw] flex flex-col"
        >
          <ScrollableContainer vertical>
            <div
              className={`w-full h-full flex flex-wrap px-2 md:px-0 ${darkBackground ? "text-hh-100" : "text-hh-800"}`}
            >
              {showTermine && (
                <div className="flex w-full flex-col">
                  <h3 className="font-bold text-lg px-2 backdrop-blur w-fit rounded">
                    Termine
                  </h3>
                  <div className="flex flex-wrap gap-2 items-center  pb-2 px-2">
                    {orderedDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate((prev) =>
                            prev + "" === date
                              ? undefined
                              : date === "currentEvents"
                                ? "currentEvents"
                                : parseInt(date),
                          );
                        }}
                        className={`text-sm p-1 border-2  border-hh-600 rounded-md ${
                          darkBackground
                            ? selectedDate === parseInt(date) ||
                              (currentEventsSelected &&
                                date === "currentEvents")
                              ? lightButtonStyle
                              : darkButtonStyle
                            : selectedDate === parseInt(date) ||
                                (currentEventsSelected &&
                                  date === "currentEvents")
                              ? darkButtonStyle
                              : lightButtonStyle
                        } transition-all`}
                      >
                        {date === "currentEvents" ? (
                          "Aktuelle Events"
                        ) : getDate(parseInt(date)) === getDate(today) ? (
                          "Heute"
                        ) : (
                          <>
                            <span className="block md:hidden">
                              {getDate(parseInt(date), "short", true)}
                            </span>
                            <span className="hidden md:block">
                              {getDate(parseInt(date), "short")}
                            </span>
                          </>
                        )}
                      </button>
                    ))}
                    {!!nextWeek?.length && (
                      <button
                        onClick={() => {
                          setSelectedDate((prev) =>
                            prev === "nextWeek" ? undefined : "nextWeek",
                          );
                        }}
                        className={`text-sm p-1 w-fit border-2 border-hh-600 rounded-md ${
                          darkBackground
                            ? nextWeekSelected
                              ? lightButtonStyle
                              : darkButtonStyle
                            : nextWeekSelected
                              ? darkButtonStyle
                              : lightButtonStyle
                        } transition-all`}
                      >
                        Nächste Woche
                      </button>
                    )}
                    {!!future.length && (
                      <button
                        onClick={() => {
                          setSelectedDate((prev) =>
                            prev === "future" ? undefined : "future",
                          );
                        }}
                        className={`text-sm p-1 w-fit border-2 border-hh-600 rounded-md ${
                          darkBackground
                            ? futureSelected
                              ? lightButtonStyle
                              : darkButtonStyle
                            : futureSelected
                              ? darkButtonStyle
                              : lightButtonStyle
                        } transition-all`}
                      >
                        Zukünftige Veranstaltungen
                      </button>
                    )}
                  </div>
                </div>
              )}

              {showBezirke && bezirke.length > 1 && (
                <div className="flex w-full flex-col">
                  <h3 className="font-bold text-lg px-2">Bezirke</h3>
                  <div className="flex flex-wrap gap-2 items-center pb-2 px-2">
                    {bezirke.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedBezirk((prev) =>
                            prev === (item as iBezirk)
                              ? undefined
                              : (item as iBezirk),
                          );
                        }}
                        className={`text-sm p-1 border-2 border-hh-600 rounded-md ${
                          darkBackground
                            ? selectedBezirk === item
                              ? lightButtonStyle
                              : darkButtonStyle
                            : selectedBezirk === item
                              ? darkButtonStyle
                              : lightButtonStyle
                        } transition-all`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showEventType && !!eventTypes?.length && (
                <div className="flex w-full flex-col">
                  <h3 className="font-bold text-lg px-2 backdrop-blur w-fit rounded">
                    Art der Veranstaltung
                  </h3>
                  <div className="flex flex-wrap gap-2 items-center pb-2 px-2">
                    {eventTypes.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedEvent((prev) =>
                            prev === item ? undefined : item,
                          );
                        }}
                        className={`text-sm p-1 border-2 border-hh-600 rounded-md ${
                          darkBackground
                            ? selectedEvent === item
                              ? lightButtonStyle
                              : darkButtonStyle
                            : selectedEvent === item
                              ? darkButtonStyle
                              : lightButtonStyle
                        } transition-all`}
                      >
                        {eventTypesNames[item]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollableContainer>
        </aside>
      )}
    </div>
  );
}
