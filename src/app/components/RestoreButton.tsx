"use client";
import {
  approveSuggestedFlohmarkt,
  approveSuggestedPost,
  restorePost,
  updateFlohmarktStatus,
} from "@app/api/dbActions";
import {
  revalidateSpielplatz,
  updateSpielplatzStatus,
} from "@app/api/spActions";
import {
  revalidateFlohmarkt,
  revalidatePost,
} from "@app/utils/actions/revalidate";
import { sleep } from "@app/utils/functions";
import { iFlohmarkt, iPost } from "@app/utils/types";
import { useRouter } from "next/navigation";
import React from "react";

export default function RestoreButton({
  postID,
  flohmarktID,
  spielplatzID,
  size = "small",
}: {
  postID?: number | string;
  flohmarktID?: number | string;
  spielplatzID?: number | string;
  size?: "small" | "medium" | "large";
}) {
  const router = useRouter();
  if (!postID && !flohmarktID && !spielplatzID) return null;

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
        await (flohmarktID
          ? updateFlohmarktStatus(flohmarktID, "pending")
          : spielplatzID
          ? updateSpielplatzStatus(spielplatzID, "pending")
          : !!postID && restorePost(postID));
        if (flohmarktID) {
          revalidateFlohmarkt();
        } else if (spielplatzID) {
          revalidateSpielplatz();
        } else {
          revalidatePost();
        }
        await sleep(2000);
        router.push(
          postID
            ? `/posts-suggestion/${postID}`
            : flohmarktID
            ? `/flohmarkt-suggestion/${flohmarktID}`
            : spielplatzID
            ? `/spielplatz-suggestion/${spielplatzID}`
            : "/"
        );
      }}
    >
      Restore {postID ? "Post" : spielplatzID ? "Spielplatz" : "Flohmarkt"} to
      pending
    </button>
  );
}
