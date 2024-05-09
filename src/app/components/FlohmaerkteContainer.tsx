import ScrollableFlohmaerkte from "@app/components/ScrollableFlohmaerkte";
import React from "react";
import BezirkableFlohmaerkteList from "../(flohmaerkte)/flohmaerkte/BezirkableFlohmaerkteList";
import { getTodayNexMonday } from "@app/utils/functions";
import { getApprovedFlohmaerkte } from "@app/api/dbActions";
import FlohmarktPoster from "./FlohmarktPoster";
import ScrollableContainer from "./ScrollableContainer";

export const revalidate = 0;
export default async function FlohmaerkteContainer() {
  const flohmaerkte = await getApprovedFlohmaerkte();
  if (!flohmaerkte) return <div>Keine Flohmärkte gefunden</div>;
  const { today, nextMonday } = getTodayNexMonday();
  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > today && date < nextMonday
  );
  const futureFlohmaerkte = flohmaerkte
    .filter(({ date }) => date > nextMonday)
    .sort((a, b) => a.date - b.date);
  const todayFlohmaerkte = thisWeekFlohmaerkte.filter(
    ({ date }) => date < today + 1000 * 60 * 60 * 24
  );
  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-4 flex flex-col items-center min-h-[50vh]">
      <h1 className="text-4xl font-bold my-2 p-2 rounded">Flohmärkte</h1>

      <div className="flex flex-col items-center gap-4 lg:gap-8 max-w-full">
        {!!todayFlohmaerkte.length && (
          <div className="relative flex justify-center flex-col rounded-md h-full w-fit bg-hh-200">
            <h2 className="text-2xl font-semibold text-hh-800 text-center pt-4">
              Heute
            </h2>

            <ScrollableContainer>
              {todayFlohmaerkte.map((floh) => (
                <article
                  key={floh.id}
                  className="relative flex flex-col items-center overflow-hidden h-[275px] min-w-[180px] gap-1"
                >
                  <h3 className="text-hh-600 text-center h-[20px] w-full font-semibold text-sm truncate-1">
                    {floh.stadtteil}
                  </h3>
                  <div className="overflow-hidden h-[250px] min-w-[180px] bg-white">
                    <FlohmarktPoster
                      key={floh.id}
                      title={floh.title}
                      bezirk={floh.bezirk}
                      date={floh.date}
                      image={floh.image}
                      id={floh.id}
                    />
                  </div>
                </article>
              ))}
            </ScrollableContainer>
          </div>
        )}
        <ScrollableFlohmaerkte
          title="Diese Woche"
          flohmaerkte={thisWeekFlohmaerkte}
        ></ScrollableFlohmaerkte>
        <BezirkableFlohmaerkteList
          title="Ab nächster Woche"
          flohList={futureFlohmaerkte}
        ></BezirkableFlohmaerkteList>
      </div>
    </main>
  );
}
