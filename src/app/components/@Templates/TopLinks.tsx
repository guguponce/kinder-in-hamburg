import Link from "next/link";
import React from "react";

const BackButton = ({ type }: { type: "spielhaus" | "general" }) => (
  <>
    {type === "spielhaus" ? (
      <Link
        href={"/spielhaeuser"}
        className="text-sm px-2 py-1 hover:underline hover:underline-offset-4 min-w-fit transition-all rounded-md"
      >
        ← Alle Spielhäuser
      </Link>
    ) : (
      <Link
        href={"/posts"}
        className="text-sm px-2 py-1 hover:underline hover:underline-offset-4 min-w-fit transition-all rounded-md "
      >
        ← All Posts
      </Link>
    )}
  </>
);

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
      className="relative flex justify-between gap-4 w-full flex-col sm:flex-row text-hh-50"
    >
      <BackButton
        type={
          title.toLocaleLowerCase().includes("spielhaus")
            ? "spielhaus"
            : "general"
        }
      />
      {categories && (
        <div className="flex gap-1 items-center">
          <section
            id="categories"
            className={`flex justify-end gap-1 h-fit flex-wrap w-full ${
              pinnedPost && "sm:pr-12"
            }`}
          >
            {categories.map((cat) => (
              <h3
                className="px-2 py-1 h-fit w-fit text-end leading-tight rounded-md align-middle font-semibold bg-transparent transition-all hover:text-white hover:bg-hh-700"
                key={cat}
                // href={`/categories/${encodeURIComponent(cat)}`}
              >
                {cat}
              </h3>
            ))}
          </section>
        </div>
      )}
      {pinnedPost && (
        <div className="absolute flex self-start w-12 min-w-12 h-full border-0 m-0 -top-6 sm:-top-6 right-0">
          <img
            src="/assets/icons/bookmark.svg"
            alt="Pinned Post"
            className="w-full h-12"
          />
        </div>
      )}
    </div>
  );
}
