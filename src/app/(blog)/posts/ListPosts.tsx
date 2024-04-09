"use client";

import type { iPost } from "@app/utils/types";
import Loading from "@components/Loading";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ListPosts({ postsList }: { postsList: iPost[] }) {
  const [allPosts, setAllPosts] = useState<iPost[]>(postsList);
  const [displayedPosts, setDisplayedPosts] = useState<iPost[]>(allPosts);
  const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);
  const [bezirkeFilter, setBezirkeFilter] = useState<string>("");
  const [ageFilter, setAgeFilter] = useState<{ from: string; until: string }>({
    from: "",
    until: "",
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const [count, setCount] = useState(10);

  return (
    <main
      id="list-posts-main"
      className="w-full max-w-[1000px] rounded-md shadow-md bg-white text-black p-4 relative flex flex-col gap-4"
    >
      <h1 className="items-start max-w-[80%] ml-4 mb-[6] sm:w-full sm:ml-8">
        Latest posts
      </h1>

      {!!allPosts.length && (
        <div className="z-50 self-center w-full md:w-[80%]">
          {/* <Filters
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            categoriesFilter={categoriesFilter}
            setCategoriesFilter={setCategoriesFilter}
            setBezirkeFilter={setBezirkeFilter}
            setAgeFilter={setAgeFilter}
          /> */}
        </div>
      )}
      {!allPosts.length ? (
        <Loading />
      ) : !!displayedPosts.length ? (
        <section className="z-10 flex flex-col items-end relative">
          <div className="flex flex-wrap justify-center items-start flex-row w-full mt-4">
            <div className="flex flex-wrap items-center w-full">
              {displayedPosts.slice(0, count).map((post, i) => (
                <Link
                  key={post.id}
                  className={`flex flex-col ${
                    i % 2 ? "md:flex-row" : "md:flex-row-reverse"
                  } md:flex  justify-between w-full min-h-[240px] hvoer:scale-[1.01] duration-1000 shadow-lg hover:shadow-2xl hover:outline-2 hover:outline-white`}
                  href={`/posts/${post.id}`}
                >
                  {!!post.image![0] && (
                    <div className="w-full md:min-w-[200px] max-h-[400px] md:mx-4 self-center">
                      <img
                        id={post.title + i}
                        loading="lazy"
                        className="object-cover max-h-40vh h-full w-full rounded-sm"
                        src={
                          !!post?.image
                            ? post.image[0]
                            : "/assets/icons/baby.svg"
                        }
                        alt={post.title}
                      />
                    </div>
                  )}
                  <div className="pb-4 md:pb-0 overflow-hidden">
                    <div className="py-2">
                      <h3 className="font-bold text-xl">{post.title}</h3>
                    </div>
                    <div className="md:py-2 w-full">
                      <p className="cardText">
                        {/* {post.text?.substring(0, 250)}
                        {post.text.length > 250 && "..."} */}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center">
          <h3 className="font-semibold text-xl text-center">
            There are no posts with the chosen filters
          </h3>
          <button
            className="px-2 py-1 bg-[#84b8c6dc] text-white rounded-md hover:bg-[#47596b] hover:shadow-md"
            onClick={() => {
              setAgeFilter({ from: "", until: "" });
              setBezirkeFilter("");
              setCategoriesFilter([]);
              setSearchInput("");
            }}
          >
            Reset filters
          </button>
        </section>
      )}
    </main>
  );
}
