"use client";
import { FilterObject, iPost } from "@app/utils/types";
import React, { useMemo, useRef, useState } from "react";
import CardsDisplay from "./@Cards/CardsDisplay";
import PostFilters from "./PostsFilters";
import { usePathname } from "next/navigation";
import { parseParams } from "@app/utils/functions";

export default function FilterablePostList({
  children,
  postsList,
}: {
  postsList: iPost[];
  children?: React.ReactNode;
}) {
  const params = usePathname();
  const [type, p] = params.split("/").filter(Boolean) || ["", ""];
  const param = p ? parseParams(p) : p;
  const [maxDisplay, setMaxDisplay] = useState(10);
  const [maxDisplayable, setMaxDisplayable] = useState(10);
  const initialFilter = useRef<FilterObject | null>(
    (!!param &&
      (type === "categories"
        ? { categories: [param] }
        : type === "bezirke" && { bezirk: param })) ||
      null
  );

  const postsListRef = useRef([...postsList]);
  const [filters, setFilters] = useState<FilterObject>(
    initialFilter.current || {}
  );

  const setNewFilters = (filters: FilterObject) => {
    setFilters(filters);
  };

  const handleSetMaxDisplay = () => {
    setMaxDisplay((prev) => prev + 10);
  };
  const displayList = useMemo(() => {
    const filteredList = postsListRef.current.filter((post) => {
      const postMinAge = post.minAge || 0;
      const postMaxAge = post.maxAge || 100;
      const { categories, bezirk, fromAge, untilAge, pinnedPosts, search } =
        filters;

      const startAge = !!filters.fromAge ? filters.fromAge : 0;
      const endAge = !!filters.untilAge ? filters.untilAge : 0;
      if (categories && categories.length) {
        if (type && param) {
          return !categories.some(
            (cat) => !post.categories.includes(parseParams(cat))
          );
        } else {
          return !categories.find((cat) =>
            post.categories.includes(parseParams(cat))
          );
        }
      }

      if (bezirk && post.bezirk !== bezirk) return false;
      if (!postMinAge) {
      } else if (
        !!startAge &&
        (postMinAge > startAge || postMaxAge < startAge)
      ) {
        return false;
      }
      if (!postMaxAge) {
      } else if (!!endAge && (postMaxAge < endAge || postMinAge > endAge)) {
        return false;
      }
      if (search && !post.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (pinnedPosts && !post.pinnedPost) return false;

      return true;
    });

    setMaxDisplayable(filteredList.length);
    return filteredList.slice(0, maxDisplay);
  }, [filters, maxDisplay, type, param]);
  if (!postsListRef.current)
    return <div>There was a problem retrieving posts</div>;
  return (
    <section className="flex flex-grow flex-col gap-2 w-full max-w-[1200px] bg-hh-100 rounded py-4">
      <div className="flex flex-col-reverse justify-between gap-2 h-full">
        <aside id="filters-container" className="relative w-fit h-full">
          <PostFilters
            initialFilterType={type || ""}
            setNewFilters={setNewFilters}
            initialFilterValue={param || ""}
          />
        </aside>
        {children}
      </div>
      <article className="flex flex-col w-full flex-grow">
        <CardsDisplay cardPosts={displayList} />
        {displayList.length < maxDisplayable && (
          <button
            onClick={handleSetMaxDisplay}
            className="p-2 bg-hh-500 rounded bg-opacity-25 hover:bg-opacity-50"
          >
            Load More
          </button>
        )}
      </article>
    </section>
  );
}
