"use client";
import { FilterObject, iPost } from "@app/utils/types";
import React, { useCallback, useMemo, useRef, useState } from "react";
import CardsListDisplay from "@components/@Cards/CardsListDisplay";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseParams } from "@app/utils/functions";
import { bezirke as bezirkeNames, categoryNames } from "@app/utils/constants";
const getAvailableBezirke = (postsList: iPost[]) => {
  let bezirke: { [x: string]: number } = {};
  for (let i = 0; i < postsList.length; i++) {
    const { bezirk } = postsList[i];
    if (!bezirke[bezirk]) {
      bezirke[bezirk] = 1;
    }
    if (Object.keys(bezirke).length === bezirkeNames.length) break;
  }
  return Object.keys(bezirke);
};
export default function URLFilteredList({
  children,
  postsList,
}: {
  postsList: iPost[];
  children?: React.ReactNode;
}) {
  // GET PARAMS AND PARSE THEM
  const params = usePathname();
  const router = useRouter();
  const [type, p] = params.split("/").filter(Boolean) || ["", ""];
  const param = !!p ? parseParams(p) : p;

  console.log(params);
  // STATE
  const [maxDisplay, setMaxDisplay] = useState(12);
  const [maxDisplayable, setMaxDisplayable] = useState(postsList.length);
  const postsListRef = useRef([...postsList]);

  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );
  const [bezirkeFilter, setBezirkeFilter] = useState<Array<string>>(
    searchParams.getAll("bezirke")
  );
  const [categoriesFilter, setCategoriesFilter] = useState<Array<string>>(
    searchParams.getAll("categories")
  );
  const [queryAlter, setQueryAlter] = useState(searchParams.get("alter") || "");

  // FUNCTIONS
  const handleSetMaxDisplay = () => {
    setMaxDisplay((prev) => prev + 12);
  };

  // MEMOIZED VALUES
  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return postsListRef.current;
    return postsListRef.current.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredByAlter = useMemo(() => {
    if (!queryAlter) return filteredBySearch;
    return filteredBySearch.filter((post) => {
      const postMinAge = post.minAge || 0;
      const postMaxAge = post.maxAge || 100;
      const alter = parseInt(queryAlter);
      if (!!postMinAge && postMinAge >= alter) {
        return false;
      }
      if (!!postMaxAge && postMaxAge <= alter) {
        return false;
      }
      return true;
    });
  }, [queryAlter, filteredBySearch]);

  const filteredByBezirke = useMemo(() => {
    if (!bezirkeFilter.length) return filteredByAlter;
    return filteredByAlter.filter((post) =>
      bezirkeFilter.includes(post.bezirk)
    );
  }, [bezirkeFilter, filteredByAlter]);
  const filteredByCategories = useMemo(() => {
    if (!categoriesFilter.length) return filteredByBezirke;
    return filteredByBezirke.filter((post) => {
      return categoriesFilter.every((cat) => post.categories.includes(cat));
    });
  }, [categoriesFilter, filteredByBezirke]);

  const displayList = useMemo(() => {
    const filteredList = filteredByCategories;
    setMaxDisplayable(filteredList.length);
    return filteredList.slice(0, maxDisplay);
  }, [maxDisplay, filteredByCategories]);

  const availableBezirke = useRef(getAvailableBezirke(postsListRef.current));

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.has(name)) {
        params.delete(name);
      }
      if (value) {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );
  const createArrayQueryString = useCallback(
    (name: string, value: string, array: string[]) => {
      const newValue = encodeURIComponent(value);
      const params = new URLSearchParams(searchParams.toString());
      const oldValues = params.getAll(name);
      const currentValues = array.includes(newValue)
        ? array.filter((v) => v !== newValue)
        : [...oldValues, newValue];
      setBezirkeFilter(currentValues);
      params.delete(name);
      currentValues.forEach((v) => params.append(name, v));
      return params.toString();
    },
    [searchParams]
  );
  if (!postsListRef.current)
    return <div>There was a problem retrieving posts</div>;

  return (
    <section className="flex flex-grow flex-col gap-2 w-full max-w-[1200px] bg-hh-100 rounded py-4">
      <div className="flex flex-col-reverse justify-between gap-2 h-full">
        <p>{searchQuery}</p>
        <p>{categoriesFilter}</p>
        <p>{bezirkeFilter}</p>
        <p>{queryAlter}</p>

        <aside id="top-filters-container" className="relative w-fit h-full">
          <strong>{params}</strong>
          <fieldset>
            <legend>Suche nach einem Beitrag</legend>
            <input
              type="text"
              placeholder="Suche nach einem Beitrag"
              onChange={(e) => {
                router.push(
                  params +
                    "?" +
                    createQueryString("searchQuery", e.target.value)
                );
                setSearchQuery(e.target.value);
              }}
            />
          </fieldset>
          {type !== "bezirke" && (
            <div className="flex flex-wrap gap-2">
              {availableBezirke.current.map((bz) => (
                <button
                  key={bz}
                  onClick={() => {
                    router.push(
                      params +
                        "?" +
                        createArrayQueryString("bezirke", bz, bezirkeFilter)
                    );
                    setBezirkeFilter((prev) => {
                      if (prev.includes(encodeURIComponent(bz))) {
                        return prev.filter((v) => v !== encodeURIComponent(bz));
                      }
                      return [...prev, encodeURIComponent(bz)];
                    });
                  }}
                  className={`p-2 bg-hh-500 rounded bg-opacity-25 hover:bg-opacity-50 ${
                    bezirkeFilter.includes(encodeURIComponent(bz))
                      ? "bg-opacity-50"
                      : ""
                  }`}
                >
                  {bz}
                </button>
              ))}
            </div>
          )}
        </aside>
        {children}
      </div>
      <aside id="left-filters-container" className="relative w-fit h-full">
        {type !== "categories" && (
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  router.push(
                    params +
                      "?" +
                      createArrayQueryString("bezirke", cat, categoriesFilter)
                  );
                  setCategoriesFilter((prev) => {
                    if (prev.includes(cat)) {
                      return prev.filter((v) => v !== cat);
                    }
                    return [...prev, cat];
                  });
                }}
                className={`p-2 bg-hh-500 rounded bg-opacity-25 hover:bg-opacity-50 ${
                  categoriesFilter.includes(cat) ? "bg-opacity-50" : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        <div id="alter-filter" className="flex flex-col gap-2">
          <label htmlFor="alter">Alter</label>
          <input
            type="number"
            id="alter"
            placeholder="Alter"
            value={queryAlter}
            onChange={(e) => {
              router.push(
                params + "?" + createQueryString("alter", e.target.value)
              );
              setQueryAlter(e.target.value);
            }}
          />
        </div>
      </aside>
      <article className="flex flex-col w-full flex-grow">
        <CardsListDisplay cardPosts={displayList} />
        {maxDisplayable}
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
