import React from "react";
import { getAllApprovedPosts } from "@app/api/dbActions";
import CardsDisplay from "@components/@Cards/CardsDisplay";
import FilterablePostList from "@app/components/FilterablePostList";

export default async function PostsPage() {
  const postsList = await getAllApprovedPosts();
  if (!postsList) return <div>There was a problem retrieving posts</div>;
  return (
    <FilterablePostList postsList={postsList}>
      <h1 className="font-bold min-w-fit text-center   text-3xl ">All posts</h1>
    </FilterablePostList>
  );
}
