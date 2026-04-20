"use client";
import FlohPostersList from "@components/FlohPostersList";
import ScrollableContainer from "@components/ScrollableContainer";
import { iFlohmarkt } from "@app/utils/types";
import React from "react";

interface iUserFlohs {
  [key: string]: iFlohmarkt[] | undefined;
  approved?: iFlohmarkt[];
  pending?: iFlohmarkt[];
  rejected?: iFlohmarkt[];
  old?: iFlohmarkt[];
}

function useDebounce(value: string, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

const slicedFlohList = (flohsLists: iUserFlohs) => {
  const slicedLists: iUserFlohs = {};
  Object.entries(flohsLists).forEach(([status, flohs]) => {
    slicedLists[status] = flohs?.slice(0, 6);
  });
  return slicedLists;
};

export default function FlohmaerkteSearchList({
  userFlohs,
}: {
  userFlohs: iUserFlohs;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const flohsRef = React.useRef(userFlohs);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const flohmaerkteLists = React.useMemo(() => {
    if (!debouncedQuery) return slicedFlohList(flohsRef.current);
    const query = debouncedQuery.toLowerCase();
    const lists: iUserFlohs = {};
    Object.entries(flohsRef.current).forEach(([status, flohs]) => {
      lists[status] = flohs?.filter(
        (floh) =>
          floh.title.toLowerCase().includes(query) ||
          floh.optionalComment?.toLowerCase().includes(query) ||
          floh.location?.toLowerCase().includes(query),
      );
    });
    return lists;
  }, [debouncedQuery]);
  return (
    <>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="p-2 rounded"
      />
      {Object.values(flohmaerkteLists).some((a) => !!a && !!a.length) && (
        <section className="w-full max-w-[800px] flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Your Flea Markets</h3>
          {Object.entries(flohmaerkteLists).map(([status, flohs]) =>
            !!flohs && !!flohs.length ? (
              <div
                key={status + "flohmaerkte"}
                className="p-2 w-full rounded-sm bg-hh-600 text-hh-50"
              >
                <h4 className="text-lg font-semibold ml-6">
                  {status.toUpperCase()}
                </h4>
                <div className="flex w-full items-center overflow-hidden pr-4">
                  <div className="flex items-center gap-2 w-fit overflow-x-auto">
                    <ScrollableContainer>
                      <FlohPostersList
                        flohList={flohs}
                        prefixLink={
                          status === "approved"
                            ? "/flohmaerkte/"
                            : "/flohmarkt-suggestion/"
                        }
                      />
                    </ScrollableContainer>
                  </div>
                </div>
              </div>
            ) : null,
          )}
        </section>
      )}
    </>
  );
}
