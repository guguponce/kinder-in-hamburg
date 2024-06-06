"use client";
import React, { useEffect, useRef, useState } from "react";
import ExpandableContainer from "./ExpandableContainer";
import { iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
import { getDate } from "@app/utils/functions";

export default function WeitereFlohmaerkte({
  displayedMarkers,
}: {
  displayedMarkers: iFlohmarkt[];
}) {
  const [contentHeight, setContentHeight] = useState<number>(128 + 16);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (listRef.current) {
      setContentHeight(listRef.current.scrollHeight);
    }
  }, []);

  return (
    <ExpandableContainer
      contentHeight={contentHeight}
      initialHeight={128 * 2 + 32}
    >
      <ul
        ref={listRef}
        className="w-full flex flex-wrap justify-center gap-2 items-stretch"
      >
        {[...displayedMarkers]
          .sort((a, b) => a.date - b.date)
          .map(({ title, address, date, id, time, image }) => (
            <li
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
                <span className="font-semibold text-base block">{title}</span>
                <div className="flex flex-col">
                  <small className="font-semibold italic">
                    {getDate(date)} ({time})
                  </small>
                  <p className="text-xs">{address}</p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </ExpandableContainer>
  );
}
