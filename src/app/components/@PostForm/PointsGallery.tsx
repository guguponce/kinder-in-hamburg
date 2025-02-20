"use client";
import { getPlainText } from "@app/utils/functions";
import { iPost } from "@app/utils/types";
import Link from "next/link";
import React, { useMemo, useRef } from "react";

export default function PointsGallery({
  posts,
  horizontal = true,
  children,
}: {
  horizontal?: boolean;
  posts: iPost[];
  children?: React.ReactNode;
}) {
  const postsList = useRef(posts);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentPost = useMemo(() => {
    if (postsList.current.length === 0) return null;
    const { title, id, text, image } = postsList.current[currentIndex];
    const separatedText = getPlainText(text).split(" ");
    const maxWords = horizontal ? 50 : 15;
    const description =
      separatedText.slice(0, maxWords).join(" ") +
      (separatedText.length > maxWords ? "..." : "");
    return { id: id, title: title, description: description, image: image };
  }, [currentIndex, horizontal]);
  if (!currentPost) return <></>;

  return (
    <div
      className={`${
        horizontal
          ? "aspect-[1.5]  max-w-[600px] w-full"
          : "h-full aspect-[0.75]"
      }  rounded-lg bg-center bg-cover flex flex-col gap-2 ${
        children ? "justify-between" : "justify-end"
      } p-4 shadow-lg`}
      style={{
        backgroundImage: `url(${currentPost.image![0]})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
      <div className="flex flex-col items-center gap-1">
        <Link
          href={`/posts/${postsList.current[currentIndex].id}`}
          className="p-1 rounded-sm bg-hh-300 bg-opacity-20 backdrop-blur-sm hover:bg-black hover:bg-opacity-20"
        >
          <span className="block text-white text-lg md:text-2xl  font-bold">
            {currentPost.title}
          </span>
          <span className="truncate-3 block italic text-white text-xs md:text-sm">
            {currentPost.description}
          </span>
        </Link>
        <div className=" flex gap-4 self-center rounded-full p-1 bg-hh-900 backdrop-blur-sm bg-opacity-20">
          {postsList.current.map((post, i) => (
            <button
              key={post.id}
              className={`w-4 h-4 rounded-full bg-hh-800 backdrop-blur-none ${
                currentIndex === i
                  ? "bg-white outline-2 outline-offset-2 outline-white outline"
                  : "bg-opacity-50"
              }`}
              onClick={() => setCurrentIndex(i)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
