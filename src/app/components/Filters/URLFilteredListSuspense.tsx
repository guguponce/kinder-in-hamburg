import React from "react";
import FilterIcon from "../@Icons/FilterIcon";
import LoadingIcon from "../@Icons/LoadingIcon";
import Button from "../@Buttons/Button";
import CardsIcon from "../@Icons/CardsIcon";
import MapIcon from "../@Icons/MapIcon";

export default function URLFilteredListSuspense() {
  return (
    <div className="flex gap-2 flex-wrap justify-center items-start w-full">
      <section className="flex flex-col gap-2 flex-grow bg-hh-100 rounded overflow-hidden relative min-h-[100vh] py-2">
        <div className="absolute left-0 top-2 h-10 py-8 px-2 z-50 flex justify-center items-center">
          <button
            tabIndex={0}
            disabled
            style={{ display: "grid", gridTemplateColumns: "1rem auto" }}
            className="transition-all  shadow items-center duration-150 ease-in transform overflow-hidden relative text-hh-200 hover:text-hh-50 bg-hh-800 hover:bg-hh-700 rounded text-sm h-10 px-2 py-1 opacity-100"
          >
            <span className="filterButtonIcon transition-opacity duration-75 ease-in-out">
              <FilterIcon rotate={90} color="#d0d7da" size="16" />
            </span>

            <span className="transition-opacity duration-75 ease-in-out mx-2 font-bold">
              Filter
            </span>
          </button>
        </div>
        <aside className="relative self-end flex flex-col gap-2 items-end sm:flex-row sm:justify-end sm:items-center px-2 sm:pb-2 pt-16 xs:pt-3 sm:pt-2 h-fit">
          <form
            className="relative bg-white w-full gap-1 rounded-md grid items-center max-w-[600px] sm:max-w-[300px] h-10  shadow focus-within:outline-hh-200 focus-within:outline-2 focus-within:outline"
            style={{ gridTemplateColumns: "1fr 40px" }}
            id="searchInputForm"
          >
            <input
              id="searchQuery"
              tabIndex={0}
              className=" w-full h-full bg-transparent text-sm active p-2 rounded-[6px_0_0_6px] placeholder-hh-600"
              placeholder="Suche"
              type="search"
              disabled
            />
            <button
              tabIndex={0}
              disabled
              className="absolute end-0 flex h-full w-10 items-center justify-center rounded-[0_6px_6px_0] -outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="post search button"
              type="submit"
            >
              <img
                src="/assets/icons/searchIcon.svg"
                className="w-4 h-4"
                alt="search"
              />
            </button>
          </form>
          <select
            name="order"
            id="order-select"
            defaultValue="Neueste"
            disabled
            className="px-2 py-1 ml-2 rounded-md font-semibold min-w-32 h-10 my-1 shadow"
          >
            <option value={"Neueste"}>Neueste</option>
          </select>
        </aside>
        <div className="flex flex-col md:flex-row items-center justify-end px-2 gap-2 w-full">
          <div className="flex items-center justify-center gap-2 w-full md:w-fit  md:flex-row">
            <Button className="text-hh-50 bg-opacity-75 active:bg-opacity-70 hover:bg-opacity-90 focus:bg-opacity-90 focus-visible:bg-opacity-90 focus:outline-hh-50 focus-visible:outline-hh-50 flex-grow h-10 w-fit max-w-full p-2 bg-hh-800 hover:bg-hh-800 active:bg-hh-800 font-semibold rounded flex items-center justify-center gap-2">
              <CardsIcon color="#e1e4e5" size="1.5rem" /> Liste
            </Button>
            <Button className="bg-opacity-10 -outline-offset-2 text-hh-900 active:bg-opacity-29 hover:bg-opacity-40 focus:bg-opacity-40 focus-visible:bg-opacity-40 focus:outline-hh-50 focus-visible:outline-hh-50 outline-2 outline outline-hh-900 flex-grow h-10 w-fit max-w-full p-2 bg-hh-800 hover:bg-hh-800 active:bg-hh-800 font-semibold rounded flex items-center justify-center gap-2">
              <MapIcon size="1.5rem" /> Karte
            </Button>
          </div>
        </div>
        <article className="flex flex-col w-full flex-grow p-2 pt-0">
          <div
            className={`rounded-lg bg-hh-100 gap-2 lg:gap-8 flex-grow h-full overflow-auto p-2 lg:p-4 w-full grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] justify-items-center`}
            style={{
              boxShadow:
                "inset 4px 4px 8px #bfc2c3, inset -4px -4px 8px #ffffff",
            }}
          >
            <LoadingIcon size="64" className="animate-spin" />
          </div>
        </article>
      </section>
    </div>
  );
}
