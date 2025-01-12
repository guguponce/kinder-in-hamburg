import React from "react";

export default function CloseIcon2({
  size = "24px",
  color = "#3340  4D",
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
      className={className}
      width={size}
      height={size}
      transform={`rotate(${rotate})`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g>
        <g>
          <path
            d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}
