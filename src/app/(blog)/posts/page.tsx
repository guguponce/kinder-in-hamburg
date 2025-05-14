import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import URLFilteredListSuspense from "@components/Filters/URLFilteredListSuspense";
import PageTitle from "@components/PageTitle";
import { Metadata } from "next";

export const revalidate = 20;

const URLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredList"),
  { ssr: false, loading: () => <URLFilteredListSuspense /> }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Posts",
    icons: "/favicon.ico",
    description:
      "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
    keywords: [
      "hamburg mit kinder",
      "hamburg familie post",
      "hamburg kinder post",
      "hamburg posts",
      "hamburg post",
      "hamburg kinder posts",
      "kinder in hamburg",
      "kinder hamburg",
      "posts",
      "posts",
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
      title: "Posts",
      description:
        "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title: "Posts",
      description:
        "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/posts/",
      card: "summary_large_image",
    },
  };
}
const cachedPosts = unstable_cache(getAllApprovedPosts, ["posts"], {
  revalidate: 300,
});
export default async function PostsPage() {
  // -----------------------------------------------
  const postsList = await cachedPosts();
  if (!postsList) return <div>There was a problem retrieving posts</div>;
  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px] p-1 sm:p-2">
        <PageTitle title="All posts" />
        <URLFilteredList postsList={postsList}></URLFilteredList>
      </main>
    </AdminRoute>
  );
}
