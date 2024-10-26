"use client";
import ArrowGallery from "@app/components/ArrowGallery";
import FlohmarktPoster from "@app/components/FlohmarktPoster";
import SpielplatzPoster from "@app/components/SpielplatzPoster";
import { isTypeSpielplatz } from "@app/utils/functions";
import { iFlohmarkt, iSpielplatz } from "@app/utils/types";
import React, { useCallback, useMemo, useRef } from "react";

export default function ArrowGalleryContainer<
  T extends iSpielplatz[] | iFlohmarkt[],
>({ list }: { list: T }) {
  const originalList = useRef(list || []);
  const randomSPGeraeteIndex = useRef(Math.random());
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleIndex = useCallback((direction: "next" | "back") => {
    if (direction === "next") {
      setCurrentIndex((prev) => (prev + 1) % originalList.current.length);
    } else {
      setCurrentIndex((prev) =>
        prev === 0 ? originalList.current.length - 1 : prev - 1
      );
    }
  }, []);

  const article = useMemo(() => {
    if (originalList.current.length === 0) return undefined;
    const type = isTypeSpielplatz(originalList.current[0])
      ? "spielplatz"
      : "flohmarkt";
    const currentArticle = originalList.current[currentIndex];

    const image = currentArticle.image ? currentArticle.image[0] : undefined;
    return { currentArticle, type, image };
  }, [currentIndex]);
  if (!article) return null;

  if (article.type === "spielplatz") {
    const {
      title,
      spielgeraete = [],
      bezirk,
      stadtteil,
    } = article.currentArticle as iSpielplatz;
    const { image } = article;

    const backupImg = ["spielplatz", ...(spielgeraete || [])][
      Math.floor(randomSPGeraeteIndex.current * spielgeraete?.length + 1) +
        currentIndex
    ];

    return (
      <ArrowGallery handleIndex={handleIndex} length={list.length}>
        <SpielplatzPoster
          bezirk={bezirk}
          stadtteil={stadtteil}
          title={title}
          backupImg={backupImg}
          image={image}
          spielgeraete={spielgeraete}
        />
      </ArrowGallery>
    );
  } else {
    const { currentArticle } = article;
    const { title, bezirk, date, id } = currentArticle as iFlohmarkt;
    const { image } = currentArticle as iFlohmarkt;

    return (
      <ArrowGallery handleIndex={handleIndex} length={list.length}>
        <FlohmarktPoster
          contain
          bezirk={bezirk}
          date={date}
          id={id}
          title={title}
          image={image}
        />
      </ArrowGallery>
    );
  }
}
