import { getApprovedEventsAndFlohmaerkte } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkeScrollableEvents from "@app/components/BezirkeScrollableEvents";
import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import BezirkableFlohmaerkteList from "@components/BezirkeScrollableEvents";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import AdminServerComponent from "@app/providers/AdminServerComponents";

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
  console.log(events?.length, flohmaerkte?.length);
  if (!events || !flohmaerkte)
    return <NotFound multiples={true} type="event" />;

  const { today, nextMonday } = getTodayNexMonday();

  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > today && date < nextMonday
  );
  const thisWeekEvents = events.filter(
    ({ date }) => date > today && date < nextMonday
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
        events={thisWeekEvents}
      ></BezirkeScrollableEvents>
      <DynamicEventsMap future={[]} thisWeek={events} today={today} />
      <BezirkableFlohmaerkteList
        title="Ab nächster Woche"
        events={futureEvents}
        type="events"
      ></BezirkableFlohmaerkteList>
      <section className="w-full flex flex-col items-center gap-2">
        <h3 className="text-xl font-semibold w-fit px-8">
          Zusätzlich zu den Veranstaltungen finden in dieser Woche die folgenden
          Flohmärkte statt
        </h3>
        <BezirkableFlohmaerkteList
          title=""
          events={thisWeekFlohmaerkte}
          type="flohmaerkte"
        ></BezirkableFlohmaerkteList>
      </section>
    </main>
  );
}
