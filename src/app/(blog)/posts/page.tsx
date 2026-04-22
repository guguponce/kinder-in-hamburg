import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import URLFilteredListSuspense from "@components/Filters/URLFilteredListSuspense";
import PageTitle from "@components/PageTitle";
import type { Metadata } from "next";
import ErrorComponent from "@app/components/ErrorComponent";
import { createMetadata, postsMetadata } from "@app/utils/metadata";

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
    keywords: postsMetadata,
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
