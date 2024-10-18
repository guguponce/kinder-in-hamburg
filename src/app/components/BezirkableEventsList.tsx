"use client";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { bezirke } from "@app/utils/constants";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import React, { useMemo } from "react";

export default function BezirkableEventsList({
  title,
  eventsList,
  type = "flohmaerkte",
}: {
  type?: "flohmaerkte" | "events";
  title?: string;
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
  return (
    <section className="w-full  rounded bg-white bg-opacity-75 p-4 flex flex-col">
      {title && title !== "" && (
        <h2 className="text-2xl font-semibold text-hh-700 text-start self-start p-2">
          {title}{" "}
        </h2>
      )}
      <select
        name="bezirk"
        id="bezirk-select"
        className="px-2 py-1 ml-4 rounded-md bg-hh-600 font-semibold text-white w-fit"
        onChange={(e) => setBezirk(e.target.value as iBezirk)}
      >
        <option value="all">In alle Bezirke</option>
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
