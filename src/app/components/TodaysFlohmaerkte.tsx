import React from "react";
import ScrollableContainer from "./ScrollableContainer";
import FlohmarktPoster from "./@Cards/FlohmarktPoster";
import { iFlohmarkt } from "@app/utils/types";

export default function TodaysFlohmaerkte({
  todayFlohmaerkte,
}: {
  todayFlohmaerkte: iFlohmarkt[];
}) {
  return (
    <div className="relative flex  flex-col rounded-md bg-hh-200 bg-opacity-50 min-w-[220px] w-fit max-w-full p-2 pt-0 shadow-sm h-fit">
      <h2 className="text-2xl font-semibold text-hh-800 text-center p-2 pb-0  self-start">
        Heute
      </h2>

      <ScrollableContainer
        containerStyle=" self-center h-fit"
        color="800"
        paddingForButtons={todayFlohmaerkte.length > 3}
      >
        {todayFlohmaerkte.map((floh) => (
          <article
            key={floh.id}
            className="relative flex flex-col items-center overflow-hidden h-[275px] min-w-[180px] gap-1"
          >
            <h3 className="text-hh-800 text-center h-[20px] w-full font-semibold text-sm truncate-1">
              {floh.stadtteil}
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
  );
}
