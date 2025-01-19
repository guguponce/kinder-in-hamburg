import { cn } from "@app/utils/functions";
import React, { useEffect } from "react";
import TriangleIcon from "./@Icons/TriangleIcon";
import ScrollableContainerButtons from "./ScrollableContainerButtons";

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

  return (
    <div
      className={cn(
        `flex items-center ${
          vertical ? "w-full" : "w-fit max-w-full"
        } overflow-hidden h-full scrollable-container `,
        containerStyle
      )}
    >
      <div
        className={cn(
          `${
            vertical
              ? "verticalScrollbar w-full overflow-y-auto h-fit max-h-full flex-col"
              : "horizontalScrollbar overflow-x-auto w-fit max-w-full p-1 pb-4 pt-2 h-full"
          } ${scrollbarThumbColor} relative flex gap-2 lg:gap-4 items-stretch`,
          boxStyle
        )}
      >
        {children}
      </div>
      <ScrollableContainerButtons vertical={vertical} color={color} />
    </div>
  );
}
