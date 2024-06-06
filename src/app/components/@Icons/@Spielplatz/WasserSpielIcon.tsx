import React from "react";

export default function WasserSpielIcon({
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
        <g>
          <path
            d="M489.76,33.391c-9.22,0-16.696,7.475-16.696,16.696v50.087H370.019c-5.039-14.207-16.313-25.481-30.52-30.52V33.391
       h50.087c9.22,0,16.696-7.475,16.696-16.696S398.806,0,389.586,0c-7.804,0-195.238,0-200.348,0c-9.22,0-16.696,7.475-16.696,16.696
       s7.475,16.696,16.696,16.696h50.087v36.263c-14.207,5.039-25.481,16.313-30.52,30.52H89.064
       c-27.618,0-50.087,22.469-50.087,50.087v100.174c0,9.22,7.474,16.696,16.696,16.696h66.783c9.22,0,16.696-7.475,16.696-16.696
       v-50.087h69.654c6.892,19.433,25.45,33.391,47.215,33.391h66.783c21.766,0,40.323-13.959,47.215-33.391h103.046v50.087
       c0,9.22,7.475,16.696,16.696,16.696s16.696-7.475,16.696-16.696c0-7.804,0-195.238,0-200.348
       C506.455,40.867,498.98,33.391,489.76,33.391z M205.934,166.957h-83.478c-9.22,0-16.696,7.475-16.696,16.696v50.087H72.368
       v-83.478c0-9.206,7.49-16.696,16.696-16.696h116.87V166.957z M272.716,33.391h33.391v33.391h-33.391V33.391z M339.499,183.652
       c0,9.206-7.49,16.696-16.696,16.696h-66.783c-9.206,0-16.696-7.49-16.696-16.696V116.87c0-9.206,7.489-16.696,16.696-16.696
       h66.783c9.206,0,16.696,7.49,16.696,16.696V183.652z M473.064,166.957H372.89v-33.391h100.174V166.957z"
          />
        </g>
      </g>
      <g>
        <g>
          <path
            d="M154.365,376.513l-52.246-65.53c-6.677-8.376-19.429-8.379-26.109,0l-52.246,65.53C-19.498,430.771,19.08,512,89.064,512
       C159.032,512,197.638,430.787,154.365,376.513z M89.064,478.609c-41.965,0-65.156-48.715-39.193-81.279l39.193-49.156
       l39.193,49.156C154.199,429.867,131.054,478.609,89.064,478.609z"
          />
        </g>
      </g>
    </svg>
  );
}