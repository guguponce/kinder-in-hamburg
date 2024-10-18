import { getThisWeekEvents } from "@app/api/dbActions";
import React from "react";
import ArrowGalleryContainer from "./ArrowGalleryContainer";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { haversineDistance } from "@app/utils/functions";

export default async function FlohmaerkteNearby({
  bezirk,
  stadtteil,
  lat,
  lon,
}: {
  title?: string;
  bezirk: string;
  stadtteil: string;
  lat: number;
  lon: number;
}) {
  const flohmaerkte = await getThisWeekEvents();
  if (!flohmaerkte) return null;
  const list = flohmaerkte
    .filter(
      ({ bezirk: flohBezirk, stadtteil: flohStadtteil }) =>
        bezirk === flohBezirk ||
        PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil]?.includes(
          flohStadtteil
        )
    )
    .filter(({ lat: flohLat, lon: flohLon }) => {
      if (!flohLat || !flohLon) return false;
      return haversineDistance(lat, lon, flohLat, flohLon) < 2000;
    });
  if (list.length === 0) return null;
  return (
    <>
      <div
        id="spielplatz-flohmaerkte-nearby"
        className="relative h-80 lg:max-h-96 min-w-fit max-w-full flex lg:hidden px-8 lg:px-16"
      >
        <h2
          className="absolute z-50 bottom-0 left-4 lg:left-8 -translate-x-1/2 text-xl sm:text-2xl overflow-hidden w-3rem font-bold rotate-180 text-hh-800"
          style={{ writingMode: "vertical-rl", textOrientation: "revert" }}
        >
          Flohmärkte in der Nähe
        </h2>
        <div className="w-full max-h-full">
          <ArrowGalleryContainer list={list} />
        </div>
      </div>
      <div className="hidden lg:flex w-full justify-center bg-hh-800 bg-opacity-75 p-2 mt-auto mb-2">
        <h2
          className="text-xl overflow-hidden max-w-full mr-2 rotate-180  flex flex-col font-bold  text-hh-50"
          style={{ writingMode: "vertical-rl", textOrientation: "revert" }}
        >
          Flohmärkte dieser Woche
        </h2>
        <div className="w-fit flex flex-col items-center">
          <span className="text-sm block font-bold  text-hh-50">
            Innerhalb 2 km von diesem Spielplatz:
          </span>
          <ScrollableContainer>
            {list.map(
              (
                { id, title, date, image, bezirk: flohBezirk, stadtteil },
                i
              ) => (
                <article
                  key={id + Math.random()}
                  className="relative flex flex-col items-center overflow-hidden h-[225px] min-w-[180px] gap-1"
                >
                  <div className="overflow-hidden h-[200px] min-w-[144px]">
                    <FlohmarktPoster
                      bezirk={flohBezirk}
                      id={id}
                      index={i}
                      title={title}
                      date={date}
                      image={image}
                      prefixLink={`/flohmaerkte/`}
                      size="small"
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
      </div>
    </>
  );
}
