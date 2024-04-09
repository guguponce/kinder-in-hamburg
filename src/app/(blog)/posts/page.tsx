import React from "react";
import { getAllApprovedPosts } from "@app/api/dbActions";
import CardsDisplay from "@app/components/@Cards/CardsDisplay";

export default async function PostsPage() {
  const postsList = await getAllApprovedPosts();
  return <CardsDisplay cardPosts={postsList} />;
}
