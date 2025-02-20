"use client";
import FlohmarktPoster from "@app/components/@Cards/FlohmarktPoster";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { bezirke } from "@app/utils/constants";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import React, { useMemo } from "react";

export default function BezirkableEventsList({
  title,
  eventsList,
  variant = "light",
  type = "flohmaerkte",
  withDate,
}: {
  type?: "flohmaerkte" | "events";
  title?: string;
  variant?: "light" | "dark" | "transparent-light" | "transparent-dark";
  eventsList: iFlohmarkt[];
  withDate?: boolean;
}) {
  const [bezirk, setBezirk] = React.useState<iBezirk | "all">("all");
  const bezirkeList = useMemo(
    () =>
      bezirke.filter((bezirk) =>
        eventsList.some((event) => event.bezirk === bezirk)
      ),
    [eventsList]
  );
  const filteredList = useMemo(
    () =>
      bezirk === "all"
        ? eventsList
        : eventsList.filter((ev) => ev.bezirk === bezirk),
    [bezirk, eventsList]
  );
  const containerStyle = useMemo(() => {
    switch (variant) {
      case "light":
        return "bg-white bg-opacity-75 text-hh-700 ";
      case "dark":
        return "bg-hh-700 text-white";
      case "transparent-light":
        return "bg-transparent text-hh-700";
      case "transparent-dark":
        return "bg-transparent text-white";
      default:
        return "bg-white bg-opacity-75 text-hh-700";
    }
  }, [variant]);
  const selectStyle = useMemo(() => {
    switch (variant) {
      case "light":
        return "bg-hh-600 text-white";
      case "dark":
        return "bg-hh-300 text-hh-800";
      case "transparent-light":
        return "bg-hh-600 text-white";
      case "transparent-dark":
        return "bg-hh-300 text-hh-800";
      default:
        return "bg-hh-600 text-white";
    }
  }, [variant]);

  return (
    <section
      className={`bezirkableEventsList max-w-full rounded sm:px-2 md:px-4 py-2 my-2 flex flex-col ${containerStyle}`}
    >
      {title && title !== "" && (
        <h2 className="text-2xl font-semibold text-start self-start p-2">
          {title}{" "}
        </h2>
      )}
      <select
        name="bezirk"
        id="bezirk-select"
        className={`px-2 py-1 ml-2 rounded-md font-semibold w-fit ${selectStyle}`}
        onChange={(e) => setBezirk(e.target.value as iBezirk)}
      >
        <option value="all">In allen Bezirken</option>
        {bezirkeList.map((bezirk) => (
          <option key={bezirk} value={bezirk}>
            {bezirk}
          </option>
        ))}
      </select>
      <div className="min-h-[280px]">
        <ScrollableContainer
          color={
            variant === "dark"
              ? "300"
              : variant === "transparent-light"
                ? "300"
                : "800"
          }
        >
          {filteredList.map(
            (
              {
                id,
                title,
                date,
                image,
                bezirk: eventBezirk,
                type: eventType,
                endDate,
                stadtteil,
              },
              i
            ) => (
              <article
                key={id}
                className={`relative flex flex-col items-center gap-[2px] overflow-hidden h-[250px] min-w-[180px] shadow-lg ${
                  i === filteredList.length - 1 ? "" : "mr-4"
                }`}
              >
                <FlohmarktPoster
                  stadtteil={stadtteil}
                  eventType={eventType || "flohmarkt"}
                  bezirk={eventBezirk}
                  id={id}
                  title={title}
                  date={date}
                  image={image}
                  index={i}
                  prefixLink={`/${type}/`}
                  endDate={endDate}
                />
                {withDate && (
                  <div className="absolute z-50 -translate-x-1/2 bottom-0 left-1/2 rounded-[4px_4px_0_0] flex justify-center w-3/4  p-1 text-xs bg-hh-800 backdrop-blur-sm bg-opacity-50 text-white">
                    {new Date(date).toLocaleDateString("de-DE", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                )}
              </article>
            )
          )}
        </ScrollableContainer>
      </div>
    </section>
  );
}
