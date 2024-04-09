import AdminRoute from "@app/providers/AdminRoute";
import React from "react";
import PostsApproval from "./PostsApproval";
import { getAllSuggestedPosts } from "@app/api/dbActions";
import { parsePost } from "@app/utils/functions";

export default async function PostsApprovalPage() {
  const postsList = await getAllSuggestedPosts();
  return (
    <main className="flex flex-col p-6 items-center bg-hh-50 bg-opacity-20 w-[90%] rounded-md">
      <AdminRoute>
        <>
          <h2 className="text-xl font-semibold text-white">Suggested Posts</h2>
          <PostsApproval postsList={postsList}></PostsApproval>
        </>
      </AdminRoute>
    </main>
  );
}
