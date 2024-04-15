"use client";
import React, { useState } from "react";
import PostLogo from "./@Icons/PostLogo";

type inputLabelType =
  | "categories"
  | "bezirk"
  | "fromAge"
  | "untilAge"
  | "search"
  | "pinnedPosts"
  | "free";
interface PostFormInputProps {
  inputID: string;
  inputLabel: string;
  children: React.ReactNode;
}

export default function FiltersInput({
  inputLabel,
  children,
}: PostFormInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full max-w-[300px] rounded bg-hh-100 bg-opacity-25 relative flex flex-col">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${
          isOpen ? "rounded-[4px_4px_0_0" : "rounded"
        } text-sm w-full font-semibold leading-7 w-fit capitalize flex justify-between items-center p-2 bg-hh-100 bg-opacity-25 hover:bg-opacity-50 transition-all duration-300 ease-in-out`}
      >
        <span className="leading-none">{inputLabel}</span>
        <span className={isOpen ? "" : "rotate-180"}>
          <PostLogo color="#33404D" size="0.75rem" logo="triangle" />
        </span>
      </button>
      {isOpen && <div className="w-full p-2">{children}</div>}
    </div>
  );
}
