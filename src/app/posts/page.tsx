import React from "react";
import ListPosts from "./ListPosts";
import { getAllApprovedPosts } from "@app/api/dbActions";
import { parsePost } from "@app/utils/functions";

export default async function PostsPage() {
  const postsList = (await getAllApprovedPosts()).map((post) =>
    parsePost(post)
  );
  return <ListPosts postsList={postsList} />;
}
