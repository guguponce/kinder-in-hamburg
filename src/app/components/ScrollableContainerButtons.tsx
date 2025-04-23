"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Triangle from "./@Icons/TriangleIcon";
import { cn } from "@app/utils/functions";
const TriangleIcon = React.memo(Triangle);

export default function ScrollableContainerButtons({
  color,
  vertical,
}: {
  color: "300" | "500" | "800";
  vertical: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const checkIfScrollable = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current?.parentElement;
      const parent = scrollContainer?.firstElementChild;

      // Determine if the content overflows in either direction
      const isScrollableHorizontally =
        (parent?.scrollWidth || 0) >
        (parent?.clientWidth ? parent.clientWidth + 32 : 0);
      const isScrollableVertically =
        (parent?.scrollHeight || 0) > (parent?.clientHeight || 0);

      setIsScrollable(
        vertical ? isScrollableVertically : isScrollableHorizontally
      );
    }
  }, [vertical]);

  // Run check when component mounts or window is resized
  useEffect(() => {
    checkIfScrollable();
    const handleResize = () => {
      checkIfScrollable();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [checkIfScrollable]);
  return (
    <>
      <div
        ref={scrollRef}
        className={cn("absolute w-full h-full top-0 right-0 -z-50")}
      ></div>
      {isScrollable && (
        <>
          <button
            tabIndex={1}
            style={{ zIndex: 300 }}
            onClick={() => {
              if (scrollRef.current) {
                if (vertical) {
                  scrollRef.current.parentElement?.firstElementChild?.scrollBy({
                    top: -200,
                    behavior: "smooth",
                  });
                } else
                  scrollRef.current.parentElement?.firstElementChild?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                  });
              }
            }}
            className={`scrollButton scrollButtonLeftUp ${vertical ? "rotate-90 top-0 -translate-x-1/2 left-1/2" : "-translate-y-1/2 top-1/2 left-2"} p-[1px] absolute rounded-[4px_0_0_4px] bg-hh-${color} bg-opacity-75 hover:bg-opacity-60 flex justify-start items-center text-hh-50 transition-all overflow-hidden`}
          >
            <span className="w-6 sm:w-8 aspect-square flex items-center justify-center">
              <TriangleIcon color={"#fefefe"} rotate={270} size="100%" />
            </span>
          </button>

          <button
            tabIndex={2}
            style={{ zIndex: 300 }}
            onClick={() => {
              if (scrollRef.current) {
                if (vertical) {
                  scrollRef.current.parentElement?.firstElementChild?.scrollBy({
                    top: 200,

                    behavior: "smooth",
                  });
                } else
                  scrollRef.current.parentElement?.firstElementChild?.scrollBy({
                    left: 200,
                    behavior: "smooth",
                  });
              }
            }}
            className={`scrollButton scrollButtonRightDown ${vertical ? "rotate-90 bottom-0 -translate-x-1/2 left-1/2" : "-translate-y-1/2 top-1/2 right-2"} p-[1px] absolute rounded-[0_4px_4px_0] bg-hh-${color} bg-opacity-75 hover:bg-opacity-60 flex justify-start items-center text-hh-50 transition-all overflow-hidden`}
          >
            <span className="w-6 sm:w-8 aspect-square flex items-center justify-center">
              <TriangleIcon color={"#fefefe"} rotate={90} size="100%" />
            </span>
          </button>
        </>
      )}
    </>
  );
}
