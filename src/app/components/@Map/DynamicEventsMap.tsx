"use client";
import GeneralMap from "@components/@Map/GeneralMap";
import FlohmarktPopUP from "@components/@Map/PopUpsMarkers/FlohmarktPopUP";
import MarkersLists from "@components/@Map/PopUpsMarkers/MarkersLists";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import { Marker } from "react-leaflet";
import React, { useMemo, useRef } from "react";
import { divIcon, point } from "leaflet";
import { createStandortMapIcon, getDate } from "@app/utils/functions";
import ScrollableContainer from "@components/ScrollableContainer";
import MarkerClusterGroup from "react-leaflet-cluster";

const createNormalSizeIcon = (color: string, size: number = 30) =>
  divIcon({
    html: createStandortMapIcon(color, size),
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    className: "bg-transparent",
  });
const futureIcon = createNormalSizeIcon("#22111a");
const todayIcon = createNormalSizeIcon("#7B3E5E");

export default function DynamicEventsMap({
  today,
  thisWeek,
  future = [],
  square = true,
  darkBackground = false,
}: {
  today: number;
  darkBackground?: boolean;
  thisWeek: iFlohmarkt[];
  future?: iFlohmarkt[];
  square?: boolean;
}) {
  const [selectedDate, setSelectedDate] = React.useState<number | undefined>(
    undefined
  );
  const [selectedBezirk, setSelectedBezirk] = React.useState<
    iBezirk | undefined
  >();
  const [futureSelected, setFutureSelected] = React.useState(false);

  const bezirke = useRef(
    Array.from(new Set([...thisWeek, ...future].map((p) => p.bezirk).flat()))
  );

  const eventsByDate = useRef(
    thisWeek.reduce(
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

  const displayedMarkers = useMemo(() => {
    if (selectedDate) {
      return { [selectedDate]: eventsByDate.current[selectedDate] };
    }
    return eventsByDate.current;
  }, [selectedDate]);

  return (
    <div className="w-full sm:w-full flex flex-col md:flex-row md:flex-wrap items-stretch gap-2 rounded">
      <section
        className={`max-h-[60vh] min-h-[250px] flex-grow xs:min-w-[300px] sm:max-w-[800px] aspect-square sm:aspect-[3/2] md:aspect-auto ${square ? "w-full lg:aspect-square  lg:max-w-full" : "md:aspect-video lg:aspect-auto lg:h-[50vh] lg:max-w-full"} flex justify-center rounded overflow-hidden`}
      >
        <GeneralMap zoom={11}>
          {!selectedDate && !futureSelected
            ? Object.entries(displayedMarkers).map(([day, events]) =>
                day !== today.toString() ? (
                  <React.Fragment key={day}>
                    <MarkersLists
                      cluster={false}
                      showFlohmaerkte
                      lists={{
                        flohmaerkte: selectedBezirk
                          ? events.filter(
                              ({ bezirk }) => bezirk === selectedBezirk
                            )
                          : events,
                      }}
                    />
                  </React.Fragment>
                ) : (
                  events.map(
                    ({ id, lat, lon, address, date, title, bezirk }) =>
                      selectedBezirk && bezirk !== selectedBezirk ? null : (
                        <React.Fragment key={id}>
                          <Marker
                            icon={futureIcon}
                            key={id}
                            position={[lat || 53.5511, lon || 9.9937]}
                          >
                            <FlohmarktPopUP
                              id={id}
                              address={address}
                              date={date}
                              title={title}
                            />
                          </Marker>
                        </React.Fragment>
                      )
                  )
                )
              )
            : selectedDate === today
              ? displayedMarkers[selectedDate].map(
                  ({ id, lat, lon, address, date, title, bezirk, type }) =>
                    selectedBezirk && bezirk !== selectedBezirk ? null : (
                      <React.Fragment key={id}>
                        <Marker
                          icon={todayIcon}
                          key={id}
                          position={[lat || 53.5511, lon || 9.9937]}
                        >
                          <FlohmarktPopUP
                            id={id}
                            address={address}
                            date={date}
                            title={title}
                            type={!type ? "flohmaerkte" : "events"}
                          />
                        </Marker>
                      </React.Fragment>
                    )
                )
              : selectedDate && (
                  <MarkersLists
                    cluster={false}
                    showFlohmaerkte
                    lists={{
                      flohmaerkte: selectedBezirk
                        ? displayedMarkers[selectedDate].filter(
                            ({ bezirk }) => bezirk === selectedBezirk
                          )
                        : displayedMarkers[selectedDate],
                    }}
                  />
                )}
          {!selectedDate && future.length > 0 && (
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
                ({ id, lat, lon, address, date, title, bezirk, type }) =>
                  selectedBezirk && bezirk !== selectedBezirk ? null : (
                    <React.Fragment key={id}>
                      <Marker
                        icon={futureIcon}
                        key={id}
                        position={[lat || 53.5511, lon || 9.9937]}
                      >
                        <FlohmarktPopUP
                          id={id}
                          address={address}
                          date={date}
                          title={title}
                          type={!type ? "flohmaerkte" : "events"}
                        />
                      </Marker>
                    </React.Fragment>
                  )
              )}
            </MarkerClusterGroup>
          )}
        </GeneralMap>
      </section>
      <aside
        id="flohmaerkte-map-filters-aside"
        className="px-2 pb-2 w-full md:w-1/4 xs:min-w-[300px] max-w-[80vw] md:w-full flex flex-col"
      >
        <ScrollableContainer vertical>
          <div
            className={`w-full h-full flex flex-wrap px-2 md:px-0 ${darkBackground ? "text-hh-100" : "text-hh-800"}`}
          >
            <div className="flex w-full flex-col">
              <h3 className="font-bold text-lg p-2">Termine</h3>
              <div className="flex flex-wrap gap-2 items-center  pb-2 px-2">
                {Object.keys(eventsByDate.current)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setFutureSelected(false);
                        setSelectedDate((prev) =>
                          prev === parseInt(date) ? undefined : parseInt(date)
                        );
                      }}
                      className={`text-sm p-1 border-2  border-hh-600 rounded-md ${
                        darkBackground
                          ? selectedDate === parseInt(date)
                            ? "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50 outline outline-1 outline-hh-200 outline-offset-1 "
                            : "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                          : selectedDate === parseInt(date)
                            ? "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                            : "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50"
                      } transition-all`}
                    >
                      {getDate(parseInt(date)) === getDate(today)
                        ? "Heute"
                        : getDate(parseInt(date))}
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

            <div className="flex w-full flex-col">
              <h3 className="font-bold text-lg p-2">Bezirke</h3>
              <div className="flex flex-wrap gap-2 items-center pb-2 px-2">
                {bezirke.current.map((item) => (
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
          </div>
        </ScrollableContainer>
      </aside>{" "}
    </div>
  );
}
