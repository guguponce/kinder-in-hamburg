import Link from "next/link";
import React from "react";

export default function NotFound({
  type = "post",
  multiples,
}: {
  multiples?: boolean;
  type?:
    | "flohmarkt"
    | "post"
    | "categories"
    | "bezirk"
    | "spielplatz"
    | "spielplatzType";
}) {
  const text = {
    spielplatz: {
      title: "Spielplatz",
      text: "Schaue dich mal unsere aktiven Spielplätze an",
      linkText: "Alle Spielplätze",
      link: "/spielplaetze",
    },

    spielplatzType: {
      title: "Spielplatz Type",
      text: "Schaue dich mal unsere aktiven Spielplätze an",
      linkText: "Alle Spielplätze",
      link: "/spielplaetze",
    },
    flohmarkt: {
      title: "Flohmarkt",
      text: "Schaue dich mal unsere aktiven Flohmärkte an",
      linkText: "Alle Flohmärkte",
      link: "/flohmaerkte",
    },
    post: {
      title: "Post",
      text: "Schaue dich mal unsere aktiven Posts an",
      linkText: "Alle Posts",
      link: "/posts",
    },
    categories: {
      title: "Category",
      text: "Schaue dich mal unsere aktiven Kategorien an",
      linkText: "Alle Kategorien",
      link: "/categories",
    },
    bezirk: {
      title: "Bezirk",
      text: "Schaue dich mal unsere aktiven Bezirke an",
      linkText: "Alle Bezirke",
      link: "/bezirke",
    },
  };
  return (
    <main className="flex flex-col items-center justify-center p-6 rounded-md bg-hh-100 w-[500px] max-w-full m-2 gap-4">
      <h2 className="text-lg font-bold text-hh-950">
        {type && text[type].title}
        {multiples ? "s" : ""} nicht gefunden
      </h2>
      <p className="text-base text-hh-600">
        {text[type].text || "Zurück zur Hauptseite"}
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
