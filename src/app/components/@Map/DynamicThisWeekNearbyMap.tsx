"use client";
import { iFlohmarkt, iPost, iSpielplatz } from "@app/utils/types";
import dynamic from "next/dynamic";
import MarkersLists from "./PopUpsMarkers/MarkersLists";
import { useRef, useState } from "react";

const GeneralMap = dynamic(() => import("./GeneralMap"), {
  ssr: false,
  loading: () => (
    <article className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh]">
      <img
        src="/assets/bezirke/hamburg.webp"
        alt="Hamburg"
        className="w-full h-full object-cover"
      />
    </article>
  ),
});

export default function DynamicThisWeekNearbyMap({
  currentTarget,
  todayDisplay,
  nextMondayDisplay,
  spielplaetzeOneKM,
  weitereFlohmaerkte,
  greenBG = true,
}: {
  greenBG?: boolean;
  currentTarget: iFlohmarkt | iSpielplatz | iPost;
  todayDisplay: string;
  nextMondayDisplay: string;
  spielplaetzeOneKM: iSpielplatz[];
  weitereFlohmaerkte: iFlohmarkt[];
}) {
  const { current } = useRef(currentTarget);
  const { current: spielplaetzeNearby } = useRef(spielplaetzeOneKM);
  const { current: flohmaerkte } = useRef(weitereFlohmaerkte);
  const [showSpielplaetze, setShowSpielplaetze] = useState(true);
  const [showFlohmaerkte, setShowFlohmaerkte] = useState(true);

  return (
    <section
      className={`${
        greenBG
          ? "from-[#06190980] to-[#0c3f0c80]"
          : `from-[#91a3b6ec] to-[#33404Dec]`
      } flex flex-col items-center w-full max-w-[600px] md:max-w-[800px] bg-opacity-5 bg-gradient-to-b p-4 rounded gap-4`}
    >
      <aside className="flex flex-col items-center w-full max-w-[800px] gap-4 px-4">
        <button className="flex">
          <span className="font-semibold bg-currentLocation text-white px-2 py-1 rounded">
            {currentTarget.title} - am{" "}
            {new Date((currentTarget as iFlohmarkt).date)
              .toLocaleDateString("de-DE")
              .split(".")
              .slice(0, 2)
              .join(".")}
          </span>
        </button>
        <div className="flex flex-wrap justify-center w-fit gap-4">
          {flohmaerkte.length > 0 && (
            <button
              className="flex"
              onClick={() => setShowFlohmaerkte((prev) => !prev)}
            >
              <span
                className={`${
                  showFlohmaerkte ? "opacity-100" : "opacity-50"
                } font-semibold bg-stadtteilLocation text-white px-2 py-1 rounded`}
              >
                Flohmärkte dieser Woche ({todayDisplay} - {nextMondayDisplay})
              </span>
            </button>
          )}
          {!!spielplaetzeNearby.length && (
            <button
              className="flex"
              onClick={() => setShowSpielplaetze((prev) => !prev)}
            >
              <span
                className={`${
                  showSpielplaetze ? "opacity-100" : "opacity-50"
                } font-semibold bg-positive-800 text-white px-2 py-1 rounded`}
              >
                Spielplätze in der Nähe
              </span>
            </button>
          )}
        </div>
      </aside>
      <article className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh]">
        <GeneralMap currentTarget={current} zoom={15}>
          <MarkersLists
            currentLocation={{ lat: current.lat, lon: current.lon }}
            showSpielplaetze={showSpielplaetze}
            showFlohmaerkte={showFlohmaerkte}
            lists={{
              flohmaerkte: flohmaerkte,
              spielplaetze: spielplaetzeNearby,
            }}
          />
        </GeneralMap>
      </article>
    </section>
  );
}
