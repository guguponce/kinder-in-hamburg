import {
  getEventsFromSameLocation,
  getFutureApprovedEventsFromType,
} from "@app/api/dbActions";
import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";
import { cn } from "@app/utils/functions";
import React from "react";

export default async function EventsSameLocation({
  location,
  className,
  title,
  eventID,
}: {
  location?: string;
  className?: string;
  title?: string;
  eventID: string;
}) {
  if (!location) return null;
  const eventsSameLocation = (
    (await getEventsFromSameLocation(location)) || []
  ).filter(({ id }) => id !== parseInt(eventID));
  if (!eventsSameLocation.length) return null;
  return (
    <section className={cn("w-full flex flex-col items-center", className)}>
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      <ScrollableCardList
        posts={eventsSameLocation}
        cardType="img-priority"
        size="small"
        linkPrefix="/events/"
        withDate
      />
    </section>
  );
}
