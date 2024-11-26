import { getApprovedEvents } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkeScrollableEvents from "@components/BezirkeScrollableEvents";
import { getTodayNexMonday } from "@app/utils/functions";
import Link from "next/link";
import React from "react";
import BezirkableEventsList from "@app/components/BezirkableEventsList";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import MainIntroductionText from "@app/components/@PostForm/MainIntroductionText";
import StandortIcon from "@app/components/@Icons/StandortIcon";
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
  }
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
  const { today, nextMonday } = getTodayNexMonday();

  const thisWeekFlohmaerkte = flohmaerkte.filter(
    ({ date }) => date > today - 1000 * 60 * 60 && date < nextMonday
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
        text="Die Flohmärkte in Hamburg bieten eine schöne, familienfreundliche Erfahrung, bei der Eltern gebrauchte Schätze für ihre Kinder finden können. Von Spielzeug und Kleidung bis hin zu Büchern und Mobilitätsartikeln wie Fahrrädern oder Kinderwagen – diese Märkte ermöglichen es, günstige und umweltfreundliche Optionen für die ganze Familie zu entdecken. Wir glauben, dass sie den Kindern die Chance bieten, den Wert von Wiederverwendung und Recycling auf eine praktische Weise zu lernen."
        extraInfo="Leider ist die Flohmarktsaison vorbei. Sie wird im Frühling 2025 wieder beginnen."
      />
      <section className="rounded bg-hh-100 bg-opacity-25 w-full max-w-[1000px] p-2 md:p-4 flex flex-col items-center gap-2">
        <BezirkeScrollableEvents
          title="Diese Woche"
          events={thisWeekFlohmaerkte}
          type="flohmaerkte"
        ></BezirkeScrollableEvents>
        <section className="flex flex-col h-fit max-w-[1200px] p-2 bg-gradient-to-b from-hh-100 to-50 shadow-md md:shadow-xl my-4 md:my-8 rounded">
          <div className="w-full pb-2 flex flex-wrap gap-2 justify-end items-center">
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
          <DynamicFlohmarktMap
            future={futureFlohmaerkte}
            thisWeek={thisWeekFlohmaerkte}
            today={today}
            square={false}
          />
        </section>
        <BezirkableEventsList
          title="Ab nächster Woche"
          eventsList={futureFlohmaerkte}
        ></BezirkableEventsList>
        <OtherEventsHorizontalCards variant="dark" />
      </section>
    </main>
  );
}
