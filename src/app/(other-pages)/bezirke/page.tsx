import React from "react";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { iPost } from "@app/utils/types";
import NotFound from "@components/@NotFound/NotFound";
import RandomRecommendation from "@components/@Cards/RandomRecommendation";
import Link from "next/link";
import AdminRoute from "@app/providers/AdminRoute";
import { separateInBezirke } from "@app/utils/functions";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Bezirke - Posts",
    icons: "/favicon.ico",
    description:
      "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus allen Bezirken in Hamburg zusammengestellt.",
    keywords: [
      "bezirke hamburg",
      "eimsbuettel",
      "altona",
      "hamburg altona",
      "hamburg eimsbuettel",
      "hamburg bezirke",
      "barmbek",
      "hamburg barmbek",
      "wandsbek",
      "hamburg wandsbek",
      "harburg",
      "hamburg harburg",
      "hamburg mitte",
      "mitte hamburg",
      "hamburg nord",
      "nord hamburg",
      "hamburg bergedorf",
      "bergedorf hamburg",
      "bergedorf",
      "hamburg mit kinder",
      "hamburg familie post",
      "hamburg kinder post",
      "hamburg posts",
      "hamburg post",
      "hamburg kinder posts",
      "kinder in hamburg",
      "kinder hamburg",
      "posts bezirke",
      "posts bezirk",
      "post",
      "kinder",
      "familie",
      "posts hamburg",
      "posts kinder",
      "posts familie",
      "posts hamburg kinder",
      "posts hamburg familie",
      "post hamburg",
      "post kinder",
      "post familie",
      "post hamburg kinder",
      "post hamburg familie",
      "playground hamburg",
      "playgrounds hamburg",
    ],
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/posts/",
      title: "Bezirke - Posts",
      description:
        "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus allen Bezirken in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title: "Bezirke - Posts",
      description:
        "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus allen Bezirken in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/posts/",
      card: "summary_large_image",
    },
  };
}
export default async function BezirkePage() {
  const allPosts = await getAllApprovedPosts();
  if (!allPosts) return <NotFound multiples={true} type="post" />;
  const bezirkePosts = separateInBezirke(allPosts);

  return (
    <AdminRoute>
      <main className="flex flex-col gap-2">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-3xl lg:text-4xl text-white">Bezirke</h1>
          <h2 className="font-bold text-hh-100 text-base">
            Where do you want to go?
          </h2>
        </div>
        <section className="flex flex-wrap gap-4 lg:gap-8 justify-center py-4">
          {Object.entries(bezirkePosts).map(([bezirk, bezirkPosts]) => (
            <article
              key={bezirk}
              className="relative flex flex-col items-center h-[375px] pb-16 w-[200px]"
            >
              <RandomRecommendation posts={bezirkPosts} size="medium">
                <Link
                  href={`/bezirke/${encodeURIComponent(bezirk)}`}
                  className="block bg-hh-700 bg-opacity-75 hover:bg-opacity-100 backdrop-blur-sm w-full mx-auto max-w-full text-lg font-bold text-white px-2 py-1 text-center -mt-1 p-2 rounded-[6px_6px_0_0]"
                >
                  {bezirk}
                </Link>
              </RandomRecommendation>
              <Link
                href={`/bezirke/${encodeURIComponent(bezirk)}`}
                className="absolute bottom-16 bg-hh-700 z-[100] translate-y-full px-4 py-1 max-w-[80%] w-fit text-sm text-center  rounded-[0_0_6px_6px] text-white font-semibold hover:bg-hh-800 transition-all duration-200 ease-in-out"
              >
                More in {bezirk}
              </Link>
            </article>
          ))}
        </section>
      </main>
    </AdminRoute>
  );
}
