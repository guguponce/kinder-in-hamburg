import { getDate } from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import dynamic from "next/dynamic";
import React from "react";

const DynamicShuffleMapBox = dynamic(() => import("./ShuffleMapBox"), {
  ssr: false,
});
function orderEvents(events: iFlohmarkt[]): iFlohmarkt[] {
  const schiffEvents = [1732400443361, 1732318110756, 1732235057521];
  const today = getDate(new Date().getTime());

  // Separate events into categories
  const { todayEvents, futureEvents } = events.reduce(
    (acc, event) => {
      if (getDate(event.date) === today) {
        acc.todayEvents.push(event);
      } else {
        acc.futureEvents.push(event);
      }
      return acc;
    },
    { todayEvents: [] as iFlohmarkt[], futureEvents: [] as iFlohmarkt[] }
  );
  const futureOrdered = futureEvents.sort((a, b) =>
    schiffEvents.includes(a.id)
      ? -1
      : schiffEvents.includes(b.id)
        ? 1
        : a.date - b.date
  );

  // Return ordered list: todayEvents -> schiffEvents -> futureEvents
  return [...todayEvents, ...futureOrdered];
}
export default function WeihMapContainer({
  adventsEvents,
  weihnachtsmaerkte,
  shuffleContainerClassname,
}: {
  adventsEvents: iFlohmarkt[];
  shuffleContainerClassname?: string;
  weihnachtsmaerkte: iFlohmarkt[];
}) {
  if (adventsEvents.length === 0) return null;
  const orderedAdventsEvents = orderEvents(adventsEvents);
  return (
    <DynamicShuffleMapBox
      adventsEvents={orderedAdventsEvents}
      weihnachtsmaerkte={weihnachtsmaerkte}
      shuffleContainerClassname={shuffleContainerClassname}
    />
  );
}
