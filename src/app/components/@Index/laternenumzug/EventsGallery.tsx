import {
  getAllEventsThisWeek,
  getFutureApprovedEventsFromType,
} from "@app/api/dbActions";
import React from "react";
import ClientEventsGallery from "./ClientEventsGallery";
import { iEventType, iFlohmarkt } from "@app/utils/types";
import { getTodayNexMonday } from "@app/utils/functions";
import { unstable_cache } from "next/cache";

const getBannerEvents = async (eventType: iEventType[]) => {
  const eventsThisWeek = (await getAllEventsThisWeek(eventType)) || [];
  if (eventsThisWeek.length > 3) return eventsThisWeek;
  return (await getFutureApprovedEventsFromType(eventType)) || [];
};

const cachedEvents = unstable_cache(
  getBannerEvents,
  ["events", "flohmaerkte"],
  {
    revalidate: 300,
    tags: ["events", "flohmaerkte"],
  }
);
export default async function EventsGallery({
  eventType,
}: {
  eventType: iEventType;
}) {
  const eventTypes: iEventType[] =
    eventType === "adventsevent"
      ? ["adventsevent", "weihnachtsmarkt"]
      : eventType === "laterne"
        ? ["laternewerkstatt", "laterne"]
        : [eventType];
  const eventsList = (await cachedEvents(eventTypes)) || [];
  const { yesterdayEvening } = getTodayNexMonday();
  const sortedList = [...eventsList]
    .reduce(
      (acc, event) => {
        if (event.date >= yesterdayEvening) {
          acc[0].push(event);
          return acc;
        }
        acc[1].push(event);
        return acc;
      },
      [[], []] as [iFlohmarkt[], iFlohmarkt[]]
    )
    .flat();

  if (sortedList.length === 0) return null;

  return <ClientEventsGallery eventsList={sortedList} />;
}
