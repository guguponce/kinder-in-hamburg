import React from "react";
import AdminRoute from "@app/providers/AdminRoute";

import { getAllSuggestedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import IndoorOutdoorTabsList from "@components/IndoorOutdoorTabsList";
import PinnedPosts from "@components/PinnedPosts";
import BookmarkIcon from "@components/@Icons/BookmarkIcon";
import dynamic from "next/dynamic";
import Link from "next/link";
import URLFilteredListSuspense from "@components/Filters/URLFilteredListSuspense";

const cachedPosts = unstable_cache(
  getAllSuggestedPosts,
  ["allSuggestedPosts"],
  {
    revalidate: 300,
    tags: ["posts"],
  }
);
const URLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredList"),
  { ssr: false, loading: () => <URLFilteredListSuspense /> }
);
export default async function PostsPage() {
  const postsList = ((await cachedPosts()) || []).filter(
    ({ status }) => status !== "rejected"
  );

  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px] px-1 sm:px-2">
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
