"use client";
import React, { useEffect, useRef, useState } from "react";
import ExpandableContainer from "./ExpandableContainer";
import { iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
import { getDate } from "@app/utils/functions";

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
  displayedMarkers,
}: {
  displayedMarkers: iFlohmarkt[];
}) {
  const [contentHeight, setContentHeight] = useState<number>(128 + 16);
  const listRef = useRef<HTMLDivElement>(null);
  const flohmaerkteByDate = useRef(
    displayedMarkers.reduce((acc, flohmarkt) => {
      const date = getDate(flohmarkt.date);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(flohmarkt);
      return acc;
    }, {} as Record<string, iFlohmarkt[]>)
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
              contentHeight={contentHeight}
              initialHeight={128 * 2 + 32}
            >
              <article className="flex flex-col gap-2 items-stretch w-full">
                <h3 className="text-lg font-semibold text-hh-900">{date}</h3>
                <div className="flex flex-wrap justify-center gap-2 items-stretch">
                  {displayedFlohs.map(
                    ({ title, address, date, id, time, image, stadtteil }) => (
                      <div
                        key={id}
                        className="w-[360px] sm:w-1/3 max-w-[380px] h-32 sm:flex-grow justify-center flex gap-2 items-center bg-white rounded-md overflow-hidden hover:shadow-md"
                      >
                        <div className="h-full aspect-square min-w-1/3 w-1/3 bg-hh-50 bg-25 overflow-hidden flex justify-center items-center">
                          <img
                            loading="lazy"
                            src={image || "/assets/icons/market.svg"}
                            alt="location"
                            className={`${
                              image ? "w-full h-full" : "w-3/4 h-3/4"
                            } object-contain`}
                          />
                        </div>
                        <Link
                          href={`/flohmaerkte/${id}`}
                          className="flex flex-col w-2/3 h-full hover:text-hh-700 justify-between gap-2  p-2 pl-0 sm:pr-4 sm:p-2"
                        >
                          <span className="font-semibold text-base block">
                            {title}
                          </span>
                          <div className="flex flex-col">
                            <small className="font-semibold italic">
                              {getDate(date)} ({time})
                            </small>
                            <p className="text-xs">
                              {addressWithoutCity(address)} {stadtteil}
                            </p>
                          </div>
                        </Link>
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
