import { getApprovedEvents } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkeScrollableEvents from "@components/BezirkeScrollableEvents";
import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import BezirkableEventsList from "@app/components/BezirkableEventsList";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import AdminServerComponent from "@app/providers/AdminServerComponents";

const DynamicFlohmarktMap = dynamic(
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
  title: "Flohmärkte",
  description: "Flohmärkte in Hamburg",
  keywords: [
    "Flohmärkte, Hamburg",
    "Flohmarkt, Hamburg",
    "Hamburg Flohmarkt",
    "Hamburg Flohmärkte",
    "Hamburg Markt",
    "Hamburg Märkte",
    "Kinderflohmarkt",
    "Kinderflohmärkte",
    "Kinderflohmarkt Hamburg",
    "Kinderflohmärkte Hamburg",
  ],
};

export default async function FlohmarktPage() {
  const flohmaerkte = await getApprovedEvents();
  if (!flohmaerkte) return <NotFound multiples={true} type="flohmarkt" />;
  if (flohmaerkte.length === 0)
    return (
      <main className="flex flex-col items-center justify-center p-6 rounded-md bg-hh-100 w-[500px] max-w-full m-2 gap-4">
        <h2 className="text-lg font-bold text-hh-950">
          There are no flea markets available
        </h2>
        <Link
          className="p-2 rounded-md bg-hh-800 hover:bg-hh-700 active:bg-hh-600 text-white"
          href={"/"}
        >
          Home
        </Link>
      </main>
    );
  const { today, nextMonday } = getTodayNexMonday();

  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > today && date < nextMonday
  );
  const futureFlohmaerkte = flohmaerkte
    .filter(({ date }) => date > nextMonday)
    .sort((a, b) => a.date - b.date);
  const flohsWithoutLatLon = flohmaerkte.filter(({ lat, lon }) => !lat || !lon);
  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-4 flex flex-col items-center min-h-[50vh] gap-2">
      <AdminServerComponent>
        {!!flohsWithoutLatLon.length &&
          flohsWithoutLatLon.map(({ id, title }) => (
            <div key={id} className="bg-hh-800 p-2 rounded-md text-hh-50">
              <Link href={`/update-flohmarkt/${id}`}>{title}</Link>
            </div>
          ))}
      </AdminServerComponent>
      <h1 className="text-4xl font-bold my-2 p-2 rounded bg-opacity-50 bg-hh-50">
        Flohmärkte
      </h1>
      <BezirkeScrollableEvents
        title="Diese Woche"
        events={thisWeekFlohmaerkte}
        type="flohmaerkte"
      ></BezirkeScrollableEvents>
      <section className="flex flex-col h-fit max-w-[1200px] p-2 bg-gradient-to-b from-hh-100 to-50 shadow-md md:shadow-xl my-4 md:my-8 rounded">
        <DynamicFlohmarktMap
          future={futureFlohmaerkte}
          thisWeek={thisWeekFlohmaerkte}
          today={today}
          square={false}
        />
      </section>
      <BezirkableEventsList
        title="Ab nächster Woche"
        eventsList={futureFlohmaerkte}
      ></BezirkableEventsList>
    </main>
  );
}
