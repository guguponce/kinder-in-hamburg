import { getAllApprovedPosts } from "@app/api/dbActions";
import StackedCards from "@components/@Cards/StackedCards";
import AdminRoute from "@app/providers/AdminRoute";
import { categoryNames } from "@app/utils/constants";
import type { iPost } from "@app/utils/types";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Kategorien - Posts",
    icons: "/favicon.ico",
    description:
      "Entdecke Orte und Aktivitäten für Kinder, Jugendliche und Familien in Hamburg, sortiert nach Kategorien.",
    keywords: [
      "kategorien hamburg",
      "hamburg kategorien",
      "kinder kategorien hamburg",
      "familie kategorien hamburg",
      "posts kategorien",
      "posts hamburg kategorien",
      "kinder in hamburg",
      "kinder hamburg",
      "familie hamburg",
      "aktivitäten hamburg",
      "freizeit hamburg",
      "hamburg kinder posts",
      "hamburg familie posts",
      "hamburg posts",
      "hamburg kinder",
      "hamburg familie",
      "spielplatz hamburg",
      "museum hamburg",
      "veranstaltungen hamburg",
      "ausflüge hamburg",
      "sport hamburg",
      "natur hamburg",
      "kunst hamburg",
      "musik hamburg",
      "theater hamburg",
      "post",
      "posts",
      "kinder",
      "familie",
    ],
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/categories/",
      title: "Kategorien - Posts",
      description:
        "Entdecke Orte und Aktivitäten für Kinder, Jugendliche und Familien in Hamburg, sortiert nach Kategorien.",
      images: process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title: "Kategorien - Posts",
      description:
        "Entdecke Orte und Aktivitäten für Kinder, Jugendliche und Familien in Hamburg, sortiert nach Kategorien.",
      images: process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/categories/",
      card: "summary_large_image",
    },
  };
}
export default async function CategoriesPage() {
  const allPosts = await getAllApprovedPosts();
  if (!allPosts) return <NotFound type="categories" multiples={true} />;
  const categoriesPosts = [...allPosts]
    .sort(() => 0.5 - Math.random())
    .reduce(
      (acc, post) => {
        if (!post.image) return acc;
        post.categories.forEach((cat) => {
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(post);
        });
        return acc;
      },
      {} as { [key: string]: iPost[] }
    );

  return (
    <AdminRoute>
      <main className="rounded-xl w-[calc(100%-1rem)] max-w-[1000px] flex flex-col items-center gap-2 text-white">
        <h1 className="font-bold text-3xl lg:text-4xl text-white mb-4">
          Categories
        </h1>
        <section className="flex w-full flex-wrap gap-4 justify-around">
          {categoryNames.map((cat) =>
            categoriesPosts[cat] ? (
              <article
                key={cat}
                className="bg-hh-900 bg-opacity-10 hover:bg-opacity-20 p-4 rounded-md shadow-sm w-full sm:w-1/2 md:1/3 max-w-[350px] sm:max-w-[275px] md:max-w-[300px] flex flex-col items-stretch"
              >
                <h2 className="text-2xl font-bold flex-grow align-middle">
                  {cat}
                </h2>
                <div className="w-full flex justify-center items-center">
                  <StackedCards
                    link={`/categories/${encodeURIComponent(cat)}`}
                    posts={categoriesPosts[cat].slice(0, 3)}
                    horizontal={true}
                    onlyTitle={true}
                    size="medium"
                  ></StackedCards>
                </div>
              </article>
            ) : null
          )}
        </section>
      </main>
    </AdminRoute>
  );
}
