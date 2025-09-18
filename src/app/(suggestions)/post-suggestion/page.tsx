import React from "react";
import AdminRoute from "@app/providers/AdminRoute";

import { getAllApprovedPosts, getAllSuggestedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import IndoorOutdoorTabsList from "@components/IndoorOutdoorTabsList";
import PinnedPosts from "@components/PinnedPosts";
import BookmarkIcon from "@components/@Icons/BookmarkIcon";
import dynamic from "next/dynamic";
import Link from "next/link";
import URLFilteredListSuspense from "@components/Filters/URLFilteredListSuspense";
import type { Metadata } from "next";
import ApproveWronglyApprovedPost from "./ApproveWronglyApprovedPost";

const cachedPosts = unstable_cache(
  getAllSuggestedPosts,
  ["allSuggestedPosts"],
  {
    revalidate: 300,
    tags: ["posts"],
  }
);

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Posts Suggestions",
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
      "orte kinder hamburg",
      "places kids hamburg",
    ],
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/posts/",
      title: "Posts Suggestions",
      description:
        "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      title: "Posts Suggestions",
      description:
        "Hier findet ihr Orte für Kinder, Jugendliche oder die ganze Familie aus verschiedenen Orten in Hamburg zusammengestellt.",
      images: process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/posts/",
      card: "summary_large_image",
    },
  };
}

const URLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredList"),
  { ssr: false, loading: () => <URLFilteredListSuspense /> }
);
export default async function PostsPage() {
  const postsList = ((await cachedPosts()) || []).filter(
    ({ status }) => status !== "rejected"
  );
  const approvedPosts = (await getAllApprovedPosts()) || [];
  const categorizedPosts = postsList.reduce(
    (acc, post) => {
      if (post.status === "pending") {
        acc.pending.push(post);
      } else if (post.status === "rejected") {
        acc.rejected.push(post);
      } else if (
        post.status === "approved" &&
        approvedPosts.some((p) => p.id === post.id && p.status === "approved")
      ) {
        acc.correctlyApproved.push(post);
      } else {
        acc.falselyApproved.push(post);
      }
      return acc;
    },
    {
      falselyApproved: [],
      correctlyApproved: [],
      pending: [],
      rejected: [],
    } as {
      falselyApproved: typeof postsList;
      correctlyApproved: typeof postsList;
      pending: typeof postsList;
      rejected: typeof postsList;
    }
  );
  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px] px-1 sm:px-2">
        <div className="w-full bg-slate-100 rounded flex flex-col justify-between items-center mb-4">
          <h1 className="font-bold text-center text-3xl">
            Posts with Approved status in Suggestions, but pending in Approved
          </h1>
          {Object.entries(categorizedPosts).map(([key, posts]) => (
            <div key={key} className="w-full flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold capitalize">{key}</h2>
              <div className="flex flex-wrap bg-slate-300 gap-1">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col items-center bg-slate-400 gap-1"
                  >
                    <h3 key={post.id} className="text-lg">
                      {post.title}
                    </h3>
                    {key === "falselyApproved" && (
                      <ApproveWronglyApprovedPost post={post} />
                    )}
                    <Link href={"/posts/" + post.id}>
                      <span className="text-sm text-blue-600 hover:underline">
                        View Post
                      </span>
                    </Link>
                    <Link href={"/post-suggestion/" + post.id}>
                      <span className="text-sm text-green-600 hover:underline">
                        View Post Suggestion
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {postsList
            .filter(({ lat, lon }) => !lat || !lon)
            .map((post) => (
              <React.Fragment key={post.title}>
                <Link href={"/post-suggestion/" + post.id}>{post.title}</Link>
              </React.Fragment>
            ))}
        </div>
        <section className="w-full flex justify-center lg:justify-between items-stretch flex-wrap sm:flex-nowrap gap-4 mb-4">
          <article className="min-w-64 w-64 max-w-full p-4 bg-gradient-to-bl from-hh-700 to-hh-900 shadow-lg rounded relative overflow-hidden text-hh-50 italic">
            <h2 className="px-2 text-2xl font-bold">Highlights</h2>
            <div className="absolute flex self-start w-12 min-w-12 h-full border-0 m-0 top-0 right-2">
              <BookmarkIcon className="w-full h-10 sm:h-12" color="#fbb0a6" />
            </div>
            <PinnedPosts
              scroll={false}
              className="w-full aspect-[3/4] p-0 bg-transparent"
            />
          </article>{" "}
          <IndoorOutdoorTabsList
            posts={postsList}
            className="flex-grow min-w-[50%]"
          />
        </section>
        <URLFilteredList postsList={postsList}>
          <h1 className="font-bold min-w-fit text-center   text-3xl ">
            All posts suggestions
          </h1>
        </URLFilteredList>
      </main>
    </AdminRoute>
  );
}
