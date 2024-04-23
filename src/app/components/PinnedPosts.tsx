import { getPinnedPosts, getPinnedPostsWithFilter } from "@app/api/dbActions";
import React from "react";
import HorizontalCard from "./@Cards/HorizontalCard";
import { getPlainText } from "@app/utils/functions";
import ScrollableContainer from "./ScrollableContainer";

export default async function PinnedPosts({
  category,
  bezirk,
}: {
  category?: string;
  bezirk?: string;
}) {
  const pinnedPosts = await (category
    ? getPinnedPostsWithFilter("category", category)
    : bezirk
    ? getPinnedPostsWithFilter("bezirk", bezirk)
    : getPinnedPosts());
  if (!pinnedPosts) return null;
  const post = pinnedPosts.find((p) => !!p.image);
  if (!post) return null;
  const { id, image, title, text } = post;
  return (
    <section className="w-fit max-w-full p-4 bg-negative-400 bg-opacity-75 mx-auto flex justify-center">
      <ScrollableContainer>
        {pinnedPosts.slice(0, 3).map((p) => (
          <article
            className="min-w-[300px] max-w-[300px] aspect-[2] sm:min-w-[400px] sm:max-w-[400px] sm:aspect-[2.5] mr-2"
            key={p.id}
          >
            <HorizontalCard
              id={p.id}
              image={p.image ? p.image[0] : ""}
              title={p.title}
              description={getPlainText(p.text)}
            />
          </article>
        ))}
      </ScrollableContainer>
    </section>
  );
}
