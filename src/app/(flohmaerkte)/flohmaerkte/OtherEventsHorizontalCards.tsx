import { getAllEventsFromType, getAllEventsThisWeek } from "@app/api/dbActions";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import ScrollableContainer from "@app/components/ScrollableContainer";
import {
  addressWithoutCity,
  getDate,
  replaceEventTypes,
} from "@app/utils/functions";
import { iEventType } from "@app/utils/types";
import React from "react";

export default async function OtherEventsHorizontalCards({
  children,
  variant = "light",
  eventTypes,
}: {
  eventTypes?: iEventType[];
  children?: React.ReactNode;
  variant?: "light" | "dark" | "transparent-light" | "transparent-dark";
}) {
  const style =
    variant === "light"
      ? "bg-white bg-opacity-75 text-hh-700"
      : variant === "dark"
        ? "bg-hh-800 text-white"
        : variant === "transparent-light"
          ? "bg-transparent text-hh-700"
          : variant === "transparent-dark"
            ? "bg-transparent text-white"
            : "bg-white bg-opacity-75 text-hh-700";
  const events = await getAllEventsThisWeek(eventTypes);
  if (!events) return null;
  const eventsByDate = events.reduce(
    (acc, event) => {
      const date = event.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, typeof events>
  );
  const types =
    eventTypes ||
    events.reduce((acc, event) => {
      if (event.type && !acc.includes(event.type)) acc.push(event.type);
      return acc;
    }, [] as iEventType[]);
  const typesString = replaceEventTypes(types).join(", ");
  return (
    <section
      className={`otherEventsHorizontalCards w-full rounded sm:p-2 my-2 flex flex-col ${style}`}
    >
      <div className="p-2">
        <h2 className="text-xl font-semibold text-hh-50">
          Andere Veranstaltungen dieser Woche
        </h2>
        <p className="text-hh-100 text-sm">
          In den nächsten Tagen finden auch andere Events ({typesString}) statt
        </p>
      </div>
      {children}
      <ScrollableContainer>
        {Object.entries(eventsByDate)
          .filter(([date]) => parseInt(date) > Date.now())
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([date, events]) => (
            <article
              key={date}
              className="bg-hh-300 bg-opacity-25 transition-all flex flex-col rounded p-2 pt-0 min-w-fit"
            >
              <h3 className="font-semibold p-2">{getDate(parseInt(date))}</h3>
              <div className="min-w-fit flex gap-4 items-center">
                {[...events]
                  .sort((a, b) =>
                    a.type === "weihnachtsmarkt"
                      ? -1
                      : b.type === "weihnachtsmarkt"
                        ? 1
                        : 0
                  )
                  .map(
                    ({
                      id,
                      type,
                      title,
                      image,
                      address,
                      date,
                      time,
                      stadtteil,
                    }) => (
                      <div key={id} className="w-[360px] min-w-[300px]">
                        <HorizontalCard
                          key={id}
                          type={type}
                          title={title}
                          id={id}
                          link={`/events/${id}`}
                          image={image}
                        >
                          <HorizontalCard.FlohmarktInfo
                            title={title}
                            address={addressWithoutCity(address)}
                            stadtteil={stadtteil}
                            date={date}
                            time={time}
                          />
                        </HorizontalCard>
                      </div>
                    )
                  )}
              </div>
            </article>
          ))}
      </ScrollableContainer>
    </section>
  );
}
