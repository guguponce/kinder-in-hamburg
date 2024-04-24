"use client";
import FlohmarktPoster from "@app/components/@PostForm/FlohmarktPoster";
import ScrollableContainer from "@app/components/ScrollableContainer";
import ScrollableFlohmaerkte from "@app/components/ScrollableFlohmaerkte";
import { bezirke } from "@app/utils/constants";
import { iBezirk, iFlohmarkt } from "@app/utils/types";
import React, { useMemo } from "react";

export default function BezirkableFlohmaerkteList({
  title,
  flohList,
}: {
  title?: string;
  flohList: iFlohmarkt[];
}) {
  const [bezirk, setBezirk] = React.useState<iBezirk | "all">("all");
  const bezirkeList = useMemo(
    () =>
      bezirke.filter((bezirk) =>
        flohList.some((floh) => floh.bezirk === bezirk)
      ),
    [flohList]
  );
  const filteredList = useMemo(
    () =>
      bezirk === "all"
        ? flohList
        : flohList.filter((floh) => floh.bezirk === bezirk),
    [bezirk, flohList]
  );
  return (
    <section className="w-full lg:w-4/5 rounded bg-white bg-opacity-75 p-4 flex flex-col">
      {title && (
        <h2 className="text-2xl font-semibold text-hh-700 text-center p-2">
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
            ({ id, title, date, image, bezirk: flohBezirk }, i) => (
              <article
                key={id}
                className={`overflow-hidden h-[250px] min-w-[180px] ${
                  i === filteredList.length - 1 ? "" : "mr-4"
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
          )}
        </ScrollableContainer>
      </div>
    </section>
  );
}
