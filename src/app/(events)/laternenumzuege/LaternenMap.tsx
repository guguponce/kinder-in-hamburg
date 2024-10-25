import dynamic from "next/dynamic";
import React from "react";

const GeneralMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
});

export default function LaternenMap({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <GeneralMap>{children}</GeneralMap>;
}
