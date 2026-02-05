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
  return {
    title: "Flohmärkte",
    icons: "/favicon.ico",
    description:
      "Hier findet ihr Aktivitäten und Flohmärkte für die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
    keywords: [
      "hamburg mit kinder",
      "hamburg familie flohmarkt",
      "hamburg kinder flohmarkt",
      "hamburg flohmaerkte",
      "hamburg flohmarkt",
      "hamburg kinder flohmaerkte",
      "kinder in hamburg",
      "kinder hamburg",
      "flohmaerkte",
      "flohmärkte",
      "flohmarkt",
      "kinder",
      "familie",
      "flohmaerkte hamburg",
      "flohmaerkte kinder",
      "flohmaerkte familie",
      "flohmaerkte hamburg kinder",
      "flohmaerkte hamburg familie",
      "flohmarkt hamburg",
      "flohmarkt kinder",
      "flohmarkt familie",
      "flohmarkt hamburg kinder",
      "flohmarkt hamburg familie",
      "flea market hamburg",
    ],
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/flohmaerkte/",
      title: "Flohmärkte",
      description:
        "Hier findet ihr Flohmärkte für die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title: "Flohmärkte",
      description:
        "Hier findet ihr Flohmärkte für die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/flohmaerkte/",
      card: "summary_large_image",
    },
  };
}
export default async function FlohmarktPage() {
  const flohmaerkte = await getApprovedEvents();
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

  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > today - 1000 * 60 * 60 && date < nextMonday,
  );
  const futureFlohmaerkte = flohmaerkte
    .filter(({ date }) => date > nextMonday)
    .sort((a, b) => a.date - b.date);
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
      <section className="rounded bg-gradient-to-b w-full lg:w-fit max-w-[1400px] p-2 flex flex-col items-center gap-2">
        <BezirkeScrollableEvents
          title="Diese Woche"
          events={thisWeekFlohmaerkte}
          type="flohmaerkte"
        ></BezirkeScrollableEvents>
        <section className="flex flex-col h-fit max-w-full xl:max-w-[1200px] p-2 bg-gradient-to-b from-hh-100 to-hh-200 shadow-md md:shadow-xl my-2 rounded">
          <div className="w-full flex flex-wrap gap-2 justify-end items-center pb-1">
            {!!futureFlohmaerkte.length && (
              <div className="font-semibold flex gap-1 text-hh-800">
                <StandortIcon color="#7B3E5E" />
                Diese Woche
              </div>
            )}
            {!!futureFlohmaerkte.length && (
              <div className="font-semibold flex gap-1 text-hh-800">
                <StandortIcon color="#343b3e" />
                Zukünftige Flohmärkte
              </div>
            )}
          </div>
          <div className="w-full max-w-[800px]">
            <DynamicFlohmarktMap
              future={futureFlohmaerkte}
              thisWeek={thisWeekFlohmaerkte}
              today={today}
              square={false}
            />
          </div>
        </section>
      </section>
      <section className="rounded w-full max-w-[1400px] p-2 md:p-4 flex flex-col items-center gap-2">
        <BezirkableList
          title="Ab nächster Woche"
          list={futureFlohmaerkte}
          cardClassname="relative flex flex-col items-center gap-[2px] overflow-hidden h-[250px] min-w-[180px] shadow-lg mr-4"
          withDate
          type="flohmaerkte"
        ></BezirkableList>
        <OtherEventsHorizontalCards variant="transparent-light" />
      </section>
    </main>
  );
}
