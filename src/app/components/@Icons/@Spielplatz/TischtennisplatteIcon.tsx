import React from "react";

export default function TischtennisplatteIcon({
  size = "24px",
  color = "#000",
}: {
  size?: string;
  color?: string;
}) {
  return (
    <svg
      fill={color}
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <g>
        <polygon
          points="440.359,375.558 71.651,375.558 71.651,337.052 34.748,337.052 34.748,488.334 71.651,488.334 
		71.651,405.541 440.359,405.541 440.359,488.334 477.252,488.334 477.252,337.052 440.359,337.052 	"
        />
        <path
          d="M250.228,269.504v-86.935H50.516v-80.44h410.969v80.44H269.603v86.935h239.372l-45.83-86.935h21.511V85.462
		h-21.798h-1.374h-49.517l-32.574-61.796H132.617l-32.574,61.796H50.516h-1.364H27.344v97.107h21.512L3.035,269.504H250.228z
		 M250.228,36.419h19.375v49.043h-19.375V36.419z"
        />
        <rect y="288.889" width="512" height="39.336" />
      </g>
    </svg>
  );
}
