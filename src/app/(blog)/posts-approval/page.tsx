import AdminRoute from "@app/providers/AdminRoute";
import React from "react";
import PostsApproval from "./PostsApproval";
import { getPendingPosts } from "@app/api/dbActions";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Posts Approval",
    icons: "/favicon.ico",
  };
}
export default async function PostsApprovalPage() {
  const postsList = await getPendingPosts();
  if (!postsList) return <div>There was a problem retrieving posts</div>;
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
