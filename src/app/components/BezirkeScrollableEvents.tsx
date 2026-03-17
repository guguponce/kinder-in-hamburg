import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "./@Cards/FlohmarktPoster";
import PaperPlane from "./@Icons/PaperPlane";
import { bezirke } from "@app/utils/constants";
import { cn, getDate, separateInBezirke } from "@app/utils/functions";
import ScrollableCardList from "./@Cards/ScrollableCardList";
import Link from "next/link";
import Button from "./@Buttons/Button";

export default async function BezirkeScrollableEvents({
  events,
  bezirk,
  title,
  type = "flohmaerkte",
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
        "w-full flex items-stretch flex-wrap gap-4 scroll-mt-20 hover:bg-hh-800 hover:bg-opacity-10 transition-colors rounded",
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
            "md:mt-auto md:mb-8 relative flex  flex-col rounded-md bg-hh-900 hover:shadow-lg transition-all  min-w-[220px] w-fit max-w-full p-2 pt-0 shadow-sm h-fit pb-3",
            todayFlohmaerkteLength > 3 && "md:mb-0",
          )}
        >
          <h2 className="text-2xl font-semibold text-hh-100 text-center p-2 pb-0  self-start">
            Heute
          </h2>

          <ScrollableContainer
            containerStyle=" self-center h-fit"
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
                  />
                </div>
              </article>
            ))}
          </ScrollableContainer>
        </div>
      )}
      <div
        className={cn(
          "w-fit max-w-full rounded",
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
                    : "text-2xl sm:text-3xl font-bold text-start self-start pb-2 sm:pb-4 px-3"
                }
                style={
                  titleShadow ? { textShadow: "#33404D 2px 2px 12px" } : {}
                }
              >
                {title}
              </h2>
            </div>
          ) : (
            <div className="max-w-full flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-white text-center p-1 lg:p-2">
                Keine{" "}
                {type === "flohmaerkte" ? "Flohmärkte" : "Veranstaltungen"}{" "}
                gefunden
              </h2>
              <p className="text-hh-100">
                Wenn ihr einen veranstaltet oder kennt, schreibt uns gerne eine
                E-Mail.
              </p>
              <a
                href="mailto:admin@kinder-in-hamburg.de"
                className="flex items-center gap-2 self-center p-4 bg-hh-800 text-hh-100 font-semibold rounded-lg mt-4 w-max hover:bg-hh-700 transition-colors duration-300 ease-in-out mb-2"
              >
                <PaperPlane />
                admin@kinder-in-hamburg.de
              </a>
            </div>
          ))}
        {events.length > 3 && (
          <div className="flex flex-wrap items-center gap-2 ">
            {bezirke.map((bez) => (
              <Link
                key={bez}
                className="w-fit rounded-full text-sm text-hh-950 bg-hh-100 px-2"
                href={`#${bez.toLowerCase().replace(/\s/g, "-")}`}
              >
                {bez}
              </Link>
            ))}
          </div>
        )}
        {!!displayBezirke.length && (
          // <div className="overflow-x-auto w-fit lg:w-full max-w-full flex justify-center flex-wrap gap-2 items-stretch mx-auto">
          <ScrollableContainer
            containerStyle="max-h-[400px] mb-4"
            color="800"
            showButtons={false}
          >
            {displayBezirke.map((currentBezirk) => (
              <div
                id={currentBezirk.toLowerCase().replace(/\s/g, "-")}
                key={currentBezirk}
                className={cn(
                  "min-w-[250px] max-w-full h-fit flex items-center flex-col rounded px-2 pb-2 shadow-md outline outline-2 outline-hh-800",
                  eventsByBezirke[currentBezirk].length > 4 ||
                    displayBezirke.length === 1
                    ? "w-fit"
                    : "w-fit lg:max-w-[calc(50%-1rem)]",
                  eventsByBezirke[currentBezirk].length === 1 && "pb-4",
                )}
              >
                {!bezirk && (
                  <h3
                    className={`${
                      eventsByBezirke[currentBezirk].length > 1
                        ? "ml-4"
                        : "mx-auto"
                    } text-xl font-semibold text-hh-800 text-center p-2 pb-0  self-start`}
                  >
                    {currentBezirk}
                  </h3>
                )}
                {horizontalCards ? (
                  <ScrollableCardList
                    color="800"
                    linkPrefix="/flohmaerkte/"
                    posts={eventsByBezirke[currentBezirk]}
                    size="small"
                    withDate
                  />
                ) : (
                  <ScrollableContainer
                    color="300"
                    paddingForButtons={false}
                    showButtons={eventsByBezirke[currentBezirk].length > 1}
                  >
                    {eventsByBezirke[currentBezirk].map(
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
                          evDate === heute ||
                          (endDate && endDate > heuteMilisec);
                        return (
                          <article
                            key={id}
                            className={`relative flex flex-col items-center overflow-hidden h-[275px] min-w-[180px] gap-1 ${offenHeute && "outline-2  outline outline-offset-2 rounded outline-positive-700 bg-positive-700 bg-opacity-20"}`}
                          >
                            <div className="overflow-hidden h-[250px] min-w-[180px]">
                              <FlohmarktPoster
                                bezirk={flohBezirk}
                                id={id}
                                index={i}
                                title={title}
                                date={date}
                                endDate={endDate}
                                image={image}
                                prefixLink={`/${type}/`}
                                eventType={eventType || "flohmarkt"}
                              />
                            </div>
                            <h3 className="text-hh-800 text-center pb-0  self-start-between items-center h-[20px] w-full font-semibold text-sm truncate-1">
                              <span className="font-bold mr-4">
                                {offenHeute ? "Heute" : evDate}
                              </span>
                              <span className="text-xs">
                                {stadtteil === "Andere Orte"
                                  ? address.match(/,\s*\d+\s+(.+)$/)?.[1] ||
                                    stadtteil
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
            ))}
          </ScrollableContainer>
          // </div>
        )}
      </div>
    </div>
  );
}
