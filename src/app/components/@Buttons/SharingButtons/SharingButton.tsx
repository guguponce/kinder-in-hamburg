"use client";

import { useCallback } from "react";
import { cn } from "@app/utils/functions";
import { useSharingModal } from "./SharingModal";
import { usePathname } from "next/navigation";

const shareSVG = (color: string | undefined = "#33404D") => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

function getShareAlt(route: string | undefined): string {
  if (!route) {
    return "Teile diese Seite!";
  }

  if (/flohmaerkte\/\d+/.test(route)) {
    return "Teile diesen Flohmarkt!";
  }

  if (/posts\/\d+/.test(route)) {
    return "Teile diesen Ort!";
  }

  if (/spielplaetze\/\d+/.test(route)) {
    return "Teile diesen Spielplatz!";
  }

  if (/events\/\d+/.test(route)) {
    return "Teile dieses Event!";
  }

  return "Teile diese Seite!";
}
export const SharingButton = ({
  color,
  className,
}: {
  color?: string;
  className?: string;
}) => {
  const pathname = usePathname();
  const { openModal } = useSharingModal();
  const shareFunction = useCallback(async () => {
    if (!navigator.share) {
      await navigator.share({
        title: document.title,
        text: "Schau dir diese Seite an!",
        url: window.location.href,
      });
    } else {
      openModal();
    }
  }, [openModal]);
  return (
    <>
      <button
        onClick={shareFunction}
        className={cn(
          "w-8 h-8 p-2 rounded hover:bg-hh-50 hover:bg-opacity-20",
          className,
        )}
        title={getShareAlt(pathname)}
      >
        {shareSVG(color)}
      </button>
    </>
  );
};
