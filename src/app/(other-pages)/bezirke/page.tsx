import { bezirke } from "@app/utils/constants";
import React from "react";
import BezirkCards from "./BezirkCards";
import { getHamburgsWeather } from "@app/api/weatherAPI";
import { getAllSuggestedPosts } from "@app/api/dbActions";
import { iPost } from "@app/utils/types";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import RandomRecommendation from "@app/components/@Cards/RandomRecommendation";
import Link from "next/link";

export default async function BezirkePage() {
  const allPosts = await getAllSuggestedPosts();
  if (!allPosts) return <PostNotFound multiples={true} type="post" />;
  const bezirkePosts = allPosts.reduce((acc, post) => {
    if (!post.bezirk) return acc;
    acc[post.bezirk] = acc[post.bezirk] || [];
    acc[post.bezirk].push(post);
    return acc;
  }, {} as { [key: string]: iPost[] });

  return (
    <>
      <h1 className="font-bold text-xl">Bezirke</h1>
      <h2 className="font-bold text-hh-700 text-base">
        Where do you want to go?
      </h2>
      <section className="flex flex-wrap gap-4 justify-center py-4">
        {Object.entries(bezirkePosts).map(([bezirk, bezirkPosts]) => (
          <article
            key={bezirk}
            className="relative flex flex-col items-center h-[375px] pb-16"
          >
            <RandomRecommendation posts={bezirkPosts} size="medium">
              <Link
                href={`/bezirke/${bezirk}`}
                className="block bg-hh-700 bg-opacity-75 hover:bg-opacity-100 backdrop-blur-sm w-full mx-auto max-w-full text-lg font-bold text-white px-2 py-1 text-center -mt-1 p-2 rounded-[6px_6px_0_0]"
              >
                {bezirk}
              </Link>
            </RandomRecommendation>
            <Link
              href={`/bezirke/${bezirk}`}
              className="absolute bottom-16 bg-hh-700 -z-10 translate-y-full px-4 py-1 max-w-[80%] w-fit text-sm text-center  rounded-[0_0_6px_6px] text-white font-semibold hover:bg-hh-800 transition-all duration-200 ease-in-out"
            >
              More in {bezirk}
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
