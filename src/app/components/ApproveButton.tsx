"use client";
import {
  approveSuggestedFlohmarkt,
  approveSuggestedPost,
  updateContributor,
} from "@app/api/dbActions";
import {
  approveSuggestedSpielplatz,
  revalidateSpielplatz,
} from "@app/api/spActions";
import {
  revalidateFlohmarkt,
  revalidatePost,
} from "@app/utils/actions/revalidate";
import { sleep } from "@app/utils/functions";
import { iPost, iSessionUser } from "@app/utils/types";
import { useRouter } from "next/navigation";
import React from "react";

export default function ApproveButton({
  post,
  flohmarktID,
  spielplatzID,
  size = "small",
  contributor,
}: {
  post?: iPost;
  flohmarktID?: string;
  spielplatzID?: string;
  contributor?: iSessionUser;
  size?: "small" | "medium" | "large" | "full" | "fit";
}) {
  const router = useRouter();
  if (!post && !flohmarktID) return null;

  const bSize = size === "small" ? "py-1" : size === "medium" ? "py-2" : "py-4";
  const bWidth =
    size === "large"
      ? "w-full max-w-[1000px]"
      : size === "medium"
      ? "w-fit"
      : "max-w-24";
  return (
    <button
      className={`${bSize} ${bWidth} rounded  px-2 font-semibold bg-positive-700 text-center text-white hover:bg-positive-800 active:bg-positive-600`}
      onClick={async () => {
        if (flohmarktID) {
          await approveSuggestedFlohmarkt(flohmarktID);
          if (contributor) {
            await updateContributor(
              "flohmarkt",
              contributor,
              parseInt(flohmarktID)
            );
          }
        } else if (post) {
          await approveSuggestedPost(post);
          await updateContributor("post", post?.addedBy, post.id);
        } else if (spielplatzID) {
          await approveSuggestedSpielplatz(spielplatzID);
          if (contributor) {
            await updateContributor(
              "spielplatz",
              contributor,
              parseInt(spielplatzID)
            );
          }
        }

        await revalidateFlohmarkt();
        await revalidatePost();
        await revalidateSpielplatz();
        await sleep(2500);
        router.push(
          post
            ? `/posts/${post.id}`
            : flohmarktID
            ? `/flohmaerkte/${flohmarktID}`
            : spielplatzID
            ? `/spielplaetze/${spielplatzID}`
            : "/"
        );
      }}
    >
      Approve {post ? "Post" : flohmarktID ? "Flohmarkt" : "Spielplatz"}
    </button>
  );
}
