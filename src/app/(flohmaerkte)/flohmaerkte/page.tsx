import { getApprovedFlohmaerkte } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import ScrollableFlohmaerkte from "@app/components/ScrollableFlohmaerkte";
import { getNextWeekend } from "@app/utils/functions";
import FlohmarktPoster from "@components/@PostForm/FlohmarktPoster";
import Link from "next/link";
import React from "react";

export default async function FlohmarktPage() {
  const flohmaerkte = await getApprovedFlohmaerkte();
  if (!flohmaerkte) return <PostNotFound multiples={true} type="flohmarkt" />;
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
  const { nextSaturday, nextMonday } = getNextWeekend();
  const nextWeekendFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > nextSaturday && date < nextMonday
  );
  const futureFlohmaerkte = flohmaerkte.filter(({ date }) => date > nextMonday);
  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-4 flex flex-col items-center min-h-[50vh] gap-2">
      <h1 className="text-4xl font-bold my-2 p-2 rounded bg-opacity-50 bg-hh-50">
        Flea Markets
      </h1>
      <ScrollableFlohmaerkte
        flohmaerkte={nextWeekendFlohmaerkte}
        title="Next Weekend's"
      ></ScrollableFlohmaerkte>
      <ScrollableFlohmaerkte
        flohmaerkte={futureFlohmaerkte}
        title="Future Flea Markets"
      ></ScrollableFlohmaerkte>

      <ScrollableFlohmaerkte
        flohmaerkte={[...flohmaerkte].sort((a, b) => a.date - b.date)}
        title="All"
      ></ScrollableFlohmaerkte>
    </main>
  );
}
