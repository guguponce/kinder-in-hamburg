import React from "react";

export default function ScrollableContainer({
  children,
  vertical = false,
  color = "500",
}: {
  color?: "300" | "500" | "800";
  vertical?: boolean;
  children: React.ReactNode;
}) {
  const scrollbarThumbColor = `scrollbarThumb${color}`;
  return (
    <div
      className={`flex items-center ${
        vertical ? "w-full" : "w-fit max-w-full"
      } overflow-hidden h-full`}
    >
      <div
        className={`${
          vertical
            ? "verticalScrollbar w-full overflow-y-auto h-fit max-h-full flex-col"
            : "horizontalScrollbar overflow-x-auto w-fit max-w-full p-1 pb-4 pt-2 h-full"
        } ${scrollbarThumbColor} flex gap-2 lg:gap-4 items-stretch`}
      >
        {children}
      </div>
    </div>
  );
}
