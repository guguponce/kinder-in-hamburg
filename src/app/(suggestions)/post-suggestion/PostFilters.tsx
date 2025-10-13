"use client";
import {
  createArrayQueryString,
  createQueryString,
} from "@app/components/Filters/filterFunctions";
import CloseIcon from "@components/@Icons/CloseIcon";
import FilterIcon from "@components/@Icons/FilterIcon";
import ScrollableContainer from "@components/ScrollableContainer";
import { cn } from "@app/utils/functions";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { spielgeraeteDisplay } from "@app/utils/constants";

interface iPostFilters {
  params: string;
  type?: "categories" | "bezirke" | "type";
  queryFromType?: string;
  availableCategories: string[];
  categoriesFilter: string[];
  setCategoriesFilter: React.Dispatch<React.SetStateAction<string[]>>;
  availableBezirke: string[];
  bezirkeFilter: string[];
  setBezirkeFilter: React.Dispatch<React.SetStateAction<string[]>>;
  availableStadtteile: Record<string, string[]>;
  stadtteileFilter: string[];
  setStadtteileFilter: React.Dispatch<React.SetStateAction<string[]>>;
  queryAlter: string;
  setQueryAlter: React.Dispatch<React.SetStateAction<string>>;
  children?: React.ReactNode;
  categoriesFilteringTogether: boolean;
  setCategoriesFilteringTogether: React.Dispatch<React.SetStateAction<boolean>>;
  resetFilters?: () => void;
  setSpielgeraeteFilteringTogether?: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  spielgeraeteFilteringTogether?: boolean;
  spielgeraeteFilter?: string[];
  setSpielgeraeteFilter?: React.Dispatch<React.SetStateAction<string[]>>;
}
const FiltersBox = ({
  title,
  children,
  disabled = false,
  open = false,
  boxStyle,
}: {
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  open?: boolean;
  boxStyle?: string;
}) => {
  const [isOpen, setIsOpen] = useState(!disabled ? false : open);
  return (
    <div
      style={{
        transition: "max-height 0.5s ease-in-out",
      }}
      tabIndex={-1}
      className={cn(
        `mb-2 w-full flex flex-col gap-1 pb-1 cursor-default overflow-hidden text-hh-800 focus-visible:outline-2 focus-visible:outline-hh-950 focus-visible:outline-offset-2 rounded-lg ${isOpen && !disabled ? "h-fit outline-hh-800 outline outline-2 -outline-offset-1" : "h-10"}`,
        boxStyle
      )}
    >
      <button
        disabled={disabled}
        className={cn(
          " capitalize min-h-10 flex justify-between gap-x-1 items-center py-1 px-2 bg-hh-800 bg-opacity-90 text-hh-50 text-sm",
          isOpen && !disabled
            ? "hover:bg-opacity-80 focus-within:rounded-[0.5rem_0.5rem_0_0]"
            : `${
                disabled
                  ? "bg-opacity-20 opacity-75 text-hh-800 flex-wrap py-0"
                  : "hover:bg-opacity-100"
              } rounded-lg`
        )}
        style={{
          outlineColor: isOpen ? "#d0d7da" : "#33404D",
          outlineOffset: isOpen ? "-4px" : "-2px",
        }}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={open || isOpen ? 0 : -1}
      >
        <span className="font-semibold">{title}</span>
        <span
          className={
            isOpen
              ? "font-semibold"
              : title === "Stadtteile"
                ? "text-[10px] text-end font-semibold"
                : "text-lg font-bold px-[2px]"
          }
        >
          {isOpen ? "—" : disabled ? "(Wähl zuerst einen Bezirk)" : "+"}
        </span>
      </button>
      {isOpen && children}
    </div>
  );
};

