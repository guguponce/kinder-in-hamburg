"use client";
import {
  approveSuggestedFlohmarkt,
  approveSuggestedPost,
  updateContributor,
} from "@app/api/dbActions";
import {
  revalidateFlohmarkt,
  revalidatePost,
} from "@app/utils/actions/revalidate";
import { sleep } from "@app/utils/functions";
import { iFlohmarkt, iPost, iSessionUser } from "@app/utils/types";
import { useRouter } from "next/navigation";
import React from "react";

export default function ApproveButton({
  post,
  flohmarktID,
  size = "small",
  flohmarktContributor,
}: {
  post?: iPost;
  flohmarktID?: string;
  flohmarktContributor?: iSessionUser;
  size?: "small" | "medium" | "large";
}) {
  const router = useRouter();
  if (!post && !flohmarktID) return null;
  return (
    <button
      className={` flex ${
        size === "large" ? "w-full max-w-[1000px]" : "w-fit"
      } items-center justify-center rounded  px-2 ${
        size === "small" ? "py-1" : "py-2"
      } font-semibold bg-positive-700 text-white hover:bg-positive-800 active:bg-positive-600`}
      onClick={async () => {
        const approveFunction = await (flohmarktID
          ? approveSuggestedFlohmarkt(flohmarktID)
          : post && approveSuggestedPost(post));
        if (flohmarktID) {
          await revalidateFlohmarkt();
          if (flohmarktContributor) {
            await updateContributor(
              flohmarktContributor,
              parseInt(flohmarktID)
            );
          }
        } else if (post) {
          await revalidatePost();
          await updateContributor(post?.addedBy, post.id);
        }
        await sleep(500);
        router.push(
          post
            ? `/posts-approval/success/${post.id}`
            : flohmarktID
            ? `/flohmaerkte-approval/successfully-approved/${flohmarktID}`
            : "/"
        );
      }}
    >
      Approve {post ? "Post" : "Flohmarkt"}
    </button>
  );
}
