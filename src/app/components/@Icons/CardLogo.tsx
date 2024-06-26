import React from "react";
import { categoryName } from "@app/utils/types";

export default function CardLogo({
  size = "24px",
  color = "#000",
  logo,
}: {
  size?: string;
  color?: string;
  logo: categoryName;
}) {
  return (
    <>
      {logo === "Indoor" && (
        <svg
          fill={color}
          height={size}
          width={size}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512.00 512.00"
          stroke="#000000"
          strokeWidth="2.048"
        >
          <g id="SVGRepo_iconCarrier">
            <g>
              <g>
                <path d="M410.84,247.333h-17.972L283.886,100.292h22.617c12.364,0,23.827-6.687,29.913-17.45 c4.686-8.288,5.657-18.059,2.948-26.953c2.709-8.893,1.738-18.666-2.948-26.952c-6.084-10.762-17.546-17.45-29.913-17.45h-35.937 c-0.527,0-1.05,0.015-1.571,0.04C267.01,4.863,260.843,0,253.533,0c-8.913,0-16.139,7.226-16.139,16.139v64.977L114.197,247.333 H101.16c-8.913,0-16.139,7.226-16.139,16.139c0,8.913,7.226,16.139,16.139,16.139h21.163h9.895v200.112h-0.718 c-8.913,0-16.139,7.226-16.139,16.139c0,8.913,7.226,16.139,16.139,16.139h244.065c8.913,0,16.139-7.226,16.139-16.139 c0-8.913-7.226-16.139-16.139-16.139h-0.718V279.611h9.894h26.098c8.913,0,16.139-7.226,16.139-16.139 S419.753,247.333,410.84,247.333z M270.566,43.766h35.937c0.752,0,1.446,0.405,1.816,1.06c0.37,0.654,0.359,1.458-0.028,2.102 l-5.391,8.964l5.391,8.963c0.387,0.644,0.398,1.447,0.028,2.102c-0.37,0.655-1.064,1.06-1.816,1.06h-35.937V43.766z M286.858,479.555h-66.651v-64.566c0-18.376,14.95-33.325,33.325-33.325s33.325,14.95,33.325,33.325V479.555z M342.57,479.555 h-23.435v-64.566c0-36.173-29.43-65.603-65.603-65.603s-65.603,29.43-65.603,65.603v64.566h-23.435V279.611H342.57V479.555z M154.373,247.335l99.16-133.787l99.16,133.787H154.373z"></path>
              </g>
            </g>
          </g>
        </svg>
      )}
    </>
  );
}
