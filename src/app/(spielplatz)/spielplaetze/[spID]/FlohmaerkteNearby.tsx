import { getThisWeekEvents } from "@app/api/dbActions";
import React from "react";
import ArrowGalleryContainer from "../ArrowGalleryContainer";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import FlohmarktPoster from "@components/@Cards/FlohmarktPoster";
import ScrollableContainer from "@components/ScrollableContainer";
import { haversineDistance } from "@app/utils/functions";
import style from "./spielplatzSyle.module.scss";

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
  const flohmaerkte = await getThisWeekEvents("flohmaerkte", true);
  if (!flohmaerkte) return null;
  const list = flohmaerkte
    .filter(
      ({ bezirk: flohBezirk, stadtteil: flohStadtteil }) =>
        bezirk === flohBezirk ||
        PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil]?.includes(
          flohStadtteil,
        ),
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
        className={
          style.flohmaerkteNearby +
          "relative h-80 w-fit max-w-full mx-auto flex lg:hidden px-8 lg:px-16"
        }
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
      <div className="hidden lg:flex min-w-[50%] max-w-full h-[250px] mx-auto text-center justify-center bg-hh-700 bg-opacity-100 p-2 mt-automb-2 rounded shadow-lg">
        <h2
          className="min-w-fit text-xl overflow-hidden max-w-full rotate-180  flex flex-col font-bold  text-hh-50"
          style={{ writingMode: "vertical-rl", textOrientation: "revert" }}
        >
          Flohmärkte in der Nähe
        </h2>
        <div className="w-fit flex flex-col items-center">
          {/* <span className="text-sm block font-bold  text-hh-50">
            Innerhalb 2 km von diesem Spielplatz:
          </span> */}
          <ScrollableContainer boxStyle="gap-1 lg:gap-2" color="800">
            {list.map(
              (
                { id, title, date, image, bezirk: flohBezirk, stadtteil },
                i,
              ) => (
                <article
                  key={id + Math.random()}
                  className="relative flex flex-col items-center min-w-[144px] pt-1 hover:outline outline-2 outline-hh-50-25 rounded hover:shadow"
                >
                  <div className="w-fit aspect-[3/4] overflow-hidden mb-1 shadow group-hover:shadow-none">
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
                  <h3 className="text-white text-center h-[20px] w-full font-semibold text-xs truncate-1">
                    <span>
                      {new Date(date).toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "numeric",
                      })}
                    </span>
                    <span>
                      {" - "}
                      {stadtteil}
                    </span>{" "}
                  </h3>
                </article>
              ),
            )}
          </ScrollableContainer>
        </div>
      </div>
    </>
  );
}
