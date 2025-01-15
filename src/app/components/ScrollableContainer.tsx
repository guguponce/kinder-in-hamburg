import { cn } from "@app/utils/functions";
import React from "react";
import TriangleIcon from "./@Icons/TriangleIcon";

export default function ScrollableContainer({
  children,
  vertical = false,
  color = "500",
  boxStyle,
  containerStyle,
}: {
  color?: "300" | "500" | "800";
  vertical?: boolean;
  children: React.ReactNode;
  boxStyle?: string;
  containerStyle?: string;
}) {
  const scrollbarThumbColor = `scrollbarThumb${color}`;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      className={cn(
        `relative flex items-center ${
          vertical ? "w-full" : "w-fit max-w-full"
        } overflow-hidden h-full`,
        containerStyle
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          `${
            vertical
              ? "verticalScrollbar w-full overflow-y-auto h-fit max-h-full flex-col"
              : "horizontalScrollbar overflow-x-auto w-fit max-w-full p-1 pb-4 pt-2 h-full"
          } ${scrollbarThumbColor} flex gap-2 lg:gap-4 items-stretch`,
          boxStyle
        )}
      >
        {children}
      </div>
      <button
        className={`absolute ${vertical ? "rotate-90 right-0 hover:-right-1 top-0 hover:top-1" : "bottom-0 left-0"} rounded-[4px_0_0_4px] hover:w-4 p-[1px] bg-hh-${color} flex justify-start items-center text-hh-50  focus:outline-none focus-within:outline-none focus-visible:outline-none`}
        onClick={() => {
          if (scrollRef.current) {
            if (vertical) scrollRef.current.scrollTop -= 200;
            else scrollRef.current.scrollLeft -= 200;
          }
        }}
      >
        <TriangleIcon color={"#fefefe"} rotate={270} size="6px" />
      </button>
      <button
        className={`absolute ${vertical ? "rotate-90 hover:-right-1 hover:bottom-1" : ""} rounded-[0_4px_4px_0] right-0 bottom-0  p-[1px] flex justify-end items-center bg-hh-${color} bg-opacity-75 hover:bg-opacity-100 hover:w-4 text-hh-50 focus:outline-none focus-within:outline-none focus-visible:outline-none`}
        onClick={() => {
          if (scrollRef.current) {
            if (vertical) scrollRef.current.scrollTop += 200;
            else scrollRef.current.scrollLeft += 200;
          }
        }}
      >
        <TriangleIcon color={"#fefefe"} rotate={90} size="6px" />
      </button>
    </div>
  );
}
