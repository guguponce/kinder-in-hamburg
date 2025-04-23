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

export default function FlohmaerkteSearchList({
  userFlohs,
}: {
  userFlohs: iUserFlohs;
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const flohsRef = React.useRef(userFlohs);

  const flohmaerkteLists = React.useMemo(() => {
    if (!searchQuery) return flohsRef.current;
    const lists: iUserFlohs = {};
    Object.entries(flohsRef.current).forEach(([status, flohs]) => {
      lists[status] = flohs?.filter(
        (floh) =>
          floh.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          floh.optionalComment
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    });
    return lists;
  }, [searchQuery]);
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
            ) : null
          )}
        </section>
      )}
    </>
  );
}
