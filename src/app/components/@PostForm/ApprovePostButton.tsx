"use client";
import { approveSuggestedPost } from "@app/api/dbActions";
import { sleep } from "@app/utils/functions";
import { iPost } from "@app/utils/types";
import { useRouter } from "next/navigation";
import React from "react";

export default function ApprovePostButton({ post }: { post: iPost }) {
  const router = useRouter();
  return (
    <button
      className="bg-positive-700 rounded-md p-2 text-white hover:bg-positive-800 active:bg-positive-600"
      onClick={async () => {
        await approveSuggestedPost(post);
        await sleep(500);
        router.push(`/posts-approval/success/${post.id}`);
      }}
    >
      Approve Post
    </button>
  );
}
