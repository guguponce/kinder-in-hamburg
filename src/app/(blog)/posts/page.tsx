import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import { logoFont } from "@app/styles/fonts/localfonts";
import URLFilteredListSuspense from "@app/components/Filters/URLFilteredListSuspense";
import LoadingIcon from "@app/components/@Icons/LoadingIcon";

export const revalidate = 20;

const URLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredList"),
  { ssr: false, loading: () => <URLFilteredListSuspense /> }
);

const cachedPosts = unstable_cache(getAllApprovedPosts, ["allApprovedPosts"], {
  revalidate: 300,
});
export default async function PostsPage() {
  // -----------------------------------------------
  const postsList = await cachedPosts();
  if (!postsList) return <div>There was a problem retrieving posts</div>;
  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px] p-1 sm:p-2">
        <h1
          className={`font-bold min-w-fit text-center text-3xl ${logoFont.className} tracking-wide text-4xl sm:text-5xl text-hh-50 m-4`}
          style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.5)" }}
        >
          All posts
        </h1>
        <URLFilteredList postsList={postsList}></URLFilteredList>
      </main>
    </AdminRoute>
  );
}
