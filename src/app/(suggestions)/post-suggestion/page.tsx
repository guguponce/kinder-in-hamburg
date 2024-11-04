import React from "react";
import AdminRoute from "@app/providers/AdminRoute";
import URLFilteredList from "@app/(blog)/posts/URLFilteredList";
import { getAllSuggestedPosts } from "@app/api/dbActions";

export default async function PostsPage() {
  const postsList = ((await getAllSuggestedPosts()) || []).filter(
    ({ status }) => status !== "rejected"
  );

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
