import { cn } from "@app/utils/functions";
import React from "react";

export default function FilterIcon({
  size = "24px",
  color = "#33404D",
  rotate = 0,
  className,
}: {
  className?: string;
  size?: string;
  color?: string;
  rotate?: number;
}) {
  return (
    <svg
      className={cn(
        color === "#fefefe" ? "hover:fill-gray-300" : `hover:fill-hh-700`,
        className
      )}
      fill={color}
      width={size}
      height={size}
      transform={`rotate(${rotate})`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
    >
      <g>
        <path
          fill="none"
          stroke={color}
          strokeWidth="50"
          strokeLinecap="round"
          strokeMiterlimit="133.3333"
          d="M533.7,53.3v93 M533.3,298.3v288.4 M533.3,298.3c36.8,0,66.7-29.8,66.7-66.7S570.2,165,533.3,165
              c-36.8,0-66.7,29.8-66.7,66.7S496.5,298.3,533.3,298.3z"
        />
      </g>
      <g>
        <path
          fill="none"
          stroke={color}
          strokeWidth="50"
          strokeLinecap="round"
          strokeMiterlimit="133.3333"
          d="M319.7,586.7v-93 M320,341.7V53.3 M320,341.7c-36.8,0-66.7,29.8-66.7,66.7S283.2,475,320,475
              s66.7-29.8,66.7-66.7S356.8,341.7,320,341.7z"
        />
      </g>
      <g>
        <path
          fill="none"
          stroke={color}
          strokeWidth="50"
          strokeLinecap="round"
          strokeMiterlimit="133.3333"
          d="M107,53.3v93 M106.7,298.3v288.4 M106.7,298.3c36.8,0,66.7-29.8,66.7-66.7S143.5,165,106.7,165
              S40,194.8,40,231.6S69.8,298.3,106.7,298.3z"
        />
      </g>
    </svg>
  );
}
