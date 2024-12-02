import { getApprovedEventsAndFlohmaerkte } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkeScrollableEvents from "@app/components/BezirkeScrollableEvents";
import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import BezirkableEventsList from "@components/BezirkableEventsList";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { iFlohmarkt } from "@app/utils/types";

const DynamicEventsMap = dynamic(
  () => import("../../components/@Map/DynamicEventsMap"),
  {
    ssr: false,
    loading: () => (
      <article className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh]">
        <img
          src="/assets/bezirke/hamburg.webp"
          alt="Hamburg"
          className="w-full h-full object-cover"
        />
      </article>
    ),
  }
);
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Veranstaltungen für Kinder",
  description: "Veranstaltungen für Kinder in Hamburg",
  keywords: [
    "kinder events hamburg",
    "kinder events",
    "kinder veranstaltungen hamburg",
    "kinder veranstaltungen",
    "kinder veranstaltung",
    "kinder veranstaltung hamburg",
    "Veranstaltungen für Kinder, Hamburg",
    "Kinderveranstaltung, Hamburg",
    "Hamburg Kinderveranstaltung",
    "Hamburg Veranstaltungen für Kinder",
    "Hamburg Kinderveranstaltung",
    "Hamburg Kinderveranstaltungen",
    "Veranstaltungen für Kinder",
    "Veranstaltungen für Kinder",
    "Veranstaltungen für Kinder Hamburg",
    "Veranstaltungen für Kinder Hamburg",
    "Events für Kinder, Hamburg",
    "Event, Hamburg",
    "Hamburg Event",
    "Hamburg Events für Kinder",
    "Hamburg Kinder Event",
    "Hamburg Kinder Events",
    "Events für Kinder",
    "Events für Kinder",
    "Events für Kinder Hamburg",
    "Events für Kinder Hamburg",
  ],
};

export default async function EventPage() {
  const { events, flohmaerkte } =
    (await getApprovedEventsAndFlohmaerkte()) || {};
  if (!events || !flohmaerkte)
    return <NotFound multiples={true} type="event" />;

  const { today, nextMonday } = getTodayNexMonday();
  const lastMidnight = new Date(today).setHours(0, 0, 0, 0);

  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > lastMidnight && date < nextMonday - 1000 * 60 * 60
  );
  const thisWeekEvents = events.filter(
    ({ date, endDate }) =>
      (endDate && endDate > today && date < lastMidnight) ||
      (date > lastMidnight && date < nextMonday)
  );

  const futureEvents = events
    .filter(({ date }) => date > nextMonday)
    .sort((a, b) => a.date - b.date);
  const eventsWithoutLatLon = events.filter(({ lat, lon }) => !lat || !lon);

  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-4 flex flex-col items-center min-h-[50vh] gap-2">
      <AdminServerComponent>
        {!!eventsWithoutLatLon.length &&
          eventsWithoutLatLon.map(({ id, title }) => (
            <div key={id} className="bg-hh-800 p-2 rounded-md text-hh-50">
              <Link href={`/update-flohmarkt/${id}`}>{title}</Link>
            </div>
          ))}
      </AdminServerComponent>
      <h1 className="text-4xl font-bold my-2 p-2 rounded bg-opacity-50 bg-hh-50">
        Veranstaltungen für Kinder
      </h1>
      <BezirkeScrollableEvents
        title="Diese Woche"
        events={thisWeekEvents.filter(({ type }) => type !== "weihnachtsmarkt")}
        type="events"
      ></BezirkeScrollableEvents>
      <DynamicEventsMap
        future={futureEvents}
        thisWeek={[
          ...thisWeekEvents,
          ...(thisWeekFlohmaerkte.map((floh) => ({
            ...floh,
            type: "flohmarkt",
          })) as iFlohmarkt[]),
        ]}
        showBezirke={false}
        today={today}
      ></DynamicEventsMap>
      <BezirkableEventsList
        variant="transparent-light"
        title="Ab nächster Woche"
        eventsList={futureEvents}
        type="events"
      ></BezirkableEventsList>
      {!!thisWeekFlohmaerkte.length && (
        <section className="w-full flex flex-col gap-2 my-4">
          <h3 className="text-xl font-semibold w-fit">
            Zusätzlich zu den Veranstaltungen finden in dieser Woche die
            folgenden Flohmärkte statt
          </h3>
          <BezirkableEventsList
            variant="dark"
            title=""
            eventsList={thisWeekFlohmaerkte}
            type="flohmaerkte"
          ></BezirkableEventsList>
        </section>
      )}
    </main>
  );
}
