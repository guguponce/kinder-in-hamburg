import { getAllEventsThisWeek } from "@app/api/dbActions";
import HorizontalCard from "@components/@Cards/HorizontalCard";
import ScrollableContainer from "@components/ScrollableContainer";
import {
  addressWithoutCity,
  getDate,
  replaceEventTypes,
} from "@app/utils/functions";
import { iEventType } from "@app/utils/types";
import React from "react";
import Link from "next/link";

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
  if (Object.keys(eventsByDate).length === 0) return null;
  return (
    <section
      className={`otherEventsHorizontalCards w-fit max-w-full rounded sm:p-2 my-2 flex flex-col ${style}`}
    >
      <div className="p-2">
        <Link href="/events" className="text-xl font-semibold">
          Andere Veranstaltungen dieser Woche
        </Link>
        <p
          className={`text-sm ${
            variant.includes("dark") ? "text-hh-100" : "text-hh-700"
          }`}
        >
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
              className={`transition-all flex flex-col rounded p-2 pt-0 min-w-fit bg-gradient-to-bl ${variant.includes("light") ? "from-hh-600 to-hh-700 text-hh-100" : "from-hh-200-75 to-hh-100-75 text-hh-800"}`}
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
                      bezirk,
                    }) => (
                      <article
                        key={id}
                        className="w-[240px] sm:w-[280px] lg:w-[360px]"
                      >
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
                            address={address}
                            bezirk={bezirk}
                            stadtteil={stadtteil}
                            date={date}
                            time={time}
                          />
                        </HorizontalCard>
                      </article>
                    )
                  )}
              </div>
            </article>
          ))}
      </ScrollableContainer>
    </section>
  );
}
