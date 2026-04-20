import React from "react";
import AllEventsStatusSetter from "../AllEventsStatusSetter";
import { unstable_cache } from "next/cache";
import { getApprovedEvents, getSuggestedEvents } from "@app/api/dbActions";
import { iFlohmarkt } from "@app/utils/types";
import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentMonth = new Date().getMonth(); // 0-indexed (January is 0)
const currentAndNextTwoMonths = [
  monthNames[currentMonth],
  monthNames[(currentMonth + 1) % 12],
  monthNames[(currentMonth + 2) % 12],
];

function filterEventsByMonth(events: iFlohmarkt[] | false) {
  if (!events) return [];
  const nextMonth = (currentMonth + 2) % 12;

  return events.filter((event) => {
    const eventDate = new Date(event.date);
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();
    const currentYear = new Date().getFullYear();
    return (
      eventYear < currentYear &&
      (eventMonth === currentMonth || eventMonth <= nextMonth)
    );
  });
}
export default async function AllFlohmaerkteStatusPage() {
  const flohmaerkte =
    (await unstable_cache(getSuggestedEvents, ["allFlohmaerkte"], {
      revalidate: 600,
      tags: ["flohmaerkte", "events"],
    })("flohmaerkte")) || [];
  const approvedFlohmaerkte =
    (await unstable_cache(getApprovedEvents, ["allFlohmaerkte"], {
      revalidate: 600,
      tags: ["flohmaerkte", "events"],
    })("flohmaerkte")) || [];
  const titlesAndLocationsCount = approvedFlohmaerkte.reduce(
    (acc, ev) => {
      if (ev.location) acc[ev.location] = (acc[ev.location] || 0) + 1;
      acc[ev.title] = (acc[ev.title] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const filteredFlohmaerkte = filterEventsByMonth(flohmaerkte);
  const flohmaerkteByYear = filteredFlohmaerkte.reduce(
    (acc, ev) => {
      const eventYear = new Date(ev.date).getFullYear();
      if (!acc[eventYear]) acc[eventYear] = [];
      acc[eventYear].push(ev);
      return acc;
    },
    {} as Record<number, iFlohmarkt[]>,
  );

  return (
    <main className="p-4 flex flex-col gap-4 w-full">
      <section className="flex flex-col gap-2 bg-hh-900 rounded p-4">
        <h2 className="text-2xl font-bold text-hh-50">
          Flohmärkte at this time of the year
        </h2>
        {/* <div className="flex flex-col gap-2 max-w-full p-2">
          {currentAndNextTwoMonths.map((monthName, i) => {
            const monthNumber = (currentMonth + i) % 12;
            const eventsInMonth = filteredFlohmaerkte.filter((event) => {
              if (
                !event.location ||
                !!(
                  titlesAndLocationsCount[event.location] ||
                  titlesAndLocationsCount[event.title]
                )
              )
                return false;
              const eventMonth = new Date(event.date).getMonth();
              return eventMonth === monthNumber;
            });
            return (
              <div key={monthName} className="bg-hh-800 rounded p-2">
                <h3 className="text-xl font-semibold text-hh-50">
                  {monthName}
                </h3>
                <ScrollableCardList
                  size="medium"
                  posts={eventsInMonth}
                  cardType="horizontal"
                  linkPrefix="/flohmaerkte/"
                  withDate
                />
              </div>
            );
          })}
        </div> */}
      </section>
      {/* <AllEventsStatusSetter
        eventsType="flohmaerkte"
        events={flohmaerkte || undefined}
      /> */}
    </main>
  );
}
