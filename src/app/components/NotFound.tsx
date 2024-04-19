import Link from "next/link";
import React from "react";

export default function NotFound({
  type = "post",
  multiples,
}: {
  multiples?: boolean;
  type?: "flohmarkt" | "post" | "categories" | "bezirk";
}) {
  const text = {
    flohmarkt: {
      title: "Flea market",
      text: "Check out our active flea markets",
      linkText: "All Flea Markets",
      link: "/flohmaerkte",
    },
    post: {
      title: "Post",
      text: "Check out our active posts",
      linkText: "All Posts",
      link: "/posts",
    },
    categories: {
      title: "Category",
      text: "Check out our active categories",
      linkText: "All Categories",
      link: "/categories",
    },
    bezirk: {
      title: "Bezirk",
      text: "Check out our active Bezirke",
      linkText: "All Bezirke",
      link: "/bezirke",
    },
  };
  return (
    <main className="flex flex-col items-center justify-center p-6 rounded-md bg-hh-100 w-[500px] max-w-full m-2 gap-4">
      <h2 className="text-lg font-bold text-hh-950">
        {type && text[type].title}
        {multiples ? "s" : ""} not found
      </h2>
      <p className="text-base text-hh-600">
        {text[type].text || "Get back to the main page"}
      </p>
      <Link
        className="p-2 rounded-md bg-hh-800 hover:bg-hh-700 active:bg-hh-600 text-white"
        href={text[type].link || "/"}
      >
        {text[type]?.linkText || "Home"}
      </Link>
    </main>
  );
}
