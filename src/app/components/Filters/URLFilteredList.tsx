"use client";
import { iBezirk, iPost } from "@app/utils/types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CardsListDisplay from "@components/@Cards/CardsListDisplay";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PostsFilter from "@app/(suggestions)/post-suggestion/PostFilters";
import {
  createArrayQueryString,
  createQueryString,
  filterAlterFX,
  filterBezirkeFX,
  filterCategoriesFX,
  filteredBySearchFX,
  filterStadtteileFX,
  orderListFx,
  removeFilter,
  getAvailableStadtteile,
  getAvailableBezirke,
  getAvailableCategories,
  orderOptionsNames,
  orderOptions,
  isTypeOrder,
  orderType,
} from "../../(blog)/posts/filterFunctions";
import { FilterButton } from "../../(blog)/posts/DeleteFilters";
import SearchInput from "../../(blog)/posts/SearchInput";
import CloseIcon2 from "@app/components/@Icons/CloseIcon2";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import dynamic from "next/dynamic";
import Button from "../@Buttons/Button";
import CardsIcon from "../@Icons/CardsIcon";
import MapIcon from "../@Icons/MapIcon";

const DynamicGeneralMap = dynamic(
  () => import("@app/components/@Map/GeneralMap"),
  {
    ssr: false,
  }
);
const CardsListDisplayMemo = React.memo(CardsListDisplay);

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

  // STATE
  const [maxDisplay, setMaxDisplay] = useState(24);
  const [maxDisplayable, setMaxDisplayable] = useState(postsList.length);
  const { current: postsListRef } = useRef([...postsList]);

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );
  const [bezirkeFilter, setBezirkeFilter] = useState<Array<string>>(
    searchParams.getAll("bezirke").map((b) => decodeURIComponent(b))
  );
  const [stadtteileFilter, setStadtteileFilter] = useState<Array<string>>(
    searchParams.getAll("stadtteile").map((b) => decodeURIComponent(b))
  );
  const [categoriesFilter, setCategoriesFilter] = useState<Array<string>>(
    searchParams.getAll("categories").map((b) => {
      return decodeURIComponent(b);
    })
  );
  const [queryAlter, setQueryAlter] = useState(searchParams.get("alter") || "");
  const [showMap, setShowMap] = useState(false);
  const { current: orderParam } = useRef(
    isTypeOrder(searchParams.get("order"))
      ? (searchParams.get("order") as orderType)
      : "neueste"
  );

  const [order, setOrder] = useState<orderType>(orderParam || "neueste");

  const [categoriesFilteringTogether, setCategoriesFilteringTogether] =
    useState<boolean>(false);

  // FUNCTIONS

  // MEMOIZED VALUES
  const orderedList = useMemo(
    () => orderListFx(postsListRef, order),
    [postsListRef, order]
  );
  const filteredBySearch = useMemo(
    () => filteredBySearchFX(orderedList, searchQuery),
    [orderedList, searchQuery]
  );
  const filteredByAlter = useMemo(
    () => filterAlterFX(filteredBySearch, queryAlter),
    [filteredBySearch, queryAlter]
  );
  const filteredByBezirke = useMemo(
    () => filterBezirkeFX(filteredByAlter, bezirkeFilter),
    [filteredByAlter, bezirkeFilter]
  );
  const filteredByStadtteile = useMemo(
    () => filterStadtteileFX(filteredByBezirke, stadtteileFilter),
    [filteredByBezirke, stadtteileFilter]
  );
  const filteredByCategories = filterCategoriesFX(
    filteredByStadtteile,
    categoriesFilter,
    categoriesFilteringTogether
  );
  const displayList = useMemo(() => {
    return [...filteredByCategories].slice(0, maxDisplay);
  }, [filteredByCategories, maxDisplay]);

  useEffect(() => {
    setMaxDisplayable(filteredByCategories.length);
  }, [filteredByCategories]);

  const { current: availableBezirke } = useRef(
    getAvailableBezirke(postsListRef)
  );
  const availableStadtteile = useMemo(() => {
    if (!!bezirkeFilter.length)
      return getAvailableStadtteile(postsListRef, bezirkeFilter as iBezirk[]);

    setStadtteileFilter([]);
    createArrayQueryString(
      "stadtteile",
      "",
      [],
      new URLSearchParams(searchParams.toString())
    );
    return {};
  }, [bezirkeFilter, postsListRef, searchParams]);

  const availableCategories = useMemo(
    () =>
      getAvailableCategories(
        categoriesFilteringTogether ? filteredByCategories : postsListRef
      ),
    [filteredByCategories, categoriesFilteringTogether, postsListRef]
  );
  console.log(postsListRef, filteredByCategories.length, availableCategories);
  const resetFilters = useCallback(() => {
    setCategoriesFilter([]);
    setBezirkeFilter([]);
    setStadtteileFilter([]);
    setQueryAlter("");
    setSearchQuery("");
    setOrder("neueste");
    router.push(params, { scroll: false });
  }, [params, router]);
  const anyFilterUsed = useMemo(
    () =>
      !!searchQuery ||
      !!bezirkeFilter.length ||
      !!categoriesFilter.length ||
      !!queryAlter,
    [searchQuery, bezirkeFilter, categoriesFilter, queryAlter]
  );
  if (!postsListRef) return <div>There was a problem retrieving posts</div>;
  return (
    <div className="flex gap-2 flex-wrap justify-center items-start w-full">
      <section className="flex flex-col gap-2 flex-grow bg-hh-100 rounded overflow-hidden relative min-h-[100vh] py-2">
        <PostsFilter
          resetFilters={anyFilterUsed ? resetFilters : undefined}
          params={params}
          type={
            type === "categories" || type === "bezirke"
              ? (p as "categories" | "bezirke")
              : undefined
          }
          queryFromType={p}
          availableCategories={availableCategories}
          categoriesFilter={categoriesFilter}
          setCategoriesFilter={setCategoriesFilter}
          availableBezirke={availableBezirke}
          bezirkeFilter={bezirkeFilter}
          setBezirkeFilter={setBezirkeFilter}
          availableStadtteile={availableStadtteile}
          stadtteileFilter={stadtteileFilter}
          setStadtteileFilter={setStadtteileFilter}
          queryAlter={queryAlter}
          setQueryAlter={setQueryAlter}
          categoriesFilteringTogether={categoriesFilteringTogether}
          setCategoriesFilteringTogether={setCategoriesFilteringTogether}
        />
        <aside className="relative self-end flex flex-col gap-2 items-end sm:flex-row sm:justify-end sm:items-center px-2 sm:pb-2 pt-16 xs:pt-3 sm:pt-2 h-fit">
          <SearchInput
            className="max-w-[600px] sm:max-w-[300px] h-10  shadow focus-within:outline-hh-200 focus-within:outline-2 focus-within:outline"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <select
            name="order"
            id="order-select"
            value={order}
            className="px-2 py-1 ml-2 rounded-md font-semibold min-w-fit h-10 my-1 shadow"
            onChange={(e) => {
              const val = e.target.value as orderType;
              setOrder(val);
              router.push(
                params +
                  "?" +
                  createQueryString(
                    "order",
                    val,
                    new URLSearchParams(searchParams.toString())
                  ),
                { scroll: false }
              );
            }}
          >
            {orderOptions.map((opt) => (
              <option key={opt} value={opt}>
                {orderOptionsNames[opt]}
              </option>
            ))}
          </select>
        </aside>
        <div className="flex flex-col md:flex-row items-center justify-end px-2 gap-2 w-full">
          {anyFilterUsed && (
            <div className="flex-grow self-stretch flex flex-col gap-1 rounded bg-hh-300 bg-opacity-75 p-1  mx-2">
              <div className="px-1 flex flex-wrap-reverse gap-2 items-center">
                <h4 className="font-semibold">Angewendete Filter:</h4>
                <button
                  onClick={resetFilters}
                  className="deleteFilterButton p-[2px] pl-2 ml-auto bg-negative-500 text-hh-50  font-semibold hover:bg-negative-500 hover:bg-opacity-25 hover:border-negative-800 hover:text-negative-800 focus:-outline-offset-1 focus-within:-outline-offset-1 focus-visible:-outline-offset-1 active:outline-offset-1 -800 focus:outline-negative-600 focus-within:outline-negative-600 focus-visible:outline-negative-600 rounded-full text-xs flex gap items-center focus:border-transparent focus-within:border-transparent focus-visible:border-transparent transition-all"
                >
                  <span className="hidden xs:inline pr-1">Alle</span>
                  <span>zurücksetzen</span>
                  <CloseIcon2
                    color="#f0f1f2 "
                    size="20"
                    className="transition-all"
                  />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {queryAlter && (
                  <FilterButton
                    filterType="Alter"
                    filterValue={queryAlter}
                    typeOnClick={() => {
                      removeFilter({
                        state: queryAlter,
                        stringStateSetter: setQueryAlter,
                        filterType: "alter",
                        value: "",
                        router,
                        params,
                        searchParams,
                      });
                    }}
                  />
                )}
                {!!searchQuery && (
                  <FilterButton
                    filterType="Suche"
                    filterValue={searchQuery}
                    typeOnClick={() => {
                      removeFilter({
                        state: searchQuery,
                        stringStateSetter: setSearchQuery,
                        filterType: "searchQuery",
                        value: "",
                        router,
                        params,
                        searchParams,
                      });
                    }}
                  />
                )}
                {!!bezirkeFilter.length &&
                  bezirkeFilter.map((bezirk) => (
                    <React.Fragment key={bezirk}>
                      <FilterButton
                        filterType="Bezirk"
                        filterValue={bezirk}
                        typeOnClick={() => {
                          removeFilter({
                            state: bezirkeFilter,
                            arrayStateSetter: setBezirkeFilter,
                            filterType: "bezirke",
                            value: bezirk,
                            router,
                            params,
                            searchParams,
                          });
                        }}
                      />
                    </React.Fragment>
                  ))}
                {!!stadtteileFilter.length &&
                  stadtteileFilter.map((st) => (
                    <React.Fragment key={st}>
                      <FilterButton
                        filterType="Stadtteil"
                        filterValue={st}
                        typeOnClick={() => {
                          removeFilter({
                            state: stadtteileFilter,
                            arrayStateSetter: setStadtteileFilter,
                            filterType: "stadtteile",
                            value: st,
                            router,
                            params,
                            searchParams,
                          });
                        }}
                      />
                    </React.Fragment>
                  ))}
                {!!categoriesFilter.length &&
                  categoriesFilter.map((bz) => (
                    <React.Fragment key={bz}>
                      <FilterButton
                        filterType="Kategorie"
                        filterValue={bz}
                        typeOnClick={() => {
                          removeFilter({
                            state: categoriesFilter,
                            arrayStateSetter: setCategoriesFilter,
                            filterType: "categories",
                            value: bz,
                            router,
                            params,
                            searchParams,
                          });
                        }}
                      />
                    </React.Fragment>
                  ))}
              </div>
            </div>
          )}
          <div
            className={`flex items-center justify-center gap-2 w-full md:w-fit ${anyFilterUsed ? "md:flex-col" : "md:flex-row"}`}
          >
            <Button
              onClick={() => setShowMap(false)}
              className={`${showMap ? "bg-opacity-10 -outline-offset-2 text-hh-900 active:bg-opacity-29 hover:bg-opacity-40 focus:bg-opacity-40 focus-visible:bg-opacity-40 focus:outline-hh-50 focus-visible:outline-hh-50 outline-2 outline outline-hh-900" : "text-hh-50 bg-opacity-75 active:bg-opacity-70 hover:bg-opacity-90 focus:bg-opacity-90 focus-visible:bg-opacity-90 focus:outline-hh-50 focus-visible:outline-hh-50"} flex-grow h-10 w-fit max-w-full p-2 bg-hh-800 hover:bg-hh-800 active:bg-hh-800 font-semibold rounded flex items-center justify-center gap-2`}
            >
              <CardsIcon color="#e1e4e5" size="1.5rem" /> Liste
            </Button>
            <Button
              onClick={() => setShowMap(true)}
              className={`${!showMap ? "bg-opacity-10 -outline-offset-2 text-hh-900 active:bg-opacity-20 hover:bg-opacity-40 focus:bg-opacity-40 focus-visible:bg-opacity-40 focus:outline-hh-50 focus-visible:outline-hh-50 outline-2 outline outline-hh-900" : "text-hh-50 bg-opacity-75 active:bg-opacity-70 hover:bg-opacity-90 focus:bg-opacity-90 focus-visible:bg-opacity-90 focus:outline-hh-50 focus-visible:outline-hh-50"} flex-grow h-10 w-fit max-w-full p-2 bg-hh-800 hover:bg-hh-800 active:bg-hh-800 font-semibold rounded flex items-center justify-center gap-2`}
            >
              <MapIcon color={showMap ? "#e1e4e5" : undefined} size="1.5rem" />{" "}
              Karte
            </Button>
          </div>
        </div>
        <article className="flex flex-col w-full flex-grow p-2 pt-0">
          {showMap ? (
            <div
              className="w-full aspect-[3/4] max-h-[75dvh] rounded-lg bg-hh-100 gap-2 lg:gap-8 min-h-[350px] overflow-auto p-2 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] justify-items-center"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #bfc2c3, inset -4px -4px 8px #ffffff",
              }}
            >
              <div className="w-full h-full rounded-md shadow-2xl overflow-hidden">
                <DynamicGeneralMap>
                  <MarkersLists lists={{ posts: displayList }} />
                </DynamicGeneralMap>
              </div>
            </div>
          ) : (
            <>
              <CardsListDisplayMemo cardPosts={displayList}>
                <button
                  onClick={resetFilters}
                  className="p-2 bg-negative-500 text-hh-50 rounded bg-opacity-50 hover:bg-opacity-75 m-1"
                >
                  Alle zurücksetzen
                </button>
              </CardsListDisplayMemo>

              {displayList.length < maxDisplayable && (
                <button
                  onClick={() => setMaxDisplay((prev) => prev + 12)}
                  className="p-2 bg-hh-700 text-hh-50 font-semibold rounded bg-opacity-25 hover:bg-opacity-50 "
                >
                  Mehr anzeigen
                </button>
              )}
            </>
          )}
        </article>
      </section>
    </div>
  );
}
