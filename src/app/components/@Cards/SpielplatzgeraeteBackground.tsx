"use client";
import React, { useMemo, useRef } from "react";
import SpielgeraeteIcon from "../@Icons/@Spielplatz/SpielgeraeteIcon";

export default function SpielplatzgeraeteBackground({
  spList,
  color = "#33404D",
  bgColor,
  size = "3rem",
  small = true,
}: {
  bgColor?: string;
  spList: string[];
  color?: string;
  small?: boolean;
  size?: string;
}) {
  const randomNumber = useRef(
    Array(10)
      .fill("")
      .map(() => Math.random())
  );
  const spielgeraete = useMemo(
    () =>
      Array(10)
        .fill([...spList] as string[])
        .map((sp, i) => [sp, i])
        .sort((a, b) => 0.5 - randomNumber.current[a[1]])
        .map((a) => a[0])
        .flat()
        .slice(0, small ? 20 : -1),
    [spList, small]
  );
  return (
    <div
      style={{
        background: `linear-gradient(45deg, ${bgColor}90 0%, ${bgColor}50 100%)`,
      }}
      className={`${
        small ? "gap-2" : "gap-4"
      } absolute z-0 p-1 flex flex-wrap justify-around w-full h-full opacity-25 items-around gap-2 overflow-hidden`}
    >
      {spielgeraete.map((spielgeraet, i) => (
        <React.Fragment key={spielgeraet + i}>
          <SpielgeraeteIcon logo={spielgeraet} color={color} size={size} />
        </React.Fragment>
      ))}
    </div>
  );
}
