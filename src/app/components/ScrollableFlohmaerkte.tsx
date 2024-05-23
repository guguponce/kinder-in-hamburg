import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import { iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "./FlohmarktPoster";
import PaperPlane from "./@Icons/PaperPlane";

export default async function ScrollableFlohmaerkte({
  flohmaerkte,
  bezirk,
  title,
}: {
  flohmaerkte: iFlohmarkt[];
  bezirk?: string;
  title?: string;
}) {
  const bezirke = Array.from(
    new Set(flohmaerkte.map((floh) => floh.bezirk))
  ).sort();
  const reducedFlohmaerkte = [...flohmaerkte]
    .sort((a, b) => a.date - b.date)
    .reduce((acc, floh) => {
      if (!acc[floh.bezirk]) {
        acc[floh.bezirk] = [floh];
      } else {
        acc[floh.bezirk] = [...acc[floh.bezirk], floh];
      }
      return acc;
    }, {} as { [key: string]: iFlohmarkt[] });
  const filteredList = bezirk
    ? flohmaerkte.filter((floh) => floh.bezirk === bezirk)
    : flohmaerkte;
  return (
    <div className="w-fit max-w-full rounded">
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
              Keine für diese Woche
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
      <div className="overflow-x-auto w-fit max-w-full flex justify-center flex-wrap gap-2 lg:gap-4 items-stretch">
        {bezirk
          ? filteredList.map(
              (
                { id, title, date, image, bezirk: flohBezirk, stadtteil },
                i
              ) => (
                <article
                  key={id}
                  className={`overflow-hidden h-[270px] min-w-[180px] shadow-md ${
                    i === flohmaerkte.length - 1 ? "" : "mr-4"
                  }`}
                >
                  <FlohmarktPoster
                    bezirk={flohBezirk}
                    id={id}
                    index={i}
                    title={title}
                    date={date}
                    image={image}
                    prefixLink={`/flohmaerkte/`}
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
          : bezirke.map((bezirk) => (
              <div
                key={bezirk}
                className="flex items-center flex-col rounded bg-hh-600 bgop75 p-2 w-fit max-w-full shadow-md"
              >
                <h3 className="text-2xl font-semibold p-2 pb-0 ml-4 text-white self-start">
                  {bezirk}
                </h3>
                <ScrollableContainer>
                  {reducedFlohmaerkte[bezirk].map(
                    (
                      { id, title, date, image, bezirk: flohBezirk, stadtteil },
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
                            prefixLink={`/flohmaerkte/`}
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
