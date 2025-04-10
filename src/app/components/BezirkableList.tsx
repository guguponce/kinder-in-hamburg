"use client";
import { bezirke } from "@app/utils/constants";
import { cn } from "@app/utils/functions";
import { iBezirk, iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import React, { useMemo } from "react";
import ScrollableCardList from "./@Cards/ScrollableCardList";

export default function BezirkableList({
  title,
  list,
  variant = "light",
  type = "flohmaerkte",
  withDate,
  cardType,
  cardClassname = "",
  containerClassname = "",
}: {
  type?: "flohmaerkte" | "events" | "posts" | "spielplaetze";
  title?: string;
  variant?: "light" | "dark" | "transparent-light" | "transparent-dark";
  list: iFlohmarkt[] | iPost[] | iSpielplatz[];
  withDate?: boolean;
  cardType?: "horizontal" | "text-priority";
  cardClassname?: string;
  containerClassname?: string;
}) {
  const [bezirk, setBezirk] = React.useState<iBezirk | "all">("all");
  const bezirkeList = useMemo(
    () =>
      bezirke.filter((bezirk) => list.some((event) => event.bezirk === bezirk)),
    [list]
  );
  const filteredList = useMemo(
    () =>
      (bezirk === "all" ? list : list.filter((ev) => ev.bezirk === bezirk)) as
        | iPost[]
        | iFlohmarkt[]
        | iSpielplatz[],
    [bezirk, list]
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
  if (!list.length) return null;
  return (
    <section
      className={cn(
        "bezirkablelist max-w-full rounded sm:px-2 md:px-4 py-2 my-2 flex flex-col",
        containerStyle,
        containerClassname
      )}
    >
      {title && title !== "" && (
        <h2 className="text-2xl font-semibold text-start self-start p-2">
          {title}
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
      <div className="max-w-full">
        <ScrollableCardList
          cardType={cardType}
          posts={filteredList}
          size="small"
          cardClassname={cardClassname}
          descriptions
          linkPrefix={`/${type}/`}
          withDate={withDate}
        />
      </div>
    </section>
  );
}
