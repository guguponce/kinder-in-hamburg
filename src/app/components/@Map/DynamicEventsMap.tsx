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

interface iDynamicEventsMap {
  children?: React.ReactNode;
  showTermine?: boolean;
  showBezirke?: boolean;
  showEventType?: boolean;
  today: number;
  darkBackground?: boolean;
  thisWeek: iFlohmarkt[];
  future?: iFlohmarkt[];
  square?: boolean;
  className?: string;
  showMapIndexes?: boolean;
  cluster?: boolean;
}
export default function DynamicEventsMap({
  today,
  thisWeek,
  future = [],
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
  const [futureSelected, setFutureSelected] = React.useState(false);

  const [selectedEvent, setSelectedEvent] = React.useState<
    iEventType | undefined
  >();
  const { current: bezirke } = useRef(
    Array.from(
      new Set([...thisWeek, ...future].map((p) => p.bezirk).flat())
    ).sort((a, b) =>
      a === "Umland Hamburg"
        ? 1
        : b === "Umland Hamburg"
          ? -1
          : a.localeCompare(b)
    )
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
      {} as { [key: string]: iFlohmarkt[] }
    )
  );

  const { current: orderedDates } = useRef(
    Object.keys(eventsByDate).sort((a, b) =>
      b === "currentEvents"
        ? -1
        : a === "currentEvents"
          ? 1
          : parseInt(a) - parseInt(b)
    )
  );

  const { current: eventTypes } = useRef(
    Array.from(
      new Set([...future, ...thisWeek].map(({ type }) => type).filter(Boolean))
    ) as iEventType[]
  );

  const { nextMonday } = getTodayNexMonday();
  const { current: todayString } = useRef(getDate(today));

  const filteredBySelectedDate = useMemo(() => {
    if (selectedDate) {
      return { [selectedDate]: eventsByDate[selectedDate] };
    }
    return eventsByDate;
  }, [selectedDate, eventsByDate]);
  const isToday = useMemo(() => {
    const todayString = getDate(today);
    const selectedDateString =
      !selectedDate ||
      getDate(
        selectedDate === "currentEvents" ? today : (selectedDate as number)
      );
    return todayString === selectedDateString;
  }, [today, selectedDate]);
  const singleEvent =
    [...future, ...thisWeek].length === 1
      ? [...future, ...thisWeek][0]
      : undefined;
  return (
    <div
      className={cn(
        "w-full sm:w-full flex flex-col md:flex-row md:flex-wrap items-stretch gap-1 rounded",
        className
      )}
    >
      <section
        className={`max-h-[60vh] min-h-[250px] flex-grow xs:min-w-[300px] sm:max-w-[800px] aspect-square sm:aspect-[3/2] md:aspect-auto md:mx-auto ${square ? "w-full lg:aspect-square  lg:max-w-full" : "md:aspect-video lg:aspect-auto lg:h-[50vh] lg:max-w-full"} flex justify-center rounded overflow-hidden`}
      >
        <GeneralMap zoom={11} currentTarget={singleEvent}>
          {children}
          {!futureSelected &&
            Object.entries(filteredBySelectedDate).map(([day, events]) => (
              <React.Fragment key={day}>
                <DisplayedMarkers
                  eventsList={events}
                  selectedBezirk={selectedBezirk}
                  selectedEvent={selectedEvent}
                  todayString={todayString}
                  nextMonday={nextMonday}
                />
              </React.Fragment>
            ))}
          {(!selectedDate || !selectedEvent) && (
            <DisplayedMarkers
              eventsList={
                eventsByDate["currentEvents"]?.filter(
                  ({ closedDates }) =>
                    !closedDates?.find((c) => getDate(c) === todayString)
                ) || []
              }
              selectedBezirk={selectedBezirk}
              selectedEvent={selectedEvent}
              todayString={todayString}
              nextMonday={nextMonday}
            />
          )}
          {!selectedDate ? (
            cluster ? (
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
                <DisplayedMarkers
                  eventsList={future}
                  selectedBezirk={selectedBezirk}
                  selectedEvent={selectedEvent}
                  todayString={todayString}
                  nextMonday={nextMonday}
                />
              </MarkerClusterGroup>
            ) : (
              <DisplayedMarkers
                eventsList={future}
                selectedBezirk={selectedBezirk}
                selectedEvent={selectedEvent}
                todayString={todayString}
                nextMonday={nextMonday}
              />
            )
          ) : (
            futureSelected && (
              <DisplayedMarkers
                eventsList={future}
                selectedBezirk={selectedBezirk}
                selectedEvent={selectedEvent}
                todayString={todayString}
                nextMonday={nextMonday}
              />
            )
          )}
        </GeneralMap>
      </section>
      {showMapIndexes && (
        <MapIndexes
          eventTypes={eventTypes}
          today={thisWeek.some(({ date }) => getDate(date) === getDate(today))}
        />
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
                          setFutureSelected(false);
                          setSelectedDate((prev) =>
                            prev + "" === date
                              ? undefined
                              : date === "currentEvents"
                                ? "currentEvents"
                                : parseInt(date)
                          );
                        }}
                        className={`text-sm p-1 border-2  border-hh-600 rounded-md ${
                          darkBackground
                            ? selectedDate === parseInt(date) ||
                              (selectedDate === "currentEvents" &&
                                date === "currentEvents")
                              ? "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50 outline outline-1 outline-hh-200 outline-offset-1 "
                              : "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                            : selectedDate === parseInt(date) ||
                                (selectedDate === "currentEvents" &&
                                  date === "currentEvents")
                              ? "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                              : "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50"
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
                    {!!future.length && (
                      <button
                        onClick={() => {
                          setSelectedDate(undefined);
                          setFutureSelected((prev) => !prev);
                        }}
                        className={`text-sm p-1 w-fit border-2 border-hh-600 rounded-md ${
                          darkBackground
                            ? futureSelected
                              ? "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50  outline outline-1 outline-hh-200 outline-offset-1"
                              : "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                            : futureSelected
                              ? "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                              : "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50"
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
                              : (item as iBezirk)
                          );
                        }}
                        className={`text-sm p-1 border-2 border-hh-600 rounded-md ${
                          darkBackground
                            ? selectedBezirk === item
                              ? "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50 outline outline-1 outline-hh-200 outline-offset-1"
                              : "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                            : selectedBezirk === item
                              ? "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                              : "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50"
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
                            prev === item ? undefined : item
                          );
                        }}
                        className={`text-sm p-1 border-2 border-hh-600 rounded-md ${
                          darkBackground
                            ? selectedEvent === item
                              ? "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50 outline outline-1 outline-hh-200 outline-offset-1"
                              : "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                            : selectedEvent === item
                              ? "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                              : "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50"
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
