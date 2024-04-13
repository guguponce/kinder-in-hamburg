import { getNextWeekendFlohmaerkte } from "@app/api/dbActions";
import React from "react";
import FlohPostersList from "../FlohPostersList";

export default async function NextWeekendFlohmaerkte() {
  const nextWeek = await getNextWeekendFlohmaerkte();
  if (!nextWeek) return null;
  return (
    <section className="nextWeekendFlohmarkt w-full p-2 bg-hh-100 flex flex-wrap justify-center gap-2 items-center">
      <FlohPostersList flohList={nextWeek} prefixLink="" />
    </section>
  );
}
