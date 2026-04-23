import BezirkeScrollableEvents from "@components/BezirkeScrollableEvents";
import React from "react";
import { cn, getTodayNexMonday } from "@app/utils/functions";
import { getThisWeekEvents } from "@app/api/dbActions";
import dynamic from "next/dynamic";
import ErrorFetchingData from "../@NotFound/ErrorFetchingData";
import { iFlohmarkt } from "@app/utils/types";
import Link from "next/link";
import PageTitle from "../PageTitle";
import { unstable_cache } from "next/cache";
import NoFlohmarktBanner from "./NoFlohmarktBanner";

function sortByFlohmaerkteDate(list: iFlohmarkt[], todayEvening: number) {
  return list
    .sort((a, b) => a.date - b.date)
    .reduce(
      (acc, floh) => {
        if (floh.date < todayEvening) {
          acc.todayFlohmaerkte.push(floh);
          acc.thisWeekFlohmaerkte.push(floh);
        } else {
          acc.thisWeekFlohmaerkte.push(floh);
          acc.futureFlohmaerkte.push(floh);
        }
        return acc;
      },
      {
        todayFlohmaerkte: [],
        thisWeekFlohmaerkte: [],
        futureFlohmaerkte: [],
      } as {
        thisWeekFlohmaerkte: iFlohmarkt[];
        todayFlohmaerkte: iFlohmarkt[];
        futureFlohmaerkte: iFlohmarkt[];
      },
    );
}
const DynamicEventsMap = dynamic(() => import("../@Map/DynamicEventsMap"), {
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
});
const getFlohmaerkte = unstable_cache(getThisWeekEvents, [], {
  revalidate: 300,
  tags: ["flohmaerkte", "events"],
});
export default async function FlohmaerkteContainer() {
  const flohmaerkte = await getFlohmaerkte();
  if (!flohmaerkte) return <ErrorFetchingData type="Flohmärkte" />;
  const { todaysMonth, yesterdayEvening } = getTodayNexMonday();
  const { futureFlohmaerkte, todayFlohmaerkte } = sortByFlohmaerkteDate(
    flohmaerkte,
    yesterdayEvening + 24 * 60 * 60 * 1000,
  );
  const todayFlohmaerkteLength = todayFlohmaerkte.length;
  const futureFlohmaerkteLength = futureFlohmaerkte.length;
  const weekday = new Date().getDay();
  const isSunday = weekday === 0;
  const onlyToday = todayFlohmaerkteLength === futureFlohmaerkteLength;

  return (
    <section
      className={cn(
        "rounded-lg bg-gradient-to-b from-hh-200-50 via-hh-200-50 to-hh-50 bg-opacity-25 w-full p-1 sm:p-4 flex flex-col items-center text-hh-50 shadow-2xl",
        futureFlohmaerkteLength > 4
          ? "min-h-[50vh] max-w-[1200px]"
          : "max-w-[800px]",
      )}
    >
      <PageTitle title="Flohmärkte" className="pageTitle" link="/flohmaerkte" />
      {(todaysMonth < 2 || todaysMonth > 9) && (
        <h2 className="w-fit mx-auto text-base italic mb-4 p-2 bg-hh-800 bg-opacity-75 md:p-4 rounded border-2 font-semibold text-hh-50 border-hh-700 max-w-[480px] text-center">
          {todaysMonth < 2
            ? "Die Hochsaison der Flohmärkte hat noch nicht begonnen, aber im Frühjahr geht es endlich los."
            : todaysMonth > 9
              ? "Die Flohmarktsaison neigt sich dem Ende zu. Aber in den kalten Monaten gibt es noch welche."
              : ""}
        </h2>
      )}
      {!!futureFlohmaerkteLength && (
        <h2 className="text-lg sm:text-2xl font-bold text-hh-800 pb-2 sm:pb-4 px-3 text-nowrap max-w-full">
          {!isSunday && todayFlohmaerkteLength && futureFlohmaerkteLength
            ? `Diese Woche gibt es außerdem ${futureFlohmaerkteLength} ${futureFlohmaerkteLength > 1 ? "weitere Veranstaltungen" : "Veranstaltung"}`
            : isSunday && todayFlohmaerkteLength
              ? `Heute gibt es ${todayFlohmaerkteLength} ${todayFlohmaerkteLength > 1 ? "Veranstaltungen" : "Veranstaltung"} in dieser Woche`
              : `Diese Woche gibt es ${futureFlohmaerkteLength} ${futureFlohmaerkteLength > 1 ? "Veranstaltungen" : "Veranstaltung"}`}
        </h2>
      )}
      <div className="flex flex-col items-center gap-4 max-w-full">
        {!!flohmaerkte.length ? (
          <section
            id="current-week-section"
            className={`flex flex-col gap-4 w-full justify-center items-center`}
          >
            <div
              id="heute-map-container"
              className={`flex max-w-[1000px] ${onlyToday ? "flex-row w-full justify-center flex-wrap md:flex-nowrap" : "w-full flex-col"} gap-4 items-center rounded bg-hh-200 bg-opacity-50 p-2 shadow-md`}
            >
              <DynamicEventsMap
                showTermine={!onlyToday}
                thisWeek={[...todayFlohmaerkte, ...futureFlohmaerkte].filter(
                  (floh) => floh.lat && floh.lon,
                )}
                today={getTodayNexMonday().today}
              />
            </div>

            <div className="flex flex-grow w-full justify-center">
              <BezirkeScrollableEvents
                todaysFlohmaerkte={
                  !!todayFlohmaerkteLength && !isSunday
                    ? todayFlohmaerkte
                    : undefined
                }
                events={!onlyToday || isSunday ? futureFlohmaerkte : []}
                titleShadow
                className="text-hh-50"
                type="flohmaerkte"
              />
            </div>
          </section>
        ) : (
          <NoFlohmarktBanner weekday={weekday} isSunday={isSunday} />
        )}

        <Link
          href="/flohmaerkte"
          className="text-hh-800 underline-offset-2 underline hover:text-hh-700 hover:underline-offset-4 transition-all self-end mx-2 py-1 px-2 rounded hover:backdrop-brightness-95"
        >
          Alle Flohmärkte entdecken
        </Link>
      </div>
    </section>
  );
}
