import React from "react";

export default function UserStandortIcon({
  color,
  size = "1.5rem",
  stroke,
}: {
  color?: string;
  size?: string;
  stroke?: string;
}) {
  return (
    <svg
      height={size}
      width={size}
      stroke={stroke || ""}
      strokeWidth={stroke ? "5" : "0"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <path
            style={{ fill: color || "#90160E" }}
            d="M256,238.428c-65.735,0-119.214-53.48-119.214-119.214S190.265,0,256,0 c65.734,0,119.214,53.48,119.214,119.214S321.734,238.428,256,238.428z"
          ></path>{" "}
          <path
            style={{ fill: color || "#90160E" }}
            d="M414.229,512H97.771c-10.687,0-19.351-8.664-19.351-19.351v-61.375 c0-97.918,79.662-177.58,177.58-177.58s177.58,79.662,177.58,177.58v61.375C433.58,503.336,424.916,512,414.229,512z"
          ></path>{" "}
        </g>{" "}
        <g>
          {" "}
          <path
            style={{ fill: color || "#EE564B" }}
            d="M256,0v238.428c65.734,0,119.214-53.48,119.214-119.214C375.214,53.478,321.734,0,256,0z"
          ></path>{" "}
          <path
            style={{ fill: color || "#EE564B" }}
            d="M256,253.693V512h158.229c10.687,0,19.351-8.664,19.351-19.351v-61.375 C433.58,333.355,353.918,253.693,256,253.693z"
          ></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}
