import React from "react";

export default function ScrollableContainer({
  children,
  vertical = false,
}: {
  vertical?: boolean;
  children: React.ReactNode;
}) {
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
            : "horizontalScrollbar overflow-x-auto w-fit max-w-full p-1 xs:px-4 pb-4 pt-2  h-full"
        }  flex gap-2 lg:gap-4 items-stretch`}
      >
        {children}
      </div>
    </div>
  );
}
