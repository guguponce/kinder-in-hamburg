import { getApprovedPostWithID } from "@app/api/dbActions";
import DisplayTypeText from "@app/components/@PostForm/DisplayTypeText";
import PostTemplate from "@app/components/PostTemplate";
import { parseAddress, parsePost } from "@app/utils/functions";
import { TypeAndText } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default async function CurrentPostPage({
  params,
}: {
  params: { postID: string };
}) {
  const { postID } = params;
  const retrievedPost = await getApprovedPostWithID(postID);
  console.log("retrievedPost", retrievedPost);
  if (!retrievedPost)
    return (
      <main className="flex flex-col items-center justify-center p-6 rounded-md bg-hh-100 w-[500px] max-w-full m-2 gap-4">
        <h2 className="text-lg font-bold text-hh-950">Post not found</h2>
        <p className="text-base text-hh-600">Check out our active posts</p>
        <Link
          className="p-2 rounded-md bg-hh-800 hover:bg-hh-700 active:bg-hh-600 text-white"
          href={"/posts"}
        >
          All Posts
        </Link>
      </main>
    );
  const parsedPost = parsePost(retrievedPost);

  return <PostTemplate post={parsedPost} />;
}
