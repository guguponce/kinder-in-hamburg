"use client";
import React, { useLayoutEffect, useRef, useState } from "react";

export default function ExpandableContainer({
  children,
  type,
  contentHeight,
  initialHeight,
  shadow = true,
}: {
  type?:
    | "Spielplätze"
    | "Spielgeräte"
    | "Veranstaltungen"
    | "Aktivitäten"
    | "Flohmärkte"
    | "Posts"
    | "Events";
  shadow?: boolean;
  children: React.ReactNode;
  contentHeight: number;
  initialHeight: number;
}) {
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const handleOpen = () => {
    setOpen(true);
    setShowButton(false);
  };
  useLayoutEffect(() => {
    if (containerRef.current) {
      // Check if the content height exceeds the initial height
      const containerHeight = containerRef.current.scrollHeight;
      if (containerHeight > initialHeight) {
        setShowButton(true);
      }
    }
  }, [contentHeight, initialHeight]);
  return (
    <section
      id="spielplatz-spielgeraete-box"
      style={{
        height: open
          ? "fit-content"
          : contentHeight < initialHeight
            ? "fit-content"
            : `${initialHeight}px`,
      }}
      className={`${shadow && "shadow-lg"} relative mb-4 lg:mb-0 rounded-md p-2 bg-hh-200 bg-opacity-25 lg:max-w-full overflow-hidden`}
      ref={containerRef}
    >
      {children}
      <button
        onClick={handleOpen}
        className={`${
          showButton ? "flex" : "hidden"
        } absolute bottom-0 backdrop-blur-[1px] w-full h-12 from-hh-400 to-[#758CA370] bg-gradient-to-t items-center justify-center font-semibold text-hh-50 z-30 rounded`}
      >
        Alle {type || ""} anzeigen
      </button>
    </section>
  );
}
