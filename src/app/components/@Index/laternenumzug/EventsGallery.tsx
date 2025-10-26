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
  const eventsThisWeek = await getAllEventsThisWeek(eventType);
  if (eventsThisWeek && eventsThisWeek.length > 0) return eventsThisWeek;
  const nextEvents = (await getFutureApprovedEventsFromType(eventType)) || [];
};

const cachedEvents = unstable_cache(getBannerEvents, ["events"]);
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
  const today = getTodayNexMonday().today - 1000 * 60 * 60 * 1;
  const sortedList = [...eventsList]
    .reduce(
      (acc, event) => {
        if (event.date >= today && event.type !== "weihnachtsmarkt") {
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
