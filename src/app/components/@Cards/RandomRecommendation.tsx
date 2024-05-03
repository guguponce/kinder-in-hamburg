"use client";
import { iPost } from "@app/utils/types";
import React, { useMemo, useRef } from "react";
import Recommendation from "./Recommendation";
import PostLogo from "../@Icons/@PostLogo/PostLogo";

export default function RandomRecommendation({
  children,
  posts,
  shuffle,
  size,
}: {
  shuffle?: boolean;
  size?: "small" | "medium" | "large";
  posts: iPost[];
  children?: React.ReactNode;
}) {
  const originalPosts = useRef(posts || []);
  const [sortedPosts, setSortedPosts] = React.useState<iPost[]>(
    originalPosts.current
  );
  const pastIDs = useRef<number[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const currentPost = useMemo(() => {
    if (originalPosts.current.length === 0) return undefined;
    // if(pastIDs.current.includes(sortedPosts[currentIndex].id)){
    //   if(pastIDs.current.length === originalPosts.current.length){
    //     return null;
    //   }
    //   setCurrentIndex((prev)=>(prev+1) % sortedPosts.length);
    //   return sortedPosts[currentIndex];
    // }
    return sortedPosts[currentIndex];
  }, [currentIndex, sortedPosts]);
  if (currentPost === undefined) return null;
  // if(currentPost === null) return <>NO MORE RECOMMENDATIONS</>
  return (
    <div
      className={`relative flex flex-col items-center rounded-md h-full aspect-[0.625] w-fit max-w-full gap-2 ${
        shuffle ? "pb-12" : ""
      }`}
    >
      <Recommendation size={size} post={currentPost}>
        {children}
      </Recommendation>
      <div
        className={`absolute ${
          shuffle
            ? "bottom-1 justify-around"
            : "top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 justify-between px-1"
        } flex items-center w-full gap-2`}
      >
        <button
          title="Previous Post"
          className={`${
            shuffle
              ? ""
              : "bg-hh-900 bg-opacity-15 hover:bg-hh-950 hover:bg-opacity-20 rounded-md shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
          } p-1 ml-1 aspect-square -rotate-90`}
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % sortedPosts.length)
          }
        >
          <PostLogo logo="triangle" size="2rem" color="#fefefe"></PostLogo>
        </button>
        {shuffle && (
          <button
            title="Shuffle"
            className="aspect-square hover:p-0 h-fit hover:bg-opacity-10 hover:bg-hh-50 rounded-full"
            onClick={() => {
              setSortedPosts(
                [...originalPosts.current].sort(() => 0.5 - Math.random())
              );
            }}
          >
            <PostLogo logo="shuffle" size="2rem" color="#fefefe"></PostLogo>
          </button>
        )}
        <button
          title="Next Post"
          className={`${
            shuffle
              ? ""
              : "bg-hh-900 hover:bg-hh-950 hover:bg-opacity-20 bg-opacity-15 rounded-md shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
          } p-1 mr-1 aspect-square rotate-90`}
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? sortedPosts.length - 1 : prev - 1
            )
          }
        >
          <PostLogo logo="triangle" size="2rem" color="#fefefe"></PostLogo>
        </button>
      </div>
    </div>
  );
}
