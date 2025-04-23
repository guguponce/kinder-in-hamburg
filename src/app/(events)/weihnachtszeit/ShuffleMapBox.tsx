"use client";
import { iFlohmarkt } from "@app/utils/types";
import React, { useMemo } from "react";
import Link from "next/link";
import ShuffleGallery from "@components/@Cards/ShuffleGallery";
import { cn } from "@app/utils/functions";
import DynamicWeihMap from "./DynamicWeihMap";

export default function ShuffleMapBox({
  adventsEvents,
  weihnachtsmaerkte,
  shuffleContainerClassname,
}: {
  adventsEvents: iFlohmarkt[];
  shuffleContainerClassname?: string;
  weihnachtsmaerkte: iFlohmarkt[];
}) {
  const [selectedID, setSelectedID] = React.useState<number>(0);
  const selectedEventID = useMemo(
    () => adventsEvents[selectedID].id,
    [selectedID, adventsEvents]
  );

  if (adventsEvents.length === 0) return null;
  return (
    <section className="w-full max-w-[1200px] max-h-[120vh] flex flex-wrap gap-2 md:gap-4 items-center justify-center">
      <article
        id="nikolaus"
        className="p-2 md:p-4 w-fit min-w-[280px] max-w-[300px] rounded-lg mx-auto self-stretch flex flex-col items-center gap-1 text-positive-100"
        style={{
          background: "linear-gradient(45deg, #405b3a 0%, #4e7247 100%)",
        }}
      >
        <Link href="weihnachtszeit#nikolaus" className="text-xl font-semibold">
          Veranstaltungen
        </Link>
        <p className="text-xs italic max-w-[170px] pb-1">
          Fast jeden Tag gibt es Advents-Events in verschiedenen Stadtteilen.
        </p>
        <div
          className={cn(
            "max-w-full aspect-[2/3] object-contain",
            shuffleContainerClassname
          )}
        >
          <ShuffleGallery
            idSetter={setSelectedID}
            list={adventsEvents}
            size="small"
            titleUnder
            transparent
            posterClassname="max-w-[180px] min-w-[180px] aspect-[2/3] my-auto h-auto"
          />
        </div>
      </article>
      <article
        className="p-2 md:p-4 max-w-full xs:min-w-[375px] h-fit flex-grow sm:max-w-[800px] rounded-lg self-stretch"
        style={{
          background: "linear-gradient(45deg, #4e7247 0%, #628d5a   100%)",
        }}
      >
        <DynamicWeihMap
          future={adventsEvents}
          currentEvents={weihnachtsmaerkte}
          selectedEventID={selectedEventID}
        />
      </article>
    </section>
  );
}
