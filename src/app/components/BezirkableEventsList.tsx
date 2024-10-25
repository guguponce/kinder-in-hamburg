"use client";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { bezirke } from "@app/utils/constants";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import React, { useMemo } from "react";

export default function BezirkableEventsList({
  title,
  eventsList,
  variant = "light",
  type = "flohmaerkte",
}: {
  type?: "flohmaerkte" | "events";
  title?: string;
  variant?: "light" | "dark" | "transparent-light" | "transparent-dark";
  eventsList: iFlohmarkt[];
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
  const style = useMemo(() => {
    switch (variant) {
      case "light":
        return "bg-white bg-opacity-75 text-hh-700";
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

  return (
    <section
      className={`w-full rounded sm:px-2 md:px-4 my-2 flex flex-col ${style}`}
    >
      {title && title !== "" && (
        <h2 className="text-2xl font-semibold text-start self-start p-2">
          {title}{" "}
        </h2>
      )}
      <select
        name="bezirk"
        id="bezirk-select"
        className="px-2 py-1 ml-2 rounded-md bg-hh-600 font-semibold text-white w-fit"
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
        <ScrollableContainer>
          {filteredList.map(
            ({ id, title, date, image, bezirk: eventBezirk }, i) => (
              <article
                key={id}
                className={`overflow-hidden h-[250px] min-w-[180px] shadow-lg ${
                  i === filteredList.length - 1 ? "" : "mr-4"
                }`}
              >
                <FlohmarktPoster
                  bezirk={eventBezirk}
                  id={id}
                  title={title}
                  date={date}
                  image={image}
                  index={i}
                  prefixLink={`/${type}/`}
                />
              </article>
            )
          )}
        </ScrollableContainer>
      </div>
    </section>
  );
}
