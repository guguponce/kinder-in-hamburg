import { cn } from "@app/utils/functions";
import React from "react";

export default function SearchInput({
  searchQuery,
  setSearchQuery,
  className,
}: {
  className?: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [currentSearchQuery, setCurrentSearchQuery] =
    React.useState(searchQuery);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (currentSearchQuery && currentSearchQuery !== searchQuery)
          setSearchQuery(currentSearchQuery);
      }}
      className={cn(
        "relative bg-white w-full gap-1 rounded-md grid items-center",
        className
      )}
      style={{ gridTemplateColumns: "1fr 40px" }}
      id="searchInputForm"
    >
      <input
        onChange={(e) => setCurrentSearchQuery(e.target.value)}
        id="searchQuery"
        tabIndex={0}
        className=" w-full h-full bg-transparent text-sm active p-2 rounded-[6px_0_0_6px] placeholder-hh-600"
        placeholder={searchQuery || "Suche"}
        type="search"
      />
      <button
        tabIndex={0}
        className="absolute end-0 flex h-full w-10 items-center justify-center rounded-[0_6px_6px_0] -outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="post search button"
        type="submit"
        title="Suche"
        onClick={() => {
          if (currentSearchQuery !== searchQuery)
            setSearchQuery(currentSearchQuery);
        }}
      >
        <img
          src="/assets/icons/searchIcon.svg"
          className="w-4 h-4"
          alt="search"
        />
      </button>
    </form>
  );
}
