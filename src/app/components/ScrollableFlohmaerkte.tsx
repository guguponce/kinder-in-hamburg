import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import { iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "./@PostForm/FlohmarktPoster";

export default function ScrollableFlohmaerkte({
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
      {title && (
        <h2 className="text-2xl font-semibold text-white text-center p-2 lg:p-4">
          {title}{" "}
        </h2>
      )}

      <div className="overflow-x-auto w-fit max-w-full px-4 pb-4 pt-2 flex justify-center flex-wrap gap-2 lg:gap-4 items-stretch">
        {bezirk
          ? filteredList.map(
              ({ id, title, date, image, bezirk: flohBezirk }, i) => (
                <article
                  key={id}
                  className={`overflow-hidden h-[250px] min-w-[180px] ${
                    i === flohmaerkte.length - 1 ? "" : "mr-4"
                  }`}
                >
                  <FlohmarktPoster
                    bezirk={flohBezirk}
                    id={id}
                    title={title}
                    date={date}
                    image={image}
                    prefixLink={`/flohmaerkte/`}
                  />
                </article>
              )
            )
          : bezirke.map((bezirk) => (
              <div
                key={bezirk}
                className="flex items-center flex-col gap-2 rounded bg-hh-600 bgop75 p-2 w-[275px] sm:w-fit"
              >
                <h3 className="text-xl font-semibold text-white text-center">
                  {bezirk}
                </h3>
                <ScrollableContainer>
                  {reducedFlohmaerkte[bezirk].map(
                    ({ id, title, date, image, bezirk: flohBezirk }, i) => (
                      <article
                        key={id}
                        className="overflow-hidden h-[250px] min-w-[180px]"
                      >
                        <FlohmarktPoster
                          bezirk={flohBezirk}
                          id={id}
                          title={title}
                          date={date}
                          image={image}
                          prefixLink={`/flohmaerkte/`}
                        />
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
