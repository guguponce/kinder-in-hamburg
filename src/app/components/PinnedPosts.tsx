import { getPinnedPosts, getPinnedPostsWithFilter } from "@app/api/dbActions";
import React from "react";
import HorizontalCard from "./@Cards/HorizontalCard";
import { cn, getPlainText } from "@app/utils/functions";
import ScrollableContainer from "./ScrollableContainer";
import ShuffleGallery from "./@Cards/ShuffleGallery";
import { unstable_cache } from "next/cache";

const cachedPinnedPosts = unstable_cache(getPinnedPosts, ["pinnedPosts"], {
  revalidate: 300,
  tags: ["posts"],
});
export default async function PinnedPosts({
  category,
  bezirk,
  scroll = true,
  className,
}: {
  category?: string;
  bezirk?: string;
  scroll?: boolean;
  className?: string;
}) {
  const pinnedPosts = await (category
    ? getPinnedPostsWithFilter("category", category)
    : bezirk
      ? getPinnedPostsWithFilter("bezirk", bezirk)
      : cachedPinnedPosts());
  if (!pinnedPosts) return null;
  const post = pinnedPosts.find((p) => !!p.image);
  if (!post) return null;
  return (
    <section
      className={cn(
        "w-fit max-w-full p-4 bg-negative-400 bg-opacity-75 mx-auto flex justify-center",
        className
      )}
    >
      {scroll ? (
        <ScrollableContainer>
          {pinnedPosts.slice(0, 3).map((p) => (
            <article
              className="min-w-[300px] max-w-[300px] aspect-[2] sm:min-w-[400px] sm:max-w-[400px] sm:aspect-[2.5] mr-2"
              key={p.id}
            >
              <HorizontalCard
                type="post"
                id={p.id}
                title={p.title}
                link={`/${
                  p.status === "approved" ? "posts" : "post-suggestions"
                }/${p.id}`}
                image={(p.image && p.image[0]) || ""}
              >
                <HorizontalCard.PostInfo
                  title={p.title}
                  description={getPlainText(p.text).slice(0, 100) + "..."}
                  stadtteil={p.stadtteil}
                />
              </HorizontalCard>
            </article>
          ))}
        </ScrollableContainer>
      ) : (
        <ShuffleGallery
          list={pinnedPosts}
          size="medium"
          transparent
          postPoster={false}
          posterClassname="w-full aspect-[0.66]"
          shuffle
        />
      )}
    </section>
  );
}
