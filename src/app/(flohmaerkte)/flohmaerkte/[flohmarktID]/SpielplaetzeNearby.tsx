"use client";
import ImgPriorityCard from "@app/components/@Cards/ImgPriorityCard";
import ArrowGallery from "@app/components/ArrowGallery";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { haversineDistance } from "@app/utils/functions";
import { iSpielplatz } from "@app/utils/types";
import React, { useCallback, useMemo, useRef } from "react";

export default function SpielplaetzeNearby({
  lat,
  lon,
  spielplaetzeNearby,
}: {
  lat?: number;
  lon?: number;
  spielplaetzeNearby: iSpielplatz[];
}) {
  const spielplaetzeRef = useRef(spielplaetzeNearby);
  const spielplaetzeList = useMemo(() => {
    return spielplaetzeRef.current
      .map((spielplatz) => ({
        ...spielplatz,
        distance:
          lat &&
          lon &&
          haversineDistance(lat, lon, spielplatz.lat, spielplatz.lon) / 1000,
      }))
      .filter(({ distance }) => !!distance && distance < 2)
      .sort((a, b) => a.distance! - b.distance!);
  }, [lat, lon]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentSpielplatz = useMemo(
    () => spielplaetzeList[currentIndex],
    [currentIndex, spielplaetzeList]
  );
  const handleIndex = useCallback(
    (direction: "next" | "back") => {
      if (direction === "next") {
        setCurrentIndex((prev) =>
          prev === spielplaetzeList.length - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentIndex((prev) =>
          prev === 0 ? spielplaetzeList.length - 1 : prev - 1
        );
      }
    },
    [spielplaetzeList]
  );
  if (spielplaetzeList.length === 0) return null;

  return (
    <article className="w-full max-w-[400px] lg:max-w-[400px] sm:max-w-none lg:flex-grow h-fit rounded flex flex-col gap-2 items-center p-2 bg-gradient-to-b from-[#fefefe90] to-[#fefefe50] bg-opacity-50 text-hh-900 my-2">
      <div>
        <h2 className="text-center text-xl font-bold">
          Spielplätze in der Nähe
        </h2>
        <p className="text-center text-sm">
          Als Ergänzung zum Besuch könnt ihr einen dieser Spielplätze besuchen
        </p>
      </div>
      <div className="flex lg:hidden w-fit max-w-full">
        <ScrollableContainer>
          {spielplaetzeList.map((spielplatz) => (
            <div className="min-w-[180px]" key={spielplatz.id}>
              <ImgPriorityCard
                size="small"
                image={spielplatz.image ? spielplatz.image[0] : ""}
                title={spielplatz.title}
                link={`/spielplaetze/${spielplatz.id}`}
                id={spielplatz.id}
                bezirk={spielplatz.bezirk}
                stadtteil={spielplatz.stadtteil}
                spielgeraete={spielplatz.spielgeraete}
              />
            </div>
          ))}
        </ScrollableContainer>
      </div>

      <div className="lg:flex hidden">
        <ArrowGallery
          length={spielplaetzeList.length}
          handleIndex={handleIndex}
        >
          <div className="w-[180px] h-full flex flex-col">
            <ImgPriorityCard
              size="small"
              image={currentSpielplatz.image ? currentSpielplatz.image[0] : ""}
              title={currentSpielplatz.title}
              link={`/spielplaetze/${currentSpielplatz.id}`}
              id={currentSpielplatz.id}
              bezirk={currentSpielplatz.bezirk}
              stadtteil={currentSpielplatz.stadtteil}
              spielgeraete={currentSpielplatz.spielgeraete}
            />
            {currentSpielplatz.distance && (
              <p className="text-center text-xs p-1 font-semibold rounded-[0_0_4px_4px] bg-gradient-to-r from-hh-800 to-hh-700 w-32 text-white mx-auto font-sans">
                Entfernung: {currentSpielplatz.distance.toFixed(2)} km
              </p>
            )}
          </div>
        </ArrowGallery>
      </div>
    </article>
  );
}
