import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import URLFilteredList from "./URLFilteredList";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";

export const revalidate = 20;

const cachedPosts = unstable_cache(getAllApprovedPosts, ["allApprovedPosts"], {
  revalidate: 300,
});
export default async function PostsPage() {
  // -----------------------------------------------
  const postsList = await cachedPosts();
  if (!postsList) return <div>There was a problem retrieving posts</div>;
  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px]">
        <URLFilteredList postsList={postsList}>
          <h1 className="font-bold min-w-fit text-center   text-3xl ">
            All posts
          </h1>
        </URLFilteredList>
      </main>
    </AdminRoute>
  );
}
