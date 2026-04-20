import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import URLFilteredListSuspense from "@components/Filters/URLFilteredListSuspense";
import PageTitle from "@components/PageTitle";
import type { Metadata } from "next";
import ErrorComponent from "@app/components/ErrorComponent";
import { createMetadata } from "@app/utils/functions";

export const revalidate = 20;

const URLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredList"),
  { ssr: false, loading: () => <URLFilteredListSuspense /> },
);

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    title: "Posts",
    description:
      "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
    pathname: "/posts/",
    image: process.env.BASE_URL + "opengraph-image.png",

    robots: true,
    keywords: [
      "Kinder Aktivitäten",
      "Familien Aktivitäten",
      "Ausflüge mit Kindern",
      "Freizeit mit Kindern",
      "Was tun mit Kindern",
      "Aktivitäten für Teenager",
      "Jugend Aktivitäten",
      "Indoor Aktivitäten Kinder",
      "Outdoor Aktivitäten Kinder",
      "kostenlose Aktivitäten Kinder",
      "Wochenend Ausflüge Familie",
      "Spielplätze",
      "Museen für Kinder",
      "Tiere erleben Kinder",
      "Sport Aktivitäten Kinder",
      "Kindergeburtstag Ideen",
      "Kinder Café",
      "Indoor Spielhaus",
      "Badeplätze mit Kindern",
      "Freizeit Ideen Familie Wochenende",
      "Badeplätze Hamburg",
      "Kinder Aktivitäten Hamburg",
      "Familien Aktivitäten Hamburg",
      "Ausflüge mit Kindern Hamburg",
      "Freizeit mit Kindern Hamburg",
      "Spielplätze Hamburg",
      "Museen für Kinder Hamburg",
      "Indoor Aktivitäten Hamburg",
      "Outdoor Aktivitäten Hamburg",
      "kostenlose Aktivitäten Hamburg",
      "Wochenend Ausflüge Hamburg",
      "Kindergeburtstag Hamburg",
      "Ausflugsziele Hamburg mit Kindern",
      "Dinge für Kinder in Hamburg",
      "was tun mit Kindern in Hamburg",
      "Freizeit Hamburg Kinder",
      "Freizeit Ideen Familie Wochenende",
      "kids activities hamburg",
      "things to do with kids hamburg",
      "family activities hamburg",
      "things to do in Hamburg with kids",
      "free things to do with kids hamburg",
      "playgrounds near me hamburg",
      "family weekend activities hamburg",
    ],
  });
}
const cachedPosts = unstable_cache(getAllApprovedPosts, ["posts"], {
  revalidate: 300,
});
export default async function PostsPage() {
  // -----------------------------------------------
  const postsList = (await cachedPosts()) || [];
  if (!postsList.length)
    return (
      <ErrorComponent text="Es gab ein Problem beim Abrufen der Beiträge." />
    );
  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px] p-1 sm:p-2">
        <PageTitle title="All posts" />
        <URLFilteredList postsList={postsList}></URLFilteredList>
      </main>
    </AdminRoute>
  );
}
