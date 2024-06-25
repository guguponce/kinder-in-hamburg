"use client";
import GeneralMap from "@app/components/@Map/GeneralMap";
import FlohmarktPopUP from "@app/components/@Map/PopUpsMarkers/FlohmarktPopUP";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import { Marker } from "react-leaflet";
import React, { useMemo, useRef } from "react";
import { divIcon } from "leaflet";
import { createStandortMapIcon, getDate } from "@app/utils/functions";
import ScrollableContainer from "@app/components/ScrollableContainer";

const createNormalSizeIcon = (color: string, size: number = 30) =>
  divIcon({
    html: createStandortMapIcon(color, size),
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    className: "bg-transparent",
  });
const futureIcon = createNormalSizeIcon("#1F262E");
const todayIcon = createNormalSizeIcon("#E04945");

export default function DynamicFlohmarktMap({
  today,
  nextMonday,
  thisWeek,
  future,
}: {
  nextMonday: number;
  today: number;
  thisWeek: iFlohmarkt[];
  future: iFlohmarkt[];
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

  const thisWeekFlohs = useRef(
    thisWeek.reduce((acc, curr) => {
      if (acc[curr.date]) {
        acc[curr.date].push(curr);
      } else {
        acc[curr.date] = [curr];
      }
      return acc;
    }, {} as { [key: string]: iFlohmarkt[] })
  );
  const futureFlohs = useRef(future);

  const displayedMarkers = useMemo(() => {
    if (selectedDate) {
      return { [selectedDate]: thisWeekFlohs.current[selectedDate] };
    }
    return thisWeekFlohs.current;
  }, [selectedDate]);

  return (
    <div className="flex flex-col h-fit max-w-[1200px] p-2 bg-gradient-to-b from-hh-100 to-white shadow-md md:shadow-xl my-4 md:my-8">
      <section className="flex-grow h-[60vh] w-full">
        <GeneralMap zoom={11}>
          {!selectedDate && !futureSelected
            ? Object.entries(displayedMarkers).map(([day, flohs]) =>
                day !== today.toString() ? (
                  <React.Fragment key={day}>
                    <MarkersLists
                      showFlohmaerkte
                      lists={{
                        flohmaerkte: selectedBezirk
                          ? flohs.filter(
                              ({ bezirk }) => bezirk === selectedBezirk
                            )
                          : flohs,
                      }}
                    />
                  </React.Fragment>
                ) : (
                  flohs.map(({ id, lat, lon, address, date, title, bezirk }) =>
                    selectedBezirk && bezirk !== selectedBezirk ? null : (
                      <React.Fragment key={id}>
                        <Marker
                          icon={futureIcon}
                          key={id}
                          position={[lat!, lon!]}
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
                ({ id, lat, lon, address, date, title, bezirk }) =>
                  selectedBezirk && bezirk !== selectedBezirk ? null : (
                    <React.Fragment key={id}>
                      <Marker icon={todayIcon} key={id} position={[lat!, lon!]}>
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
            : selectedDate && (
                <MarkersLists
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
          {!selectedDate &&
            futureFlohs.current.length > 0 &&
            futureFlohs.current.map(
              ({ id, lat, lon, address, date, title, bezirk }) =>
                selectedBezirk && bezirk !== selectedBezirk ? null : (
                  <React.Fragment key={id}>
                    <Marker icon={futureIcon} key={id} position={[lat!, lon!]}>
                      <FlohmarktPopUP
                        id={id}
                        address={address}
                        date={date}
                        title={title}
                      />
                    </Marker>
                  </React.Fragment>
                )
            )}
        </GeneralMap>
      </section>
      <aside
        id="flohmaerkte-map-filters-aside"
        className="w-full h-full flex md:flex-wrap  p-2"
      >
        <ScrollableContainer vertical>
          <div className="w-full h-full flex flex-wrap  p-2">
            <div className="flex w-full flex-col">
              <h3 className="font-bold text-lg p-2 text-hh-800">Termine</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {Object.keys(thisWeekFlohs.current).map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setFutureSelected(false);
                      setSelectedDate((prev) =>
                        prev === parseInt(date) ? undefined : parseInt(date)
                      );
                    }}
                    className={`text-sm p-1 border-2  border-hh-600 rounded-md ${
                      selectedDate === parseInt(date)
                        ? "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                        : "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50"
                    } transition-all`}
                  >
                    {selectedDate === today ? "Heute" : getDate(parseInt(date))}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedDate(undefined);

                    setFutureSelected((prev) => !prev);
                  }}
                  className={`text-sm p-1 w-fit border-2 border-hh-600 rounded-md ${
                    !futureSelected
                      ? "bg-hh-50 text-hh-800  hover:bg-hh-600 hover:text-hh-50"
                      : "bg-hh-800 text-hh-50  hover:bg-hh-600 hover:text-hh-50"
                  } transition-all`}
                >
                  Zukünftige Flohmärkte
                </button>
              </div>
            </div>

            <div className="flex w-full flex-col">
              <h3 className="font-bold text-lg p-2 text-hh-800">Bezirke</h3>
              <div className="flex flex-wrap gap-2 items-center">
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
                      selectedBezirk === item
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