const FiltersCheckBox = ({
  title,
  children,
  open = false,
}: {
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div
      style={{
        transition: "max-height 0.5s ease-in-out",
      }}
      tabIndex={-1}
      className={`m-1 w-full flex flex-col gap-1 overflow-hidden text-hh-800 rounded ${isOpen ? "h-fit outline-hh-100 outline outline-2 -outline-offset-1 pb-1" : "h-8"}`}
    >
      <button
        className={`flex justify-between items-center p-1 bg-hh-800 text-sm text-hh-800 ${isOpen ? "bg-opacity-15 hover:bg-opacity-25" : "hover:bg-opacity-40 bg-opacity-25 rounded-[0_0_4px_4px]"}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={open && isOpen ? 0 : -1}
      >
        <span className="font-semibold">{title}</span>
        <span className="font-semibold flex justify-center w-4">
          {isOpen ? "—" : "+"}
        </span>
      </button>
      {children}
    </div>
  );
};

export default function PostFilters({
  children,
  resetFilters,
  params,
  availableCategories,
  categoriesFilter,
  setCategoriesFilter,
  availableBezirke,
  bezirkeFilter,
  setBezirkeFilter,
  availableStadtteile,
  stadtteileFilter,
  setStadtteileFilter,
  queryAlter,
  setQueryAlter,
  setSpielgeraeteFilteringTogether,
  spielgeraeteFilteringTogether,
  spielgeraeteFilter,
  setSpielgeraeteFilter,
  type,
  queryFromType,
  categoriesFilteringTogether,
  setCategoriesFilteringTogether,
}: iPostFilters) {
  const { push } = useRouter();
  const modifyURL = useCallback(
    (queries: string) => push(params + "?" + queries, { scroll: false }),
    [params, push]
  );
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAlleAlterChecked, setIsAlleAlterChecked] = React.useState(true);
  const filterBlock = React.useRef<HTMLDivElement>(null);
  const resetFiltersButtonRef = React.useRef<HTMLButtonElement>(null);
  // Close filter on outside click
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!filterBlock.current) return;
      if (resetFiltersButtonRef.current?.contains(event.target as Node)) return;
      if (filterBlock.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleCheckboxChange = () => {
    if (isAlleAlterChecked) {
      setQueryAlter("0");
    } else {
      setQueryAlter("");
    }
    setIsAlleAlterChecked(!isAlleAlterChecked);
  };
  useEffect(() => {
    if (queryAlter === "") setIsAlleAlterChecked(true);
  }, [queryAlter]);
  const decodedParamQuery = queryFromType && decodeURIComponent(queryFromType);
  return (
    <>
      <div className="absolute left-0 top-2 h-10 py-8 px-2 z-50 flex justify-center items-center">
        <button
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: "grid", gridTemplateColumns: "1rem auto" }}
          className={`transition-all  shadow items-center duration-150 ease-in transform overflow-hidden relative text-hh-200 hover:text-hh-50 bg-hh-800 hover:bg-hh-700 rounded text-sm ${!isOpen ? "h-10 px-2 py-1 opacity-100" : "w-0 h-full opacity-0"}`}
        >
          <span
            className="filterButtonIcon transition-opacity duration-75 ease-in-out"
            style={{ opacity: isOpen ? "0" : "1" }}
          >
            <FilterIcon rotate={90} color="#d0d7da" size="16" />
          </span>

          <span
            className="transition-opacity duration-75 ease-in-out mx-2 font-bold"
            style={{ opacity: isOpen ? "0" : "1" }}
          >
            Filter
          </span>
        </button>
      </div>
      <aside
        id="filterBlock"
        ref={filterBlock}
        className={`top-0 w-1/2 max-w-[300px] h-full z-50 bg-hh-300 bg-opacity-80 backdrop-blur-sm transition-all duration-500 ease-in-out transform absolute flex flex-col gap-2 items-center ${isOpen ? "left-0" : "-left-full"}`}
        tabIndex={-1}
      >
        <div
          className={`w-full flex items-center ${resetFilters ? "justify-between" : "justify-end"} h-8 pt-2 px-2`}
        >
          <button
            ref={resetFiltersButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              if (resetFilters) resetFilters();
              handleCheckboxChange();
            }}
            className={`text-xs text-hh-50 bg-negative-700 rounded p-1 ${resetFilters ? "hover:bg-negative-800" : "opacity-0 pointer-events-none"}`}
            tabIndex={isOpen ? 0 : -1}
          >
            Filter löschen
          </button>
          <button onClick={() => setIsOpen(!isOpen)} tabIndex={isOpen ? 0 : -1}>
            <CloseIcon
              size="16"
              color="#33404D"
              className="rounded overflow-hidden hover:fill-hh-900"
            />
          </button>
        </div>
        <ScrollableContainer
          vertical
          containerStyle="justify-start flex-col max-h-full flex-grow gap-0"
          boxStyle="h-fit block overflow-y-auto pt-1 px-2"
        >
          <FiltersBox title="Kategorien" open={isOpen}>
            <>
              <div className="flex flex-wrap gap-2 p-1">
                <div className="flex flex-wrap gap-2  ">
                  {!!decodedParamQuery && (
                    <div
                      className="px-1 bg-hh-800 text-hh-50 rounded text-xs border-2 border-hh-800 
                      bg-opacity-100"
                    >
                      {decodedParamQuery}
                    </div>
                  )}
                  {availableCategories.map((cat) =>
                    cat === decodedParamQuery ? null : (
                      <button
                        tabIndex={isOpen ? 0 : -1}
                        key={cat}
                        onClick={() => {
                          modifyURL(
                            createArrayQueryString(
                              "categories",
                              cat,
                              categoriesFilter,
                              new URLSearchParams(searchParams.toString())
                            )
                          );
                          setCategoriesFilter((prev) => {
                            if (prev.includes(cat)) {
                              return prev.filter((v) => v !== cat);
                            }
                            return [...prev, cat];
                          });
                        }}
                        className={`px-1 bg-hh-800 text-hh-50 rounded text-xs border-2 capitalize border-hh-800 ${
                          categoriesFilter.includes(cat)
                            ? "bg-opacity-100 hover:bg-opacity-90"
                            : "bg-opacity-50 hover:bg-opacity-60"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full px-1">
                <div
                  className="grid items-center gap-2 p-1 h-10"
                  style={{ gridTemplateColumns: "min-content auto" }}
                >
                  <button
                    tabIndex={isOpen ? 0 : -1}
                    className="relative p-1 rounded-2xl h-5 w-10 bg-hh-800 flex items-center transition-all"
                    onClick={() =>
                      setCategoriesFilteringTogether((prev) => !prev)
                    }
                  >
                    <span
                      className={cn(
                        "bg-hh-100 rounded-full w-4 h-4 absolute top-1/2  -translate-y-1/2 transition-all duration-300",
                        categoriesFilteringTogether
                          ? "translate-x-1/4 left-0"
                          : "-translate-x-full left-[calc(100%-0.25rem)]"
                      )}
                    />
                  </button>

                  <span className="text-[10px] font-bold">
                    {categoriesFilteringTogether
                      ? "Alle Kategorien erfüllen"
                      : "Mindestens eine Kategorie erfüllt"}
                  </span>
                </div>
                <p className="text-[10px] text-hh-950 px-1">
                  {categoriesFilteringTogether
                    ? "Zeigt nur Orte, die allen ausgewählten Kategorien entsprechen."
                    : "Zeigt Orte, die mindestens einer der ausgewählten Kategorien entsprechen."}
                </p>
              </div>
            </>
          </FiltersBox>
          {type !== "bezirke" && (
            <FiltersBox title="Bezirke" open={isOpen}>
              <div className="flex flex-wrap gap-2 p-1">
                {availableBezirke.map((bz) => (
                  <button
                    tabIndex={isOpen ? 0 : -1}
                    key={bz}
                    onClick={() => {
                      modifyURL(
                        createArrayQueryString(
                          "bezirke",
                          bz,
                          bezirkeFilter,
                          new URLSearchParams(searchParams.toString())
                        )
                      );
                      setBezirkeFilter((prev) => {
                        if (prev.includes(bz)) {
                          return prev.filter((v) => v !== bz);
                        }
                        return [...prev, bz];
                      });
                    }}
                    className={`px-1 bg-hh-800 text-hh-50 rounded text-xs border-2 border-hh-800 ${
                      bezirkeFilter.includes(bz)
                        ? "bg-opacity-100 hover:bg-opacity-90"
                        : "bg-opacity-50 hover:bg-opacity-60"
                    }`}
                  >
                    {bz}
                  </button>
                ))}
              </div>
            </FiltersBox>
          )}

          <FiltersBox
            title="Stadtteile"
            disabled={!bezirkeFilter.length}
            boxStyle="gap-0"
            open={isOpen}
          >
            <div className="flex flex-wrap gap-2 p-1">
              {Object.entries(availableStadtteile).map(
                ([bezirk, stadtteile]) => (
                  <React.Fragment key={bezirk}>
                    <FiltersCheckBox title={bezirk} open>
                      {stadtteile.map((stadtteil) => (
                        <div key={stadtteil} className="flex gap-2 px-1">
                          <input
                            tabIndex={isOpen ? 0 : -1}
                            type="checkbox"
                            name={stadtteil}
                            id={stadtteil}
                            value={stadtteil}
                            onChange={() => {
                              modifyURL(
                                createArrayQueryString(
                                  "stadtteile",
                                  stadtteil,
                                  stadtteileFilter,
                                  new URLSearchParams(searchParams.toString())
                                )
                              );
                              setStadtteileFilter((prev) => {
                                if (prev.includes(stadtteil)) {
                                  return prev.filter((v) => v !== stadtteil);
                                }
                                return [...prev, stadtteil];
                              });
                            }}
                          />
                          <label
                            htmlFor={stadtteil}
                            className={`text-hh-900 text-xs${
                              stadtteileFilter.includes(stadtteil)
                                ? "opacity-100 font-semibold"
                                : "opacity-90"
                            }`}
                          >
                            {stadtteil}
                          </label>
                        </div>
                      ))}
                    </FiltersCheckBox>
                  </React.Fragment>
                )
              )}
            </div>
          </FiltersBox>
          <FiltersBox title="Alter" open={isOpen}>
            <div className="flex flex-col px-2">
              <label
                htmlFor="any-alter"
                className="font-semibold text-xs xs:text-sm sm:text-base flex items-center gap-1 mb-2"
              >
                <input
                  type="checkbox"
                  id="any-alter"
                  onChange={handleCheckboxChange}
                  checked={isAlleAlterChecked}
                />{" "}
                Alle Altersgruppen
              </label>
              <div className="flex flex-col items-center relative mb-4">
                <div className="relative w-full flex justify-between text-sm sm:text-base">
                  <span>0</span>
                  <span>27</span>
                </div>
                <input
                  tabIndex={isOpen ? 0 : -1}
                  type="range"
                  placeholder="Alter"
                  value={queryAlter || ""}
                  min={0}
                  max={27}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAlleAlterChecked)
                      setQueryAlter(!!queryAlter ? queryAlter : "5");
                  }}
                  onChange={(e) => {
                    modifyURL(
                      createQueryString(
                        "alter",
                        e.target.value,
                        new URLSearchParams(searchParams.toString())
                      )
                    );
                    setIsAlleAlterChecked(false);
                    setQueryAlter(e.target.value);
                  }}
                  className={`alterRange w-full ${isAlleAlterChecked ? "opacity-50" : ""}`}
                />
                <span
                  className={`alterRangeTag absolute -bottom-5 text-red-800 font-bold z-30`}
                  style={{
                    left: `calc(${(parseInt(queryAlter) / 27) * 100}% - ${(parseInt(queryAlter) / 27) * 1}rem)`,
                  }}
                >
                  {queryAlter}
                </span>
              </div>

              {/* {!!queryAlter && (
                <p className="font-semibold text-sm">
                  Alter: {queryAlter} Jahr{queryAlter !== "1" && "e"} Alt
                </p>
              )} */}
            </div>
          </FiltersBox>
          {setSpielgeraeteFilter && (
            <FiltersBox title="Spielgeräte" open={isOpen}>
              <>
                <div className="flex flex-wrap gap-1 p-1">
                  {(
                    [
                      ...Object.entries(spielgeraeteDisplay["arrays"]),
                      ["Andere", spielgeraeteDisplay.singles],
                      ["Sports", spielgeraeteDisplay.sport],
                    ] as [string, string[]][]
                  ).map(([key, val], i) => (
                    <div
                      key={key}
                      className={cn(
                        "flex flex-col gap-2 p-1 border-hh-800 rounded w-full",
                        i % 2 ? "bg-hh-800 bg-opacity-25 items-end" : "border-2"
                      )}
                    >
                      {val.map((spg) =>
                        spg === decodedParamQuery ? null : (
                          <button
                            tabIndex={isOpen ? 0 : -1}
                            key={spg}
                            onClick={() => {
                              // modifyURL(
                              //   createArrayQueryString(
                              //     "categories",
                              //     spg,
                              //     categoriesFilter,
                              //     new URLSearchParams(searchParams.toString())
                              //   )
                              // );

                              setSpielgeraeteFilter &&
                                setSpielgeraeteFilter((prev) => {
                                  console.log(spg, prev);
                                  if (prev.includes(spg)) {
                                    return prev.filter((v) => v !== spg);
                                  }
                                  return [...prev, spg];
                                });
                            }}
                            className={`w-fit mx-1 px-1 bg-hh-800 text-hh-50 rounded text-xs border-2 capitalize border-hh-800 ${
                              spielgeraeteFilter?.includes(spg)
                                ? "bg-opacity-100 hover:bg-opacity-90"
                                : "bg-opacity-50 hover:bg-opacity-60"
                            }`}
                          >
                            {spg}
                          </button>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col w-full px-1">
                  <div
                    className="grid items-center gap-2 p-1 h-10"
                    style={{ gridTemplateColumns: "min-content auto" }}
                  >
                    <button
                      tabIndex={isOpen ? 0 : -1}
                      className="relative p-1 rounded-2xl h-5 w-10 bg-hh-800 flex items-center transition-all"
                      onClick={() => {
                        setSpielgeraeteFilteringTogether &&
                          setSpielgeraeteFilteringTogether((prev) => !prev);
                      }}
                    >
                      <span
                        className={cn(
                          "bg-hh-100 rounded-full w-4 h-4 absolute top-1/2  -translate-y-1/2 transition-all duration-300",
                          spielgeraeteFilteringTogether
                            ? "translate-x-1/4 left-0"
                            : "-translate-x-full left-[calc(100%-0.25rem)]"
                        )}
                      />
                    </button>

                    <span className="text-[10px] font-bold">
                      {spielgeraeteFilteringTogether
                        ? "Alle Spielgeräte erfüllen"
                        : "Mindestens ein Spielgerät erfüllt"}
                    </span>
                  </div>
                  <p className="text-[10px] text-hh-950 px-1">
                    {spielgeraeteFilteringTogether
                      ? "Zeigt nur Spielplätze, die allen ausgewählten Spielgeräten entsprechen."
                      : "Zeigt Spielplätze, die mindestens einer der ausgewählten Spielgeräte entsprechen."}
                  </p>
                </div>
              </>
            </FiltersBox>
          )}
        </ScrollableContainer>
      </aside>
    </>
  );
}
