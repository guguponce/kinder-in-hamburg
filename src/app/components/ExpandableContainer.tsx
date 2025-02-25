"use client";
import React, { useLayoutEffect, useRef, useState } from "react";

export default function ExpandableContainer({
  children,
  type,
  contentHeight,
  initialHeight,
  shadow = true,
  displayButton,
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
  displayButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(!!displayButton);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const handleOpen = () => {
    setOpen(true);
    setShowButton(false);
  };
  useLayoutEffect(() => {
    if (containerRef.current) {
      // Check if the content height exceeds the initial height
      const containerHeight = containerRef.current.scrollHeight;
      console.log(displayButton, containerHeight, initialHeight);
      if (containerHeight > initialHeight && displayButton) {
        setShowButton(true);
      }
    }
  }, [contentHeight, initialHeight]);
  return (
    <section
      style={
        open || contentHeight < initialHeight || !showButton
          ? { height: "fit-content" }
          : { maxHeight: `${initialHeight}px` }
      }
      className={`expandable-container-box ${shadow && "shadow-lg"} relative mb-4 lg:mb-0 rounded-md p-2 bg-hh-200 bg-opacity-25 lg:max-w-full overflow-hidden`}
      ref={containerRef}
    >
      {children}
      <button
        onClick={handleOpen}
        className={`${
          showButton ? "flex" : "hidden"
        } absolute bottom-0 backdrop-blur-[1px] w-full h-12 left-0 from-hh-500 to-[#758CA370] bg-gradient-to-t items-center justify-center font-semibold text-hh-50 z-30 rounded`}
      >
        Alle {type || ""} anzeigen
      </button>
    </section>
  );
}
