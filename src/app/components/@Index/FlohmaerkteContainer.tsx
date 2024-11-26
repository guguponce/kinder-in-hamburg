import BezirkeScrollableEvents from "@app/components/BezirkeScrollableEvents";
import React from "react";
import BezirkableEventsList from "@app/components/BezirkableEventsList";
import { getTodayNexMonday } from "@app/utils/functions";
import { getApprovedEvents } from "@app/api/dbActions";
import dynamic from "next/dynamic";
import TodaysFlohmaerkte from "../TodaysFlohmaerkte";
import ErrorFetchingData from "../@NotFound/ErrorFetchingData";
import PaperPlane from "../@Icons/PaperPlane";

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
  const utcMidnight = new Date();
  utcMidnight.setHours(24, 0, 0, 0);
  const nextMidnight = utcMidnight.getTime() + timezoneOffset;
  const todayFlohmaerkte = thisWeekFlohmaerkte.filter(
    ({ date }) => date < nextMidnight
  );
  const isSunday = new Date().getDay() === 0;
  const onlyToday = todayFlohmaerkte.length === thisWeekFlohmaerkte.length;
  return (
    <div className="rounded bg-hh-100 bg-opacity-25 w-[calc(100%-2rem)] p-1 sm:p-4 flex flex-col items-center min-h-[50vh]">
      <h1 className="lg:hidden text-4xl font-bold p-2 lg:pb-4 rounded text-orange-200">
        Flohmärkte
      </h1>

      <div className="flex flex-col items-center gap-4 lg:gap-8 max-w-full">
        {!!thisWeekFlohmaerkte.length ? (
          <section
            id="current-week-section"
            className={`flex ${
              isSunday ? "flex-wrap-reverse" : "flex-wrap"
            } gap-4 w-full justify-center`}
          >
            <div
              id="heute-map-container"
              className={`flex ${onlyToday ? "flex-row lg:w-full justify-center lg:items-stretch flex-wrap md:flex-nowrap" : "lg:max-w-[400px] w-full flex-col"} gap-4 items-center rounded bg-hh-200 bg-opacity-50 p-2 shadow-md`}
            >
              {!!todayFlohmaerkte.length && !isSunday && (
                <TodaysFlohmaerkte todayFlohmaerkte={todayFlohmaerkte} />
              )}
              <DynamicEventsMap
                showTermine={!onlyToday}
                thisWeek={thisWeekFlohmaerkte.filter(
                  (floh) => floh.lat && floh.lon
                )}
                today={getTodayNexMonday().today}
              />
            </div>
            {!onlyToday && (
              <div className="flex flex-grow w-full sm:min-w-[400px] justify-center sm:w-1/4">
                <BezirkeScrollableEvents
                  title={`${isSunday ? "Heute" : "Diese Woche"} gibt es ${
                    thisWeekFlohmaerkte.length
                  } ${
                    thisWeekFlohmaerkte.length === 1
                      ? "Flohmarkt"
                      : "Flohmärkte"
                  }`}
                  events={thisWeekFlohmaerkte}
                />
              </div>
            )}
          </section>
        ) : (
          <section
            id="current-week-section"
            className={`flex gap-4 w-full justify-center`}
          >
            <div className="max-w-full flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-hh-800 text-center p-1 lg:p-2">
                Für den Rest der Woche finden keine Flohmärkte statt
              </h2>
              <p className="text-hh-700">
                Wenn ihr einen veranstaltet oder kennt, schreibt uns gerne eine
                E-Mail.
              </p>
              <a
                href="mailto:admin@kinder-in-hamburg.de"
                className="flex items-center gap-2 self-center p-4 bg-hh-800 text-hh-100 font-semibold rounded-lg mt-4 w-max hover:bg-hh-700 transition-colors duration-300 ease-in-out"
              >
                <PaperPlane />
                admin@kinder-in-hamburg.de
              </a>
            </div>
          </section>
        )}
        <BezirkableEventsList
          title={
            !!thisWeekFlohmaerkte.length
              ? "Ab nächster Woche"
              : "Zukünftige Flohmärkte"
          }
          eventsList={futureFlohmaerkte}
        ></BezirkableEventsList>
      </div>
    </div>
  );
}
