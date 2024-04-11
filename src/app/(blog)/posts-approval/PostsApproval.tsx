"use client";
import DisplayTypeText from "@components/@PostForm/DisplayTypeText";
import MinimalPostDisplay from "@components/MinimalPostDisplay";
import { iPost } from "@app/utils/types";
import React, { useEffect, useState } from "react";

export default function PostsApproval({ postsList }: { postsList: iPost[] }) {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const handleSelectPost = (postID: number) => setSelectedPost(postID);
  return (
    <main className="w-full">
      {postsList.map((post) =>
        post.id === selectedPost ? (
          <article
            key={post.id}
            className="relative my-2 w-full rounded-sm bg-white mx-auto p-4 flex flex-col"
          >
            <MinimalPostDisplay post={post} />
          </article>
        ) : (
          <article
            key={post.id}
            className="relative my-2 w-full rounded-sm bg-white mx-auto p-4 flex flex-col"
          >
            <button
              className="absolute right-2 top-3 bg-hh-800 text-white rounded-md p-1"
              onClick={() => handleSelectPost(post.id)}
            >
              Expand
            </button>
            <h2 className="font-semibold max-w-[calc(100%-60px)] mb-2">
              {post.title}
            </h2>
            <DisplayTypeText
              key={post.text[0][0]}
              type={post.text[0][0]}
              text={post.text[0][1]}
            />
            <small className="self-end">{post.addedBy.name}</small>
          </article>
        )
      )}
    </main>
  );
}
