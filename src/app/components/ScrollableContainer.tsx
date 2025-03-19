import { cn } from "@app/utils/functions";
import React from "react";
import ScrollableContainerButtons from "./ScrollableContainerButtons";

export default function ScrollableContainer({
  children,
  vertical = false,
  color = "500",
  boxStyle,
  containerStyle,
  showButtons = true,
  paddingForButtons = false,
}: {
  showButtons?: boolean;
  color?: "300" | "500" | "800";
  vertical?: boolean;
  children: React.ReactNode;
  boxStyle?: string;
  containerStyle?: string;
  paddingForButtons?: boolean;
}) {
  const scrollbarThumbColor = `scrollbarThumb${color}`;

  return (
    <div
      className={cn(
        `relative flex items-center ${
          vertical ? "w-full" : "w-fit max-w-full"
        } overflow-hidden h-full scrollable-container`,
        containerStyle
      )}
    >
      <div
        className={cn(
          `${
            vertical
              ? "verticalScrollbar w-full overflow-y-auto h-fit max-h-full flex-col"
              : "horizontalScrollbar overflow-x-auto w-fit max-w-full p-1 pb-4 pt-2 h-full"
          } ${scrollbarThumbColor} ${paddingForButtons && showButtons ? "px-12" : ""} relative flex gap-2 lg:gap-4 items-stretch`,
          boxStyle
        )}
      >
        {children}
      </div>
      {showButtons && (
        <ScrollableContainerButtons vertical={vertical} color={color} />
      )}
    </div>
  );
}
