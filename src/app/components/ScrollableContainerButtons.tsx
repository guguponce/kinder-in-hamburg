"use client";
import React, { useCallback, useEffect, useState } from "react";
import Triangle from "./@Icons/TriangleIcon";
import { cn } from "@app/utils/functions";

const TriangleIcon = React.memo(Triangle);

type Props = {
  color: "300" | "500" | "800";
  vertical?: boolean;
  targetRef: React.RefObject<HTMLElement>;
  scrollAmount?: number;
};

export default function ScrollableContainerButtons({
  color,
  vertical = false,
  targetRef,
  scrollAmount = 200,
}: Props) {
  const [isScrollable, setIsScrollable] = useState(false);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const checkScrollState = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;

    const maxScroll = vertical
      ? el.scrollHeight - el.clientHeight
      : el.scrollWidth - el.clientWidth;

    const currentScroll = vertical ? el.scrollTop : el.scrollLeft;

    setIsScrollable(maxScroll > 1);
    setCanScrollBack(currentScroll > 0);
    setCanScrollForward(currentScroll < maxScroll - 1);
  }, [targetRef, vertical]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    checkScrollState();

    const resizeObserver = new ResizeObserver(checkScrollState);
    resizeObserver.observe(el);

    el.addEventListener("scroll", checkScrollState);
    window.addEventListener("resize", checkScrollState);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState, targetRef]);

  const scroll = (direction: "back" | "forward") => {
    const el = targetRef.current;
    if (!el) return;
    const maxScroll = vertical ? el.clientHeight : el.clientWidth;
    const finalScrollAmount = Math.max(scrollAmount, (maxScroll - 1) / 2);
    const amount =
      direction === "back" ? -finalScrollAmount : finalScrollAmount;

    el.scrollBy(
      vertical
        ? { top: amount, behavior: "smooth" }
        : { left: amount, behavior: "smooth" },
    );
  };

  if (!isScrollable) return null;

  return (
    <>
      {canScrollBack && (
        <button
          onClick={() => scroll("back")}
          className={cn(
            "scrollButton scrollButtonLeftUp absolute z-[300] p-[1px] rounded-[4px_0_0_4px] bg-hh-" +
              color,
            "bg-opacity-75 hover:bg-opacity-60 transition-all flex items-center",
            vertical
              ? "rotate-90 top-0 left-1/2 -translate-x-1/2"
              : "top-1/2 left-2 -translate-y-1/2",
          )}
        >
          <span className="w-6 sm:w-8 aspect-square flex items-center justify-center">
            <TriangleIcon color="#fff" rotate={270} size="100%" />
          </span>
        </button>
      )}

      {canScrollForward && (
        <button
          onClick={() => scroll("forward")}
          className={cn(
            "scrollButton scrollButtonRightDown absolute z-[300] p-[1px] rounded-[0_4px_4px_0] bg-hh-" +
              color,
            "bg-opacity-75 hover:bg-opacity-60 transition-all flex items-center",
            vertical
              ? "rotate-90 bottom-0 left-1/2 -translate-x-1/2"
              : "top-1/2 right-2 -translate-y-1/2",
          )}
        >
          <span className="w-6 sm:w-8 aspect-square flex items-center justify-center">
            <TriangleIcon color="#fff" rotate={90} size="100%" />
          </span>
        </button>
      )}
    </>
  );
}
