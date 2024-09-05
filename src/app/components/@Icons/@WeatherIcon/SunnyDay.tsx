import React from "react";

const SunnyDay = ({ size, color }: { size: string; color: string }) => (
  <svg fill={color} height={size} width={size} viewBox="0 0 1024 1024">
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M512 512m-440.32 0a440.32 440.32 0 1 0 880.64 0 440.32 440.32 0 1 0-880.64 0Z"
        fill="#FA870B"
      ></path>
    </g>
  </svg>
);

export default SunnyDay;
