"use client";
import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "./@Cards/FlohmarktPoster";
import { bezirke } from "@app/utils/constants";
import { cn, getDate, separateInBezirke } from "@app/utils/functions";
import ScrollableCardList from "./@Cards/ScrollableCardList";
import NoEventsBanner from "./NoEventsBanner";

const SingleBezirkEvents = ({
  displayBezirke,
  eventsByBezirke,
  horizontalCards,
  heute,
  heuteMilisec,
  bezirk,
}: {
  displayBezirke: iBezirk[];
  eventsByBezirke: Record<string, iFlohmarkt[]>;
  horizontalCards?: boolean;
  heute: string;
  heuteMilisec: number;
  bezirk?: iBezirk;
}) => {
  const [expanded, setExpanded] = React.useState<Array<string>>([]);
  return displayBezirke.map((currentBezirk) => {
    const currentBezirkEvents = eventsByBezirke[currentBezirk];
    return (
      <div
        id={currentBezirk.toLowerCase().replace(/\s/g, "-")}
        key={currentBezirk}
        className={cn(
          "min-w-[250px] max-w-full h-[350px] flex items-center flex-col rounded shadow-md outline outline-2 outline-hh-800 hover:bg-white",
          currentBezirkEvents.length > 4 || displayBezirke.length === 1
            ? "w-fit"
            : "w-fit lg:max-w-[calc(50%-1rem)]",
          expanded.includes(currentBezirk)
            ? "min-w-fit "
            : currentBezirkEvents.length > 1
              ? "pb-1"
              : "",
        )}
      >
        {!bezirk && (
          <div
            className={cn(
              "relative w-full flex items-center p-2 pb-0 justify-between",
            )}
          >
            <h3
              className={`${
                currentBezirkEvents.length > 1 ? "ml-2" : "ml-2"
              } text-xl font-semibold text-hh-800 text-center self-start`}
            >
              {currentBezirk}
            </h3>
            {currentBezirkEvents.length > 1 && (
              <button
                className={cn(
                  "mx-2 p-1 rounded bg-hh-800 bg-opacity-25 text-xs leading-tight text-white font-semibold border border-hh-200 hover:bg-opacity-50 transition",
                  expanded.includes(currentBezirk)
                    ? "bg-opacity-50 hover:bg-opacity-75"
                    : "rounded-full aspect-square w-6",
                )}
                onClick={() => {
                  if (expanded.includes(currentBezirk)) {
                    setExpanded(expanded.filter((b) => b !== currentBezirk));
                  } else {
                    setExpanded([...expanded, currentBezirk]);
                  }
                }}
              >
                {expanded.includes(currentBezirk) ? "× Weniger anzeigen" : "+"}
              </button>
            )}
          </div>
        )}
        {horizontalCards ? (
          <ScrollableCardList
            color="800"
            linkPrefix="/flohmaerkte/"
            posts={currentBezirkEvents}
            size="small"
            withDate
            cardType="horizontal"
          />
        ) : (
          <ScrollableContainer
            color="300"
            paddingForButtons={false}
            showButtons={currentBezirkEvents.length > 1}
            containerStyle={`px-1 ${expanded.includes(currentBezirk) ? "max-w-fit" : ""}`}
            boxStyle="px-0"
          >
            {currentBezirkEvents.map(
              (
                {
                  id,
                  title,
                  date,
                  image,
                  address,
                  bezirk: flohBezirk,
                  stadtteil,
                  type: eventType,
                  endDate,
                },
                i,
              ) => {
                const evDate = getDate(date, false, true);
                const offenHeute =
                  evDate === heute || (endDate && endDate > heuteMilisec);
                return (
                  <article
                    key={id}
                    className={`relative flex flex-col items-center overflow-hidden h-[275px] min-w-[180px] gap-1 ${offenHeute && "outline-2  outline outline-offset-2 rounded outline-positive-700 bg-positive-700 bg-opacity-20"}`}
                  >
                    <div className="overflow-hidden h-[250px] min-w-[180px] shadow shadow-[#00000033]">
                      <FlohmarktPoster
                        bezirk={flohBezirk}
                        id={id}
                        index={i}
                        title={title}
                        date={date}
                        endDate={endDate}
                        image={image}
                        prefixLink={`/${!eventType || eventType === "flohmarkt" ? "flohmaerkte" : "events"}/`}
                      />
                    </div>
                    <h3 className="text-hh-800 text-center self-start-between items-center h-[20px] w-full font-semibold text-sm truncate-1">
                      <span className="font-bold mr-4">
                        {offenHeute ? "Heute" : evDate}
                      </span>
                      <span className="text-xs">
                        {stadtteil === "Andere Orte"
                          ? address.match(/,\s*\d+\s+(.+)$/)?.[1] || stadtteil
                          : stadtteil}
                      </span>{" "}
                    </h3>
                  </article>
                );
              },
            )}
          </ScrollableContainer>
        )}
      </div>
    );
  });
};
export default function BezirkeScrollableEvents({
  events,
  bezirk,
  title,
  verticalTitle,
  titleShadow,
  className,
  horizontalCards,
  todaysFlohmaerkte,
}: {
  type?: "flohmaerkte" | "events";
  events: iFlohmarkt[];
  bezirk?: iBezirk;
  title?: string;
  titleShadow?: boolean;
  verticalTitle?: boolean;
  className?: string;
  horizontalCards?: boolean;
  todaysFlohmaerkte?: iFlohmarkt[];
}) {
  if (events.length === 0) return null;
  const eventsByBezirke = separateInBezirke(
    [...events].sort((a, b) => a.date - b.date),
  );
  const filteredList = bezirk
    ? events.filter((ev) => ev.bezirk === bezirk)
    : events;

  const eventsBezirke = Array.from(new Set(events.map((ev) => ev.bezirk)));
  const displayBezirke = bezirk
    ? [bezirk]
    : bezirke
        .filter((bez) => eventsBezirke.includes(bez))
        .sort((a, b) => {
          if (a === "Umland Hamburg") return 1;
          if (b === "Umland Hamburg") return -1;
          return eventsByBezirke[b].length - eventsByBezirke[a].length;
        });
  const heuteMilisec = Date.now();
  const heute = getDate(heuteMilisec, false, true);
  const todayFlohmaerkteLength = todaysFlohmaerkte?.length || 0;
  return (
    <div
      id="bezirke-scrollable-events"
      className={cn(
        "w-full h-fit py-1 flex items-stretch flex-wrap gap-2 lg:gap-4 scroll-mt-20 bg-transparent hover:bg-white hover:bg-opacity-50 border-2 border-transparent lg:hover:border-hh-950 md:p-2 transition-all duration-500 rounded",
        todayFlohmaerkteLength < 3
          ? "md:flex-nowrap"
          : todayFlohmaerkteLength < 4
            ? "xl:flex-nowrap"
            : "",
      )}
    >
      {todaysFlohmaerkte && (
        <div
          className={cn(
            "mt-1 md:mt-auto md:mb-8 relative flex  flex-col rounded-md bg-hh-900 hover:shadow-lg transition-all  min-w-[220px] w-fit max-w-full p-2 pt-0 shadow-sm h-fit",
            todayFlohmaerkteLength > 3 && "md:mb-0",
          )}
        >
          <h2 className="text-2xl font-semibold text-hh-100 text-center p-2 pb-0  self-start">
            Heute
          </h2>

          <ScrollableContainer
            containerStyle="self-center h-fit"
            color="300"
            showButtons={todayFlohmaerkteLength > 2}
          >
            {todaysFlohmaerkte.map((floh) => (
              <article
                key={floh.id}
                className="relative flex flex-col items-center overflow-hidden h-[275px] min-w-[180px] gap-1"
              >
                <h3 className="text-hh-100 text-center h-[20px] w-full font-semibold text-sm truncate-1">
                  {floh.stadtteil === "Andere Orte"
                    ? floh.address.match(/,\s*\d+\s+(.+)$/)?.[1] ||
                      floh.stadtteil
                    : floh.stadtteil}
                </h3>
                <div className="overflow-hidden h-[250px] min-w-[180px] bg-white">
                  <FlohmarktPoster
                    key={floh.id}
                    title={floh.title}
                    bezirk={floh.bezirk}
                    date={floh.date}
                    image={floh.image}
                    id={floh.id}
                    prefixLink={`/${floh.type === "flohmarkt" || !floh.type ? "flohmaerkte" : "events"}/`}
                  />
                </div>
              </article>
            ))}
          </ScrollableContainer>
        </div>
      )}
      <div
        className={cn(
          "w-fit h-fit max-w-full rounded",
          verticalTitle ? " flex items-stretch" : "",
          className,
        )}
      >
        {title &&
          (!!filteredList.length ? (
            <div
              className={`${verticalTitle ? "flex w-20 min-h-full self-end items-center justify-center" : "max-w-full"}`}
            >
              <h2
                className={
                  verticalTitle
                    ? "-rotate-90 w-full tracking-wide text-2xl sm:text-4xl font-bold lg:py-4"
                    : "text-2xl sm:text-3xl font-bold text-start self-start pb-2 sm:pb-3 px-3"
                }
                style={
                  titleShadow ? { textShadow: "#33404D 2px 2px 12px" } : {}
                }
              >
                {title}
              </h2>
            </div>
          ) : (
            <NoEventsBanner type="flohmaerkte" />
          ))}
        {!!displayBezirke.length && (
          <ScrollableContainer
            containerStyle="max-h-[400px] mb-1"
            boxStyle="pb-3 px-[2px] gap-2"
            color="800"
            showButtons={false}
          >
            <SingleBezirkEvents
              displayBezirke={displayBezirke}
              eventsByBezirke={eventsByBezirke}
              horizontalCards={horizontalCards}
              heute={heute}
              heuteMilisec={heuteMilisec}
              bezirk={bezirk}
            />
          </ScrollableContainer>
        )}
      </div>
    </div>
  );
}
