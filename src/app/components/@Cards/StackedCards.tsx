import { getPlainText } from "@app/utils/functions";
import { iPost } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default function StackedCards({
  posts,
  aspectRatio = 0.66,
  link,
  onlyTitle,
  size = "medium",
}: {
  onlyTitle?: boolean;
  size?: "small" | "medium" | "large";
  aspectRatio?: number;
  posts: iPost[];
  link: string;
}) {
  const classnames = {
    container: `stackedCards w-full block relative aspect-[${aspectRatio}]`,
    card: `absolute aspect-[${aspectRatio}] text-${
      size === "small"
        ? "text-[10px]"
        : size === "medium"
        ? "text-xs"
        : "text-sm"
    } bg-gradient-to-t -translate-x-1/2 left-1/2 from-black via-[#1111118f] to-transparent rounded-md hover:shadow-xl shadow-lg bg-center bg-cover flex flex-col justify-end`,
    body: `bg-gradient-to-t from-black  to-transparent ${
      size === "small" ? "hidden" : "p-2"
    } rounded-b-md`,
  };
  return (
    <Link href={link} className={classnames.container}>
      {posts.map((post, i) => (
        <div
          key={post.id}
          className={`stackedCard-${i + 1} ${classnames.card}`}
          style={{
            backgroundImage: post.image
              ? `url(${post.image[0]})`
              : "linear-gradient(to bottom, #33404D, #1F262E)",
          }}
        >
          <div className={classnames.body}>
            <h2 className="font-semibold text-hh-100 truncate-2">
              {post.title}
            </h2>
            {!onlyTitle && (
              <p className="text-hh-300 text-xs truncate-2">
                {getPlainText(post.text)}
              </p>
            )}
          </div>
        </div>
      ))}
    </Link>
  );
}
