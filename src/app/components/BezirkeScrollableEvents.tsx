import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "./@Cards/FlohmarktPoster";
import PaperPlane from "./@Icons/PaperPlane";
import { bezirke } from "@app/utils/constants";
import { getDate, separateInBezirke } from "@app/utils/functions";

export default async function BezirkeScrollableEvents({
  events,
  bezirk,
  title,
  type = "flohmaerkte",
  verticalTitle,
  titleShadow,
}: {
  type?: "flohmaerkte" | "events";
  events: iFlohmarkt[];
  bezirk?: iBezirk;
  title?: string;
  titleShadow?: boolean;
  verticalTitle?: boolean;
}) {
  if (events.length === 0) return null;
  const eventsByBezirke = separateInBezirke(
    [...events].sort((a, b) => a.date - b.date)
  );
  const filteredList = bezirk
    ? events.filter((ev) => ev.bezirk === bezirk)
    : events;

  const eventsBezirke = Array.from(new Set(events.map((ev) => ev.bezirk)));
  const displayBezirke = bezirk
    ? [bezirk]
    : bezirke
        .filter((bez) => eventsBezirke.includes(bez))
        .sort((a, b) => eventsByBezirke[b].length - eventsByBezirke[a].length);
  const heuteMilisec = Date.now();
  const heute = getDate(heuteMilisec, false, true);
  return (
    <div
      id="bezirke-scrollable-events"
      className={`w-fit max-w-full rounded ${verticalTitle ? " flex items-stretch" : ""}`}
    >
      {title &&
        (!!filteredList.length ? (
          <div
            className={`${verticalTitle ? "flex w-20 min-h-full self-end items-center justify-center" : "max-w-full"}`}
          >
            <h2
              className={
                verticalTitle
                  ? "-rotate-90 w-full tracking-wide text-2xl sm:text-4xl font-semibold text-white p-2 lg:p-4"
                  : "text-xl sm:text-2xl font-semibold text-white text-start md:text-center self-start p-2 lg:p-4"
              }
              style={titleShadow ? { textShadow: "#33404D 3px 3px 6px" } : {}}
            >
              {title}
            </h2>
          </div>
        ) : (
          <div className="max-w-full flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-white text-center p-1 lg:p-2">
              Keine {type === "flohmaerkte" ? "Flohmärkte" : "Veranstaltungen"}{" "}
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
      {!!displayBezirke.length && (
        <div className="overflow-x-auto w-fit lg:w-full max-w-full flex justify-center flex-wrap gap-2 items-stretch mx-auto">
          {displayBezirke.map((currentBezirk) => (
            <div
              key={currentBezirk}
              className={`min-w-[248px] max-w-full flex items-center flex-col rounded bg-hh-600 bg-opacity-50 p-2 ${
                eventsByBezirke[currentBezirk].length > 4 ||
                displayBezirke.length === 1
                  ? "w-fit"
                  : "xl:w-[calc(33%-0.5rem)] lg:w-[calc(50%-1rem)]"
              } max-w-full shadow-md`}
            >
              {!bezirk && (
                <h3
                  className={`${
                    eventsByBezirke[currentBezirk].length > 1
                      ? "ml-4"
                      : "mx-auto"
                  } text-xl font-semibold p-2 pb-0 text-white self-start text-center`}
                >
                  {currentBezirk}
                </h3>
              )}
              <ScrollableContainer
                color="800"
                paddingForButtons={false}
                showButtons={eventsByBezirke[currentBezirk].length > 2}
              >
                {eventsByBezirke[currentBezirk].map(
                  (
                    {
                      id,
                      title,
                      date,
                      image,
                      bezirk: flohBezirk,
                      stadtteil,
                      type: eventType,
                      endDate,
                    },
                    i
                  ) => {
                    const evDate = getDate(date, false, true);
                    const offenHeute =
                      evDate === heute || (endDate && endDate > heuteMilisec);
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
                        <h3 className="text-white text-center flex justify-between items-center h-[20px] w-full font-semibold text-sm truncate-1">
                          <span className="font-bold mr-4">
                            {offenHeute ? "Heute" : evDate}
                          </span>
                          <span className="text-xs"> {stadtteil}</span>{" "}
                        </h3>
                      </article>
                    );
                  }
                )}
              </ScrollableContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
