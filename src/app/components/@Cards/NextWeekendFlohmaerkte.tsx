import { getThisWeekEvents } from "@app/api/dbActions";
import React from "react";
import ScrollableContainer from "../ScrollableContainer";
import FlohPostersList from "../FlohPostersList";

export default async function ThisWeekFlohmaerkte() {
  const thisWeek = await getThisWeekEvents();
  if (!thisWeek || !thisWeek.length) return <></>;
  const sortedFlohmaerkte = thisWeek.sort((a, b) => a.date - b.date);
  return (
    <section className="nextWeekendFlohmarkt bg-hh-100 bg-opacity-10 p-2 w-full flex justify-center gap-2 items-center">
      <ScrollableContainer>
        <FlohPostersList flohList={sortedFlohmaerkte} />
      </ScrollableContainer>
    </section>
  );
}
