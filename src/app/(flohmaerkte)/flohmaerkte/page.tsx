import { getApprovedEvents } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkeScrollableEvents from "@components/BezirkeScrollableEvents";
import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import BezirkableList from "@components/BezirkableList";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import MainIntroductionText from "@app/components/@Templates/MainIntroductionText";
import StandortIcon from "@components/@Icons/StandortIcon";
import OtherEventsHorizontalCards from "./OtherEventsHorizontalCards";
import { createMetadata, flohmaerkteMetadata } from "@app/utils/metadata";
import { unstable_cache } from "next/cache";
import type { iFlohmarkt } from "@app/utils/types";

export const revalidate = 300;

const DynamicFlohmarktMap = dynamic(
  () => import("../../components/@Map/DynamicEventsMap"),
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
  },
);

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Flohmärkte in Hamburg",
    description:
      "Hier findet ihr Aktivitäten und Flohmärkte für die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
    pathname: "/flohmaerkte",
    image: process.env.BASE_URL + "opengraph-image.png",
    keywords: flohmaerkteMetadata,
    robots: true,
  });
}

function groupFlohmaerkte(
  flohmaerkte: iFlohmarkt[],
  today: number,
  nextMonday: number,
) {
  const oneHour = 1000 * 60 * 60;
  const nextNextMonday = nextMonday + 7 * 24 * 60 * 60 * 1000;
  const result = flohmaerkte.reduce(
    (acc, floh) => {
      const { date } = floh;

      if (date > today - oneHour && date < nextMonday) {
        acc.thisWeek.push(floh);
      } else if (date >= nextMonday && date < nextNextMonday) {
        acc.nextWeek.push(floh);
      } else if (date >= nextNextMonday) {
        acc.future.push(floh);
      }

      return acc;
    },
    {
      thisWeek: [] as iFlohmarkt[],
      nextWeek: [] as iFlohmarkt[],
      future: [] as iFlohmarkt[],
    },
  );

  // sort each bucket
  result.thisWeek.sort((a, b) => a.date - b.date);
  result.nextWeek.sort((a, b) => a.date - b.date);
  result.future.sort((a, b) => a.date - b.date);

  return result;
}

const getFlohmaerkte = unstable_cache(getApprovedEvents, ["flohmaerkte"], {
  revalidate: 300,
});

export default async function FlohmarktPage() {
  const flohmaerkte = await getFlohmaerkte();
  if (!flohmaerkte) return <NotFound multiples={true} type="flohmarkt" />;
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
  const { today, nextMonday, todaysMonth } = getTodayNexMonday();

  const { thisWeek, nextWeek, future } = groupFlohmaerkte(
    flohmaerkte,
    today,
    nextMonday,
  );
  const flohsWithoutLatLon = flohmaerkte.filter(({ lat, lon }) => !lat || !lon);
  return (
    <main className="max-w-full rounded p-1 md:p-2 flex flex-col items-center min-h-[50vh] gap-2">
      <AdminServerComponent>
        {!!flohsWithoutLatLon.length &&
          flohsWithoutLatLon.map(({ id, title }) => (
            <div key={id} className="bg-hh-800 p-2 rounded-md text-hh-50">
              <Link href={`/update-flohmarkt/${id}`}>{title}</Link>
            </div>
          ))}
      </AdminServerComponent>
      <MainIntroductionText
        title="Flohmärkte"
        variant="light"
        text="Von Spielzeug und Kleidung bis hin zu Büchern und Mobilitätsartikeln wie Fahrrädern oder Kinderwagen – diese Märkte ermöglichen es, günstige und umweltfreundliche Optionen für die ganze Familie zu entdecken. Sie bieten den Kindern die Chance, den Wert von Wiederverwendung und Recycling auf eine praktische Weise zu lernen."
      >
        {todaysMonth < 4 ||
          (todaysMonth === 11 && (
            <div className="flex justify-center items-center bg-gradient-to-br from-negative-700 to-negative-800 mt-2 p-2 rounded">
              <h2 className="w-fit text-negative-50 font-semibold text-center">
                {todaysMonth === 11
                  ? "Die Flohmarktsaison ist vorbei. Im Frühjahr geht es wieder los!"
                  : "Die Hochsaison der Flohmärkte hat noch nicht begonnen, aber im Frühjahr geht es endlich los."}
              </h2>
            </div>
          ))}
      </MainIntroductionText>
      <section className="rounded bg-gradient-to-b w-full lg:w-fit lg:max-w-full 2xl:max-w-[1400px] md:p-2 flex flex-col items-center gap-2">
        <BezirkeScrollableEvents
          title="Diese Woche"
          events={thisWeek}
          type="flohmaerkte"
        ></BezirkeScrollableEvents>
        <section className="flex flex-col h-fit max-w-full xl:max-w-[1200px] p-2 bg-gradient-to-b from-hh-100 to-hh-200 shadow-md md:shadow-xl my-2 rounded">
          <div className="w-full flex flex-wrap gap-2 justify-end items-center pb-1">
            {!!future.length && (
              <div className="font-semibold flex gap-1 text-hh-800">
                <StandortIcon color="#7B3E5E" />
                Diese Woche
              </div>
            )}
            {!!nextWeek.length && (
              <div className="font-semibold flex gap-1 text-hh-800">
                <StandortIcon color="#fbb25e" />
                Nächste Woche
              </div>
            )}
            {!!future.length && (
              <div className="font-semibold flex gap-1 text-hh-800">
                <StandortIcon color="#2a4150" />
                Zukünftige Flohmärkte
              </div>
            )}
          </div>
          <div className="w-full max-w-[800px]">
            <DynamicFlohmarktMap
              future={future}
              thisWeek={thisWeek}
              nextWeek={nextWeek}
              today={today}
              zoom={10}
              square={false}
            />
          </div>
        </section>
      </section>
      <section className="rounded w-full max-w-[1400px] p-2 md:p-4 flex flex-col items-center gap-2">
        <BezirkableList
          title="Ab nächster Woche"
          list={[...nextWeek, ...future]}
          cardClassname="relative flex flex-col items-center gap-[2px] overflow-hidden h-[250px] min-w-[180px] shadow-lg"
          withDate
          type="flohmaerkte"
        ></BezirkableList>
        <OtherEventsHorizontalCards variant="transparent-light" />
      </section>
    </main>
  );
}
