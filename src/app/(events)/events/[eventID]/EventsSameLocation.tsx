import {
  getEventsFromSameLocation,
  getFutureApprovedEventsFromType,
} from "@app/api/dbActions";
import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";
import TextPriorityCard from "@app/components/@Cards/TextPriorityCard";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { cn, parseDescriptionWithTags } from "@app/utils/functions";
import { iEventType, iFlohmarkt } from "@app/utils/types";
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
  const eventsSameLocation = (await getEventsFromSameLocation(location)) || [];
  if (!eventsSameLocation.length) return null;
  const separatedEvents = eventsSameLocation
    .filter(({ id }) => id !== parseInt(eventID))
    .reduce(
      (acc, curr) => {
        if (curr.type === "weihnachtsmarkt") acc[0].push(curr);
        else acc[1].push(curr);
        return acc;
      },
      [[], []] as [iFlohmarkt[], iFlohmarkt[]]
    )
    .flat();
  if (!separatedEvents.length) return null;
  return (
    <section className={cn("w-full flex flex-col items-center", className)}>
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      <ScrollableContainer boxStyle="items-end lg:gap-2">
        {separatedEvents.map((ev) => (
          <article
            key={ev.type || ev.id}
            className={`${ev.type === "weihnachtsmarkt" ? "bg-positive-950 p-1 min-w-[180px]" : "min-w-[150px] mb-1"} flex flex-col items-center bg-opacity-10 w-fit rounded-md shadow-md hover:shadow-lg`}
          >
            {ev.type === "weihnachtsmarkt" && (
              <h3 className="text-lg font-semibold capitalize">
                Weihnachtsmarkt
              </h3>
            )}
            <TextPriorityCard
              id={ev.id}
              title={ev.title}
              description={parseDescriptionWithTags(ev.optionalComment)}
              image={ev.image || "/assets/icons/weihnachtsmarkt.svg"}
              link={"/events/"}
              size="small"
              imgClassname={!ev.image ? "object-contain" : "object-cover"}
            />
          </article>
        ))}
      </ScrollableContainer>
    </section>
  );
}
