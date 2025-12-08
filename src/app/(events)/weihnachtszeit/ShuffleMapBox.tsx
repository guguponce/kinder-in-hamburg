"use client";
import { iFlohmarkt } from "@app/utils/types";
import React, { useMemo } from "react";
import Link from "next/link";
import ShuffleGallery from "@components/@Cards/ShuffleGallery";
import { cn, getDate } from "@app/utils/functions";
import DynamicWeihMap from "./DynamicWeihMap";
import AdventsEventsShuffler from "@app/components/AdventsEventsShuffler";

export default function AdventsShuffleMapBox({
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
    () => adventsEvents?.[selectedID]?.id,
    [selectedID, adventsEvents]
  );

  if ([...adventsEvents, ...weihnachtsmaerkte].length === 0) return null;

  return (
    <section className="w-full max-w-[1200px] max-h-[120vh] flex flex-wrap gap-2 md:gap-4 items-center justify-center">
      {adventsEvents.length > 0 && (
        <AdventsEventsShuffler
          events={adventsEvents}
          shuffleContainerClassname={shuffleContainerClassname}
          idSetter={setSelectedID}
        />
      )}
      <article
        className="p-2 md:p-4 max-w-full xs:min-w-[375px] h-fit flex-grow sm:max-w-[800px] rounded-lg self-stretch"
        style={{
          background: "linear-gradient(45deg, #4e7247 0%, #628d5a   100%)",
        }}
      >
        <DynamicWeihMap
          events={adventsEvents}
          weihnachtsmaerkte={weihnachtsmaerkte}
          selectedEventID={selectedEventID}
        />
      </article>
    </section>
  );
}
