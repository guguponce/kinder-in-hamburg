import React from "react";
import { getAllApprovedPosts } from "@app/api/dbActions";
import FilterablePostList from "@app/components/FilterablePostList";
import AdminRoute from "@app/providers/AdminRoute";

export default async function PostsPage() {
  const postsList = await getAllApprovedPosts();
  if (!postsList) return <div>There was a problem retrieving posts</div>;
  return (
    <AdminRoute>
      <main className="w-full max-w-[1000px]">
        <FilterablePostList postsList={postsList}>
          <h1 className="font-bold min-w-fit text-center   text-3xl ">
            All posts
          </h1>
        </FilterablePostList>
      </main>
    </AdminRoute>
  );
}
