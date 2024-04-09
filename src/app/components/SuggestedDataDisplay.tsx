import React from "react";

export default function DataDisplay({
  keyName,
  children,
}: {
  keyName: string;
  children: JSX.Element;
}) {
  return (
    <div className="p-2 flex flex-wrap items-center w-full">
      <h2 className="font-semibold mr-4">{keyName}:</h2>
      <div className="flex-grow flex flex-wrap">{children}</div>
    </div>
  );
}
