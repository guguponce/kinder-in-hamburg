import BezirkeScrollableEvents from "@app/components/BezirkeScrollableEvents";
import React from "react";
import BezirkableFlohmaerkteList from "@app/components/BezirkableEventsList";
import { getTodayNexMonday } from "@app/utils/functions";
import { getApprovedEvents } from "@app/api/dbActions";
import dynamic from "next/dynamic";
import TodaysFlohmaerkte from "./TodaysFlohmaerkte";
import ErrorFetchingData from "./@NotFound/ErrorFetchingData";

const DynamicEventsMap = dynamic(
  () => import("../components/@Map/DynamicEventsMap"),
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
export default async function FlohmaerkteContainer() {
  const flohmaerkte = await getApprovedEvents();
  if (!flohmaerkte) return <ErrorFetchingData type="Flohmärkte" />;
  const { today, nextMonday } = getTodayNexMonday();
  const yesterdayNight = today - 1000 * 60 * 60;
  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > yesterdayNight && date < nextMonday
  );
  const futureFlohmaerkte = flohmaerkte
    .filter(({ date }) => date > nextMonday)
    .sort((a, b) => a.date - b.date);
  const timezoneOffset = -120 * 60 * 1000;
  const utcMidnight = new Date(new Date().getTime());
  utcMidnight.setHours(24, 0, 0, 0);
  const nextMidnight = utcMidnight.getTime() + timezoneOffset;
  const todayFlohmaerkte = thisWeekFlohmaerkte.filter(
    ({ date }) => date < nextMidnight
  );
  const isSunday = new Date().getDay() === 0;
  return (
    <div className="rounded bg-hh-100 bg-opacity-25 w-[calc(100%-2rem)] p-1 sm:p-4 flex flex-col items-center min-h-[50vh]">
      <h1 className="lg:hidden text-4xl font-bold p-2 lg:pb-4 rounded text-orange-200">
        Flohmärkte
      </h1>

      <div className="flex flex-col items-center gap-4 lg:gap-8 max-w-full">
        <section
          id="current-week-section"
          className={`flex ${
            isSunday ? "flex-wrap-reverse" : "flex-wrap"
          } gap-4 w-full justify-center`}
        >
          <div
            id="heute-map-container"
            className="w-full lg:max-w-[400px] flex flex-col gap-4 items-center rounded bg-hh-200 bg-opacity-50 p-2 shadow-md"
          >
            {!!todayFlohmaerkte.length && !isSunday && (
              <TodaysFlohmaerkte todayFlohmaerkte={todayFlohmaerkte} />
            )}
            <DynamicEventsMap
              thisWeek={thisWeekFlohmaerkte.filter(
                (floh) => floh.lat && floh.lon
              )}
              today={getTodayNexMonday().today}
            />
          </div>
          <div className="flex flex-grow w-full sm:min-w-[400px] justify-center sm:w-1/4">
            <BezirkeScrollableEvents
              title={`${isSunday ? "Heute" : "Diese Woche"} gibt es ${
                thisWeekFlohmaerkte.length
              } ${
                thisWeekFlohmaerkte.length === 1 ? "Flohmarkt" : "Flohmärkte"
              }`}
              events={thisWeekFlohmaerkte}
            />
          </div>
        </section>
        <BezirkableFlohmaerkteList
          title="Ab nächster Woche"
          eventsList={futureFlohmaerkte}
        ></BezirkableFlohmaerkteList>
      </div>
    </div>
  );
}
