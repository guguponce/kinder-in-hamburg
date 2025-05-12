"use client";
import React, { useEffect, useRef, useState } from "react";
import ExpandableContainer from "./ExpandableContainer";
import { iFlohmarkt } from "@app/utils/types";
import { cn, getDate } from "@app/utils/functions";
import HorizontalCard from "./@Cards/HorizontalCard";

function addressWithoutCity(address: string) {
  const match = address.match(/\b\d{5}\b/);
  if (match && match.index) {
    let plzIndex = match.index;
    let newAddress = address.slice(0, plzIndex + 5).trim();
    return newAddress;
  } else {
    return address;
  }
}

export default function WeitereEvents({
  type,
  displayedMarkers,
  boxStyle,
}: {
  boxStyle?: string;
  type:
    | "Spielplätze"
    | "Spielgeräte"
    | "Veranstaltungen"
    | "Aktivitäten"
    | "Flohmärkte"
    | "Posts"
    | "Events"
    | undefined;
  displayedMarkers: iFlohmarkt[];
}) {
  const [contentHeight, setContentHeight] = useState<number>(128 + 16);
  const listRef = useRef<HTMLDivElement>(null);
  const flohmaerkteByDate = useRef(
    displayedMarkers.reduce(
      (acc, flohmarkt) => {
        const date = flohmarkt.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(flohmarkt);
        return acc;
      },
      {} as Record<string, iFlohmarkt[]>
    )
  );

  useEffect(() => {
    if (listRef.current) {
      setContentHeight(listRef.current.scrollHeight);
    }
  }, []);
  const orderedDates = Object.keys(flohmaerkteByDate.current).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  return (
    <div
      ref={listRef}
      className="w-fit max-w-full flex flex-col gap-4 items-stretch justify-stretch"
    >
      {orderedDates.map((date, i) => (
        <React.Fragment key={date}>
          <article
            className={cn(
              "flex flex-col gap-2 w-full flex-grow bg-hh-400 rounded",
              boxStyle
            )}
          >
            <ExpandableContainer
              type={type}
              displayButton={flohmaerkteByDate.current[date].length > 2}
              contentHeight={contentHeight}
              initialHeight={
                flohmaerkteByDate.current[date].length < 2 ? 180 : 128 * 2 + 40
              }
            >
              <h3 className="text-lg font-semibold text-hh-900">
                {getDate(parseInt(date), "short")}
              </h3>
              <div className="flex flex-wrap justify-between gap-2 items-stretch max-w-[360px] sm:max-w-none">
                {flohmaerkteByDate.current[date].map(
                  (
                    { title, address, date, id, time, image, stadtteil, type },
                    i,
                    arr
                  ) => (
                    <div
                      key={id}
                      className={`w-[360px] max-w-full ${arr.length > 1 ? "sm:w-[calc(50%-1rem)]" : ""}`}
                    >
                      <HorizontalCard
                        type={type || "flohmarkt"}
                        id={id}
                        title={title}
                        link={`/${type ? "events" : "flohmaerkte"}/${id}`}
                        image={image || ""}
                      >
                        <HorizontalCard.FlohmarktInfo
                          title={title}
                          address={addressWithoutCity(address)}
                          stadtteil={stadtteil}
                          date={date}
                          time={time}
                        />
                      </HorizontalCard>
                    </div>
                  )
                )}{" "}
              </div>
            </ExpandableContainer>
          </article>
        </React.Fragment>
      ))}
    </div>
  );
}
