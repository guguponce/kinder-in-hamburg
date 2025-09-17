import AdminServerComponent from "@app/providers/AdminServerComponents";
import { cn } from "@app/utils/functions";
import Link from "next/link";
import React from "react";

const BackButton = ({ type }: { type: "spielhaus" | "general" }) => {
  const className =
    "backButton relative h-fit text-xs py-1 hover:font-semibold  min-w-fit transition-all rounded-md flex justify-between";
  return (
    <>
      {type === "spielhaus" ? (
        <Link href={"/spielhaeuser"} className={cn("w-28", className)}>
          <span>←</span>{" "}
          <span className="flex-grow flex justify-center">
            Alle Spielhäuser
          </span>
        </Link>
      ) : (
        <Link href={"/posts"} className={cn("w-20", className)}>
          <span className="arrow absolute -translate-y-1/2 top-1/2 left-0 aspect-square h-[11px] flex outline-2 outline outline-transparent justify-center items-center rounded-full transition-all">
            ←
          </span>{" "}
          <span className="ml-3 flex-grow flex justify-center">Alle Posts</span>
        </Link>
      )}
    </>
  );
};

export default function TopLinks({
  title,
  categories,
  pinnedPost,
}: {
  title: string;
  categories?: string[];
  pinnedPost?: boolean;
}) {
  return (
    <div
      id="template-top-links"
      className="relative flex justify-between gap-2 sm:gap-4 w-full flex-col sm:flex-row text-hh-800"
    >
      <AdminServerComponent>
        <BackButton
          type={
            title.toLocaleLowerCase().includes("spielhaus")
              ? "spielhaus"
              : "general"
          }
        />
      </AdminServerComponent>
      {categories && (
        <section
          id="categories"
          className={`flex justify-center md:justify-end gap-1 h-fit flex-wrap w-full max-w-96 mx-auto sm:mx-0 sm:max-w-max rounded-md ${
            pinnedPost && "sm:pr-12"
          }`}
        >
          {categories.map((cat) => (
            <h3
              className="px-2 py-1 h-fit w-fit text-end leading-tight rounded-md bg-hh-800 bg-opacity-15 align-middle font-semibold transition-all"
              // className="px-2 py-1 h-fit w-fit text-end leading-tight rounded-md align-middle font-semibold transition-all bg-hh-800 bg-opacity-25 hover:text-white hover:bg-opacity-100"
              key={cat}
              // href={`/categories/${encodeURIComponent(cat)}`}
            >
              {cat}
            </h3>
          ))}
        </section>
      )}
      {pinnedPost && (
        <div className="absolute flex self-start w-12 min-w-12 h-full border-0 m-0 -top-4 -right-2">
          <img
            src="/assets/icons/bookmark.svg"
            alt="Pinned Post"
            className="w-full h-10 sm:h-12"
          />
        </div>
      )}
    </div>
  );
}
