import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import { iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "./@Cards/FlohmarktPoster";
import PaperPlane from "./@Icons/PaperPlane";
import { bezirke } from "@app/utils/constants";
import { separateInBezirke } from "@app/utils/functions";

export default async function BezirkeScrollableEvents({
  events,
  bezirk,
  title,
  type = "flohmaerkte",
}: {
  type?: "flohmaerkte" | "events";
  events: iFlohmarkt[];
  bezirk?: string;
  title?: string;
}) {
  if (events.length === 0) return null;
  const eventsByBezirke = separateInBezirke(
    [...events].sort((a, b) => a.date - b.date)
  );

  const eventsBezirke = Array.from(new Set(events.map((ev) => ev.bezirk)));
  const displayBezirke = bezirke
    .filter((bez) => eventsBezirke.includes(bez))
    .sort((a, b) => eventsByBezirke[b].length - eventsByBezirke[a].length);
  const filteredList = bezirk
    ? events.filter((ev) => ev.bezirk === bezirk)
    : events;

  return (
    <div id="bezirke-scrollable-events" className="w-fit max-w-full rounded">
      {title &&
        (!!filteredList.length ? (
          <div className="max-w-full">
            <h2 className="text-3xl font-semibold text-white text-start self-start p-2 lg:p-4">
              {title}
            </h2>
          </div>
        ) : (
          <div className="max-w-full flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-white text-center p-1 lg:p-2">
              Keine {type === "flohmaerkte" ? "Flohmärkte" : "Veranstaltungen"}{" "}
              gefunden
            </h2>
            <p className="text-hh-100">
              Wenn ihr einen veranstaltet oder kennt, schreibt uns gerne eine
              E-Mail.
            </p>
            <a
              href="mailto:admin@kinder-in-hamburg.de"
              className="flex items-center gap-2 self-center p-4 bg-hh-800 text-hh-100 font-semibold rounded-lg mt-4 w-max hover:bg-hh-700 transition-colors duration-300 ease-in-out"
            >
              <PaperPlane />
              admin@kinder-in-hamburg.de
            </a>
          </div>
        ))}
      <div className="overflow-x-auto w-fit max-w-full flex justify-center flex-wrap gap-2 items-stretch">
        {bezirk
          ? filteredList.map(
              (
                {
                  id,
                  title,
                  date,
                  image,
                  bezirk: flohBezirk,
                  stadtteil,
                  type: eventType,
                },
                i
              ) => (
                <article
                  key={id}
                  className={`overflow-hidden h-[270px] min-w-[180px] shadow-md ${
                    i === events.length - 1 ? "" : "mr-4"
                  }`}
                >
                  <FlohmarktPoster
                    bezirk={flohBezirk}
                    id={id}
                    index={i}
                    title={title}
                    date={date}
                    image={image}
                    prefixLink={`/${type}/`}
                    eventType={eventType || "flohmarkt"}
                  />
                  <h3 className="h-[20px] w-full font-semibold text-xs truncate-1">
                    <span>
                      {new Date(date)
                        .toLocaleDateString("de-DE")
                        .replace(".2024", " - ")}
                    </span>
                    <span> {stadtteil}</span>{" "}
                  </h3>
                </article>
              )
            )
          : displayBezirke.map((bezirk) => (
              <div
                key={bezirk}
                className={`min-w-[248px] flex items-center flex-col rounded bg-hh-600 bg-opacity-50 p-2 ${
                  eventsByBezirke[bezirk].length > 4
                    ? "w-fit"
                    : "xl:w-[calc(33%-0.5rem)] lg:w-[calc(50%-1rem)]"
                } max-w-full shadow-md`}
              >
                <h3
                  className={`${
                    eventsByBezirke[bezirk].length > 1 ? "ml-4" : "mx-auto"
                  } text-2xl font-semibold p-2 pb-0 text-white self-start text-center`}
                >
                  {bezirk}
                </h3>
                <ScrollableContainer color="800">
                  {eventsByBezirke[bezirk].map(
                    (
                      {
                        id,
                        title,
                        date,
                        image,
                        bezirk: flohBezirk,
                        stadtteil,
                        type: eventType,
                      },
                      i
                    ) => (
                      <article
                        key={id}
                        className="relative flex flex-col items-center overflow-hidden h-[275px] min-w-[180px] gap-1"
                      >
                        <div className="overflow-hidden h-[250px] min-w-[180px]">
                          <FlohmarktPoster
                            bezirk={flohBezirk}
                            id={id}
                            index={i}
                            title={title}
                            date={date}
                            image={image}
                            prefixLink={`/${type}/`}
                            eventType={eventType || "flohmarkt"}
                          />
                        </div>
                        <h3 className="text-white text-center h-[20px] w-full font-semibold text-sm truncate-1">
                          <span>
                            {new Date(date)
                              .toLocaleDateString("de-DE")
                              .replace(".2024", " - ")}
                          </span>
                          <span> {stadtteil}</span>{" "}
                        </h3>
                      </article>
                    )
                  )}
                </ScrollableContainer>
              </div>
            ))}
      </div>
    </div>
  );
}
