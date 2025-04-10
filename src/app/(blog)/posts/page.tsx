import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";
import URLFilteredListSuspense from "@app/components/Filters/URLFilteredListSuspense";
import PageTitle from "@app/components/PageTitle";

export const revalidate = 20;

const URLFilteredList = dynamic(
  () => import("@components/Filters/URLFilteredList"),
  { ssr: false, loading: () => <URLFilteredListSuspense /> }
);

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
