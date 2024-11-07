"use client";
import React, { useEffect, useRef, useState } from "react";
import ExpandableContainer from "./ExpandableContainer";
import { iFlohmarkt } from "@app/utils/types";
import { getDate } from "@app/utils/functions";
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

export default function WeitereFlohmaerkte({
  type,
  displayedMarkers,
}: {
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
        const date = getDate(flohmarkt.date);
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

  return (
    <div ref={listRef} className="w-full flex flex-col gap-4 items-stretch">
      {Object.entries(flohmaerkteByDate.current)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([date, displayedFlohs]) => (
          <React.Fragment key={date}>
            <ExpandableContainer
              type={type}
              contentHeight={contentHeight}
              initialHeight={displayedFlohs.length < 2 ? 180 : 128 * 2 + 32}
            >
              <article className="flex flex-col gap-2 items-stretch w-full">
                <h3 className="text-lg font-semibold text-hh-900">{date}</h3>
                <div className="flex flex-wrap justify-center gap-2 items-stretch">
                  {displayedFlohs.map(
                    ({
                      title,
                      address,
                      date,
                      id,
                      time,
                      image,
                      stadtteil,
                      type,
                    }) => (
                      <div key={id} className="w-[360px] md:w-[calc(50%-1rem)]">
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
              </article>
            </ExpandableContainer>
          </React.Fragment>
        ))}
    </div>
  );
}
