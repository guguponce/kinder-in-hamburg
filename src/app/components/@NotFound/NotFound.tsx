import Link from "next/link";
import React from "react";
import ErrorContainer from "./ErrorContainer";

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
    | "event"
    | "spielplatzType";
}) {
  const text = {
    spielplatz: {
      title: multiples ? "Spielplätze" : "Spielplatz",
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
    event: {
      title: multiples ? "Veranstaltungen" : "Veranstaltung",
      text: "Schaue dich mal unsere aktiven Veranstaltungen an",
      linkText: "Alle Veranstaltungen",
      link: "/events",
    },
    flohmarkt: {
      title: multiples ? "Flohmärkte" : "Flohmarkt",
      text: "Schaue dich mal unsere aktiven Flohmärkte an",
      linkText: "Alle Flohmärkte",
      link: "/flohmaerkte",
    },
    post: {
      title: multiples ? "Posts" : "Post",
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
    <ErrorContainer as="main">
      <ErrorContainer.Title>
        {type && text[type].title} nicht gefunden
      </ErrorContainer.Title>
      <ErrorContainer.Text>
        {text[type].text || "Zurück zur Hauptseite"}
      </ErrorContainer.Text>
      <ErrorContainer.Link href={text[type].link || "/"}>
        {text[type]?.linkText || "Home"}
      </ErrorContainer.Link>
    </ErrorContainer>
  );
}
