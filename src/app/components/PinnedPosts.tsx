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
    <section className="w-full p-4 ">
      <div className="w-full bg-negative-400 mx-auto flex justify-center">
        <ScrollableContainer>
          {pinnedPosts.slice(0, 3).map((p) => (
            <article
              className="min-w-[400px] max-w-[400px] aspect-[2.5] md:aspect-[2.5] mr-2"
              key={p.id}
            >
              <HorizontalCard
                id={p.id}
                image={p.image ? p.image[0] : ""}
                title={p.title}
                description={getPlainText(p.text)}
                aspectRatio={2.5}
              />
            </article>
          ))}
        </ScrollableContainer>
      </div>
    </section>
  );
}
