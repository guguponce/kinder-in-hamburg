"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FiltersInput from "./FiltersInput";
import { bezirke, categoryNames } from "@app/utils/constants";
import { FilterObject } from "@app/utils/types";
import ScrollableContainer from "./ScrollableContainer";

export default function PostFilters({
  setNewFilters,
  initialFilterType,
  initialFilterValue,
}: {
  initialFilterType?: string;
  initialFilterValue?: string;
  setNewFilters: (filters: FilterObject) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);
  const [bezirkeFilter, setBezirkeFilter] = useState<string>("");
  const [ageFilter, setAgeFilter] = useState<{ from: number; until: number }>({
    from: 0,
    until: 0,
  });
  const [pinnedPosts, setPinnedPosts] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<FilterObject>({});

  const handleAddFilter = (filter: string, value: string) => {
    switch (filter) {
      case "category":
        setCategoriesFilter((prev) =>
          prev.includes(value)
            ? prev.filter((category) => category !== value)
            : [...prev, value]
        );
        break;
      case "bezirk":
        setBezirkeFilter(value);
        break;
      case "fromAge":
        setAgeFilter((prev) => ({ ...prev, from: parseInt(value) }));
        break;
      case "untilAge":
        setAgeFilter((prev) => ({ ...prev, until: parseInt(value) }));
        break;
      case "pinnedPosts":
        setPinnedPosts((prev) => !prev);
        break;

      case "search":
        setSearchInput(value);
        break;
      default:
        break;
    }
  };
  const handleRemoveSingleCategory = (category: string) => {
    const newFilters = { ...appliedFilters };
    const categories =
      appliedFilters.categories?.filter((cat) => cat !== category) || [];
    if (categories.length) {
      newFilters.categories = categories;
    } else {
      delete newFilters.categories;
    }
    setCategoriesFilter(categories);
    handleSetFilters(newFilters);
  };
  const handleRemoveSingleFilter = (key: keyof FilterObject) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[key];
    switch (key) {
      case "bezirk":
        setBezirkeFilter("");
        break;
      case "fromAge":
        setAgeFilter((prev) => ({ ...prev, from: 0 }));
        break;
      case "untilAge":
        setAgeFilter((prev) => ({ ...prev, until: 0 }));
        break;
      case "pinnedPosts":
        setPinnedPosts(false);
        break;
      case "search":
        setSearchInput("");
        break;
      default:
        break;
    }
    handleSetFilters(newFilters);
  };

  const removeAllFilters = () => {
    setCategoriesFilter([]);
    setBezirkeFilter("");
    setAgeFilter({ from: 0, until: 0 });
    setPinnedPosts(false);
    setSearchInput("");
    setAppliedFilters({});
    setNewFilters({});
  };

  const abJahrRef = useRef<HTMLInputElement>(null);
  const bisJahrRef = useRef<HTMLInputElement>(null);

  const wishedFilters = useMemo(() => {
    let filters: FilterObject = {};
    if (!!categoriesFilter.length) {
      filters.categories = categoriesFilter;
    }
    if (!!bezirkeFilter) {
      filters.bezirk = bezirkeFilter;
    }
    if (!!ageFilter.from) {
      filters.fromAge = ageFilter.from;
    }
    if (!!ageFilter.until) {
      filters.untilAge = ageFilter.until;
    }
    if (!!pinnedPosts) {
      filters.pinnedPosts = pinnedPosts;
    }
    if (!!searchInput) {
      filters.search = searchInput;
    }
    return filters;
  }, [categoriesFilter, bezirkeFilter, ageFilter, pinnedPosts, searchInput]);

  const handleSetFilters = (filters?: FilterObject) => {
    if (filters) {
      setNewFilters(filters);
      setAppliedFilters(filters);
    } else {
      setNewFilters(wishedFilters);
      setAppliedFilters(wishedFilters);
    }
  };

  useEffect(() => {
    const closeFilters = (e: MouseEvent) => {
      if (
        !e
          .composedPath()
          .includes(document.getElementById("filters-container")!)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", closeFilters);

    return () => {
      document.removeEventListener("click", closeFilters);
    };
  }, []);
  return (
    <>
      <div className="flex gap-2">
        <button
          className="block min-w-fit h-fit p-2 bg-hh-700 hover:bg-hh-800 active:bg-hh-600 text-white font-semibold rounded-[0_4px_4px_0] "
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          Filters
        </button>
        {!!Object.values(appliedFilters).length && (
          <div
            id="appliedFilters"
            className="p-2 shadow-inner flex-grow bg-hh-200 rounded flex flex-wrap gap-2"
          >
            {Object.entries(appliedFilters).map(([key, value]) =>
              key === "categories" ? (
                (value as string[]).map((category) =>
                  category === initialFilterValue ? null : (
                    <button
                      key={category}
                      onClick={() => handleRemoveSingleCategory(category)}
                      className="p-1 flex w-fit gap-1 bg-hh-300 text-[10px] font-semibold items-center hover:bg-hh-400 active:bg-hh-200 text-black rounded-full"
                    >
                      {category} <span>✕</span>
                    </button>
                  )
                )
              ) : key === "bezirk" && initialFilterType === "bezirke" ? null : (
                <button
                  key={key}
                  onClick={() =>
                    handleRemoveSingleFilter(key as keyof FilterObject)
                  }
                  className="p-1 flex w-fit gap-1 bg-hh-300 text-[10px] font-semibold items-center hover:bg-hh-400 active:bg-hh-200 text-black rounded-full"
                >
                  {key === "bezirk"
                    ? `in ${value}`
                    : key === "search"
                    ? `search: ${value}`
                    : key === "pinnedPosts"
                    ? "Pinned Posts"
                    : key === "fromAge"
                    ? `ab ${value} Jahren`
                    : key === "untilAge"
                    ? `bis ${value} Jahren`
                    : ""}
                  <span>✕</span>
                </button>
              )
            )}

            <button
              className="flex items-center gap-1 p-1 h-fit text-xs bg-negative-700 hover:bg-negative-800 active:bg-negative-600 text-white font-semibold rounded"
              onClick={removeAllFilters}
            >
              Remove all filters<span className="text-xs">✕</span>
            </button>
          </div>
        )}
      </div>
      <div
        className={`${
          isOpen ? "flex absolute mt-2" : "hidden"
        } flex-col min-w-[200px] items-center z-[300] p-1 bg-hh-300 gap-2 rounded-[0_4px_4px_0] text-xs min-h-[50dvh] h-fit flex-grow shadow-2xl`}
      >
        <article className="flex relative flex-col items-center w-full h-4/5  overflow-y-auto flex-grow shadow-inner">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-negative-600 hover:bg-negative-700 active:bg-negative-500 text-white font-semibold w-4 h-4 aspect-square rounded-full leading-none flex justify-center items-center  self-end m-1 mb-0 "
          >
            <span className="aspect-square w-fit leading-tight text-center">
              ×
            </span>
          </button>
          <ScrollableContainer vertical={true}>
            <div className="flex flex-col items-center p-1 gap-1">
              <div className="w-full max-w-[300px] rounded bg-hh-100 bg-opacity-25 relative flex flex-col gap-1 p-2">
                <label
                  htmlFor="search"
                  className="text-xs font-semibold leading-none w-fit"
                >
                  Search
                </label>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="w-full rounded p-1"
                  placeholder="(z.B. Flohmarkt, Kindergeburtstag)"
                  onChange={(e) => handleAddFilter("search", e.target.value)}
                />
              </div>
              {["categories", "bezirk", "jahren"].map((filter) => (
                <React.Fragment key={filter}>
                  {initialFilterType === "bezirke" &&
                  filter === "bezirk" ? null : (
                    <FiltersInput inputID={filter} inputLabel={filter}>
                      {filter === "jahren" ? (
                        <div className="w-full flex gap-2 flex-wrap justify-center items-center">
                          {/* <div className="flex-grow flex flex-col items-center"> */}
                          <input
                            type="number"
                            className="flex-grow rounded p-1 text-end"
                            id="minAge"
                            min={0}
                            max={100}
                            ref={abJahrRef}
                            placeholder="0"
                            onChange={(e) => {
                              if (
                                abJahrRef.current &&
                                bisJahrRef.current &&
                                parseInt(e.target.value) >
                                  parseInt(bisJahrRef.current.value)
                              ) {
                                const value = bisJahrRef.current.value;
                                abJahrRef.current.value = value;
                                handleAddFilter("fromAge", value);
                                handleAddFilter("untilAge", value);
                              } else {
                                handleAddFilter("fromAge", e.target.value);
                                if (
                                  bisJahrRef.current &&
                                  parseInt(bisJahrRef.current.value) <
                                    parseInt(e.target.value)
                                ) {
                                  bisJahrRef.current.value = e.target.value;
                                }
                              }
                            }}
                          />
                          {/* <label
                              htmlFor="minAge"
                              className="text-xs font-semibold leading-7 w-fit"
                            >
                              Min.
                            </label>
                          </div> */}
                          <p className="w-fit">bis</p>
                          {/* <div className="flex-grow flex flex-col items-center"> */}
                          <input
                            min={0}
                            max={100}
                            placeholder="100"
                            type="number"
                            className="flex-grow rounded p-1"
                            id="maxAge"
                            ref={bisJahrRef}
                            onChange={(e) => {
                              if (
                                abJahrRef.current &&
                                parseInt(e.target.value) <
                                  parseInt(abJahrRef.current.value) &&
                                bisJahrRef.current
                              ) {
                                const value = abJahrRef.current.value;
                                bisJahrRef.current.value = value;
                                handleAddFilter("fromAge", value);
                                handleAddFilter("untilAge", value);
                              } else {
                                handleAddFilter("untilAge", e.target.value);
                                if (
                                  abJahrRef.current &&
                                  parseInt(abJahrRef.current.value) >
                                    parseInt(e.target.value)
                                ) {
                                  abJahrRef.current.value = e.target.value;
                                }
                              }
                            }}
                          />
                          {/* <label
                              htmlFor="maxAge"
                              className="text-xs font-semibold leading-7 w-fit"
                            >
                              Max.
                            </label>
                          </div> */}
                        </div>
                      ) : filter === "categories" ? (
                        <div className="flex flex-col gap-1">
                          {categoryNames.map((category) =>
                            category === initialFilterValue ? null : (
                              <div key={category} className="flex gap-2">
                                <input
                                  key={category}
                                  type="checkbox"
                                  id={category}
                                  name="categories"
                                  checked={categoriesFilter.includes(category)}
                                  onChange={() => {
                                    handleAddFilter("category", category);
                                  }}
                                />
                                <label
                                  className="capitalize"
                                  htmlFor={category}
                                >
                                  {category}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      ) : filter === "bezirk" ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <input
                              type="radio"
                              name="bezirk"
                              id="none"
                              className="w-fit"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleAddFilter("bezirk", "");
                                }
                              }}
                            />
                            <label htmlFor="none" className="w-fit capitalize">
                              Anywhere
                            </label>
                          </div>
                          {bezirke.map((bezirk) => (
                            <div key={bezirk} className="flex gap-2">
                              <input
                                type="radio"
                                name="bezirk"
                                id={bezirk}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleAddFilter("bezirk", bezirk);
                                  }
                                }}
                                className="w-fit"
                              />
                              <label
                                htmlFor={bezirk}
                                className="w-fit capitalize"
                              >
                                {bezirk}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        filter === "pinnedPosts" && (
                          <input
                            type="checkbox"
                            name="pinnedPosts"
                            onChange={(e) =>
                              handleAddFilter("pinnedPosts", e.target.value)
                            }
                          />
                        )
                      )}
                    </FiltersInput>
                  )}
                </React.Fragment>
              ))}
            </div>
          </ScrollableContainer>
        </article>
        <div className="flex flex-col items-center gap-2">
          <button
            className="w-full p-2 rounded bg-hh-700 hover:bg-hh-800 active:bg-hh-600 text-white font-semibold"
            onClick={() => handleSetFilters()}
          >
            SET FILTERS
          </button>
          <button
            className="w-fit hover:underline hover:underline-offset-2 hover:font-bold font-semibold text-hh-800 hover:text-hh-900 active:text-hh-700"
            onClick={removeAllFilters}
          >
            Remove all filters
          </button>
        </div>
      </div>
    </>
  );
}
