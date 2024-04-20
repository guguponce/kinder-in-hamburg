import { getNextWeekendFlohmaerkte } from "@app/api/dbActions";
import React from "react";
import FlohPostersList from "../FlohPostersList";
import ScrollableContainer from "../ScrollableContainer";

export default async function NextWeekendFlohmaerkte() {
  const nextWeek = await getNextWeekendFlohmaerkte();
  if (!nextWeek) return null;
  return (
    <section className="nextWeekendFlohmarkt bg-hh-100 bg-opacity-10 p-2 w-full flex justify-center gap-2 items-center">
      <ScrollableContainer>
        <FlohPostersList flohList={nextWeek} prefixLink="" />
      </ScrollableContainer>
    </section>
  );
}
