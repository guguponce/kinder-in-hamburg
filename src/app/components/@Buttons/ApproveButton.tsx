"use client";
import {
  approveSuggestedEvent,
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
  eventID,
  flohmarktID,
  spielplatzID,
  size = "small",
  contributor,
  redirect = true,
}: {
  redirect?: boolean;
  post?: iPost;
  eventID?: string;
  flohmarktID?: string;
  spielplatzID?: string;
  contributor?: iSessionUser;
  size?: "small" | "medium" | "large" | "full" | "fit";
}) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  if (!post && !flohmarktID && !spielplatzID && !eventID) return null;

  const bSize = size === "small" ? "py-1" : size === "medium" ? "py-2" : "py-4";
  const bWidth =
    size === "large"
      ? "w-full max-w-[1000px]"
      : size === "medium"
        ? "w-fit"
        : "max-w-24";
  return (
    <button
      disabled={loading}
      className={`${bSize} ${bWidth} rounded px-2 font-semibold bg-positive-700 text-center text-white disabled:bg-positive-300 disabled:bg-opacity-30 hover:bg-positive-800 active:bg-positive-600 transition-all flex`}
      onClick={async (e) => {
        e.stopPropagation();
        setLoading(true);
        if (flohmarktID || eventID) {
          await approveSuggestedEvent(
            flohmarktID || eventID!,
            eventID && "events"
          );
          if (contributor) {
            await updateContributor(
              "flohmarkt",
              contributor,
              parseInt(flohmarktID || eventID!)
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
        if (redirect) {
          await sleep(2500);
          router.push(
            post
              ? `/posts/${post.id}`
              : flohmarktID
                ? `/flohmaerkte/${flohmarktID}`
                : eventID
                  ? `/events/${eventID}`
                  : spielplatzID
                    ? `/spielplaetze/${spielplatzID}`
                    : "/"
          );
        } else {
          await sleep(2500);
          setLoading(false);
          router.refresh();
        }
      }}
    >
      Approve{" "}
      {post
        ? "Post"
        : flohmarktID
          ? "Flohmarkt"
          : eventID
            ? "Event"
            : "Spielplatz"}
      {loading && <span className="font-bold animate-spin block ml-2">↻</span>}
    </button>
  );
}
