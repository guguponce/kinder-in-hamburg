"use client";
import { bezirke } from "@app/utils/constants";
import { cn, separateInBezirke } from "@app/utils/functions";
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
  const [maxDisplayed, setMaxDisplayed] = React.useState(10);
  const bezirkeList = useMemo(
    () =>
      bezirke.filter((bezirk) => list.some((event) => event.bezirk === bezirk)),
    [list],
  );
  const filteredList = useMemo(
    () =>
      (bezirk === "all" ? list : list.filter((ev) => ev.bezirk === bezirk)) as
        | iPost[]
        | iFlohmarkt[]
        | iSpielplatz[],
    [bezirk, list],
  );
  const displayList = useMemo(
    () =>
      filteredList.length > maxDisplayed
        ? filteredList.slice(0, maxDisplayed)
        : filteredList,
    [filteredList, maxDisplayed],
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
        "bezirkablelist max-w-full rounded sm:px-2 md:px-4 py-2 my-2 flex flex-col transition-all",
        containerStyle,
        containerClassname,
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
        onChange={(e) => {
          setBezirk(e.target.value as iBezirk | "all");
          setMaxDisplayed(10);
        }}
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
          posts={displayList}
          size="small"
          cardClassname={cardClassname}
          descriptions
          linkPrefix={`/${type}/`}
          withDate={withDate}
          showButtons={filteredList.length > 3}
        >
          {maxDisplayed < filteredList.length && (
            <button
              className="self-center min-w-fit h-fit px-4 py-2 mr-4 rounded-md bg-hh-700 hover:bg-hh-800 hover:outline outline-2 outline-offset-2 outline-hh-800 text-white flex flex-col items-center font-semibold transition-colors duration-300"
              onClick={() => setMaxDisplayed((prev) => prev + 10)}
            >
              <span className="text-3xl font-bold">+</span>
              <span className="text-xs">Mehr anzeigen</span>
            </button>
          )}
        </ScrollableCardList>
      </div>
    </section>
  );
}
