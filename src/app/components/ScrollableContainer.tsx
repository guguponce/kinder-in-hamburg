import React from "react";

export default function ScrollableContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex  items-center w-fit max-w-full overflow-hidden">
      <div className="horizontalScrollbar overflow-x-auto w-fit max-w-full flex gap-2 items-stretch px-4 pb-4 pt-2">
        {children}
      </div>
    </div>
  );
}
