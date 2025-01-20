"use client";
import CloseIcon2 from "@app/components/@Icons/CloseIcon2";
import React from "react";

export const FilterButton = ({
  filterType,
  filterValue,
  typeOnClick,
}: {
  filterType: string;
  filterValue: string;
  typeOnClick: () => void;
}) => {
  return (
    <button
      className="deleteFilterButton p-1 pl-2 border-2 border-positive-800 text-positive-900  font-semibold hover:bg-negative-500 hover:bg-opacity-25 hover:border-negative-800 hover:text-negative-800 focus:-outline-offset-1 focus-within:-outline-offset-1 focus-visible:-outline-offset-1 active:outline-offset-1 -800 focus:outline-negative-600 focus-within:outline-negative-600 focus-visible:outline-negative-600 rounded-full text-xs flex gap items-center
      focus:border-transparent
focus-within:border-transparent
focus-visible:border-transparent"
      onClick={typeOnClick}
    >
      <span>
        {filterType}: {filterValue}
      </span>
      <CloseIcon2 color="#33404d" size="20" />
    </button>
  );
};
