import { cn } from "@app/utils/functions";
import React from "react";

export default function CloseIcon({
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
      viewBox="0 0 468.067 468.067"
    >
      <g id="SVGRepo_iconCarrier">
        <g>
          <path d="M431.38,0.225H36.685C16.458,0.225,0,16.668,0,36.898v394.274c0,20.215,16.458,36.671,36.685,36.671H431.38 c20.232,0,36.688-16.456,36.688-36.671V36.898C468.062,16.668,451.612,0.225,431.38,0.225z M381.256,326.924 c14.233,14.239,14.233,37.321,0,51.53c-7.116,7.11-16.455,10.681-25.771,10.681c-9.327,0-18.643-3.57-25.747-10.681l-95.708-95.695 l-95.71,95.689c-7.105,7.11-16.42,10.681-25.742,10.681c-9.327,0-18.648-3.57-25.765-10.681c-14.236-14.215-14.236-37.291,0-51.524 l95.678-95.689l-95.678-95.704c-14.236-14.236-14.236-37.303,0-51.521c14.227-14.233,37.271-14.233,51.506,0l95.71,95.692 l95.708-95.692c14.232-14.233,37.285-14.233,51.518,0c14.233,14.218,14.233,37.285,0,51.521l-95.683,95.704L381.256,326.924z"></path>{" "}
        </g>
      </g>
    </svg>
  );
}
