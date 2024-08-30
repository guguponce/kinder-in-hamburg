import { getApprovedFlohmaerkte } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import BezirkeScrollableFlohmaerkte from "@app/components/BezirkeScrollableFlohmaerkte";
import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import BezirkableFlohmaerkteList from "./BezirkableFlohmaerkteList";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const DynamicFlohmarktMap = dynamic(() => import("./DynamicFlohmarktMap"), {
  ssr: false,
});
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
  const { today, nextMonday } = getTodayNexMonday();

  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > today && date < nextMonday
  );
  const futureFlohmaerkte = flohmaerkte
    .filter(({ date }) => date > nextMonday)
    .sort((a, b) => a.date - b.date);

  return (
    <main className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-4 flex flex-col items-center min-h-[50vh] gap-2">
      <h1 className="text-4xl font-bold my-2 p-2 rounded bg-opacity-50 bg-hh-50">
        Flohmärkte
      </h1>
      <BezirkeScrollableFlohmaerkte
        title="Diese Woche"
        flohmaerkte={thisWeekFlohmaerkte}
      ></BezirkeScrollableFlohmaerkte>
      <DynamicFlohmarktMap
        nextMonday={nextMonday}
        future={futureFlohmaerkte}
        thisWeek={thisWeekFlohmaerkte}
        today={today}
      />

      <BezirkableFlohmaerkteList
        title="Ab nächster Woche"
        flohList={futureFlohmaerkte}
      ></BezirkableFlohmaerkteList>
    </main>
  );
}
