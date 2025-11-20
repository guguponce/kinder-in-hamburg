import { getApprovedEventsAndFlohmaerkte } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkeScrollableEvents from "@components/BezirkeScrollableEvents";
import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import BezirkableList from "@components/BezirkableList";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import type { iFlohmarkt } from "@app/utils/types";
import GeneralContainer from "@components/GeneralContainer";
import PageTitle from "@app/components/PageTitle";
import { unstable_cache } from "next/cache";

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

const getEventsAndFlohmaerkte = unstable_cache(
  getApprovedEventsAndFlohmaerkte,
  ["flohmaerkte", "events"],
  {
    revalidate: 3000,
    tags: ["flohmaerkte", "events"],
  }
);

export default async function EventPage() {
  const { events, flohmaerkte } = (await getEventsAndFlohmaerkte()) || {};
  if (!events || !flohmaerkte)
    return <NotFound multiples={true} type="event" />;

  const { today, nextMonday, yesterdayEvening } = getTodayNexMonday();

  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > yesterdayEvening && date < nextMonday - 1000 * 60 * 60
  );
  const thisWeekEvents = events.filter(
    ({ date, endDate }) =>
      (endDate && endDate > today && date < yesterdayEvening) ||
      (date > yesterdayEvening && date < nextMonday - 1000 * 60 * 60)
  );

  const futureEvents = events
    .filter(({ date }) => date > nextMonday - 1000 * 60 * 60)
    .sort((a, b) => a.date - b.date);
  const eventsWithoutLatLon = events.filter(({ lat, lon }) => !lat || !lon);
  return (
    <main className="px-2 text-hh-900 w-full flex flex-col gap-2 items-center">
      <AdminServerComponent>
        {!!eventsWithoutLatLon.length &&
          eventsWithoutLatLon.map(({ id, title }) => (
            <div key={id} className="bg-hh-800 p-2 rounded-md text-hh-50">
              <Link href={`/update-flohmarkt/${id}`}>{title}</Link>
            </div>
          ))}
      </AdminServerComponent>
      <GeneralContainer classname="rounded bg-hh-100 bg-opacity-25 w-full p-4 flex flex-col items-center min-h-[50vh] gap-2 max-w-[1000px]">
        <PageTitle title="Veranstaltungen für Kinder" />
        {events.length === 0 && (
          <h3 className="text-base w-fit max-w-2xl mb-2 font-semibold italic">
            Leider haben wir gerade keine Infos zu bevorstehenden Events.
            Veranstaltungen sind hier nicht so häufig ein Thema, aber bei
            besonderen Sachen wie zum Beispiel Weihnachtsmärkten und
            Laternenumzügen halten wir euch gerne auf dem Laufenden.
          </h3>
        )}
        <BezirkeScrollableEvents
          title="Diese Woche"
          events={thisWeekEvents.filter(
            ({ type }) => type !== "weihnachtsmarkt"
          )}
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
          className="max-w-4xl"
        ></DynamicEventsMap>
      </GeneralContainer>

      {futureEvents.length > 0 && (
        <BezirkableList
          variant="transparent-light"
          title="Ab nächster Woche"
          list={futureEvents}
          type="events"
          cardType="text-priority"
        ></BezirkableList>
      )}
      {!!thisWeekFlohmaerkte.length && (
        <section className="w-fit max-w-full lg:min-w-[768px] bg-gradient-to-br from-hh-50 to-hh-200 bg-opacity-50 rounded">
          <BezirkableList
            withDate
            variant="transparent-light"
            title={
              events.length > 0
                ? "Zusätzlich zu den Veranstaltungen finden in dieser Woche die folgenden Flohmärkte statt:"
                : "Diese Woche finden die folgenden Flohmärkte statt:"
            }
            list={thisWeekFlohmaerkte}
            type="flohmaerkte"
          ></BezirkableList>
        </section>
      )}
    </main>
  );
}
