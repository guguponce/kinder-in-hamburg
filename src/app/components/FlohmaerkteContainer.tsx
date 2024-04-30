import ScrollableFlohmaerkte from "@app/components/ScrollableFlohmaerkte";
import React from "react";
import BezirkableFlohmaerkteList from "../(flohmaerkte)/flohmaerkte/BezirkableFlohmaerkteList";
import { getTodayNexMonday } from "@app/utils/functions";
import { getApprovedFlohmaerkte } from "@app/api/dbActions";

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
  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-4 flex flex-col items-center min-h-[50vh]">
      <h1 className="text-4xl font-bold my-2 p-2 rounded bg-opacity-50 bg-hh-50">
        Flohmärkte
      </h1>
      <div className="flex flex-col items-center gap-4 lg:gap-8 max-w-full">
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
