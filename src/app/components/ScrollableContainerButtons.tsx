"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  const [isRefReady, setIsRefReady] = useState(false); // Track if ref is ready

  // Check if the container is scrollable
  const checkIfScrollable = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current?.parentElement;
      const parent = scrollContainer?.firstElementChild;
      const { scrollWidth, scrollHeight } = parent || {
        scrollWidth: 0,
        scrollHeight: 0,
      };
      console.log(scrollContainer, parent);
      const {
        scrollWidth: parentScrollWidth,
        scrollHeight: parentScrollHeight,
      } = scrollContainer || { scrollWidth: 0, scrollHeight: 0 };

      // Check if content overflows the container
      const isScrollableHorizontally = scrollWidth > parentScrollWidth;
      const isScrollableVertically = scrollHeight > parentScrollHeight;
      console.log(scrollWidth, parentScrollWidth);
      setIsScrollable(
        vertical ? isScrollableVertically : isScrollableHorizontally
      );
    }
  }, [vertical]);

  // Run the check when the component mounts and the ref is set
  useLayoutEffect(() => {
    if (scrollRef.current) {
      // Notify that the ref is now ready
      setIsRefReady(true);
    }
  }, []); // Run only once when component mounts

  // Run check when ref is ready
  useEffect(() => {
    if (isRefReady) {
      checkIfScrollable();
    }
  }, [isRefReady, checkIfScrollable]); // Trigger when ref is ready

  // Recheck on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isRefReady) {
        checkIfScrollable();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isRefReady, checkIfScrollable]);

  console.log("isScrollable", isScrollable);

  return (
    <>
      <div
        ref={scrollRef}
        className={cn("absolute w-full h-full top-0 right-0 -z-50")}
      ></div>
      {isScrollable && (
        <>
          <button
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
            className={`opacity-0 scrollButton scrollButtonLeftUp ${vertical ? "rotate-90 top-0 right-0" : "bottom-0 left-0"} p-[1px] absolute rounded-[4px_0_0_4px] bg-hh-${color} flex justify-start items-center text-hh-50 focus:outline-none focus-within:outline-none focus-visible:outline-none transition-opacity`}
          >
            <span className="w-[6px] md:w-[10px] aspect-square flex items-center justify-center">
              <TriangleIcon color={"#fefefe"} rotate={270} size="full" />
            </span>
          </button>

          {/* Scroll Down/Right Button */}
          <button
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
            className={`opacity-0 scrollButton scrollButtonRightDown ${vertical ? "rotate-90 bottom-0 right-0" : "bottom-0 right-0"} p-[1px] absolute rounded-[0_4px_4px_0] bg-hh-${color} flex justify-start items-center text-hh-50 focus:outline-none focus-within:outline-none focus-visible:outline-none transition-opacity`}
          >
            <span className="w-[6px] md:w-[10px] aspect-square flex items-center justify-center">
              <TriangleIcon color={"#fefefe"} rotate={90} size="full" />
            </span>
          </button>
        </>
      )}
    </>
  );
}
