import React from "react";

export default function MapIcon({
  size = "24px",
  color = "#000",
}: {
  size?: string;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>PinLocation-map</title> <defs> </defs>{" "}
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          {" "}
          <g fill="#434343">
            {" "}
            <path
              d="M0,11.438 L3.938,12.906 L3.938,1.062 L0,-0.015 L0,11.438 Z"
              className="si-glyph-fill"
            >
              {" "}
            </path>{" "}
            <path
              d="M11.506,8.005 C10.145,8.005 9.043,9.209 9.043,10.695 C9.043,11.079 9.119,11.442 9.25,11.774 L11.514,15.926 L13.759,11.774 C13.893,11.442 13.967,11.079 13.967,10.695 C13.967,9.209 12.864,8.005 11.506,8.005 L11.506,8.005 Z M11.5220204,12.046 C10.6924286,12.046 10.021,11.3749597 10.021,10.5455314 C10.021,9.7170403 10.6914082,9.046 11.5220204,9.046 C12.3495714,9.046 13.021,9.7170403 13.021,10.5455314 C13.021,11.3749597 12.3495714,12.046 11.5220204,12.046 L11.5220204,12.046 Z"
              className="si-glyph-fill"
            >
              {" "}
            </path>{" "}
            <path
              d="M16,0.969 L11.031,0.041 L11.031,6.895 C11.187,6.875 11.343,6.849 11.506,6.849 C13.483,6.849 15.084,8.39 15.084,10.292 C15.084,10.784 14.976,11.248 14.783,11.674 L14.398,12.303 L16,13 L16,0.969 L16,0.969 Z"
              className="si-glyph-fill"
            >
              {" "}
            </path>{" "}
            <path
              d="M7.926,10.292 C7.926,8.922 8.764,7.748 9.969,7.194 L9.969,0.166 L5.031,1.062 L5.031,12.906 L8.712,12.457 L8.227,11.674 C8.035,11.248 7.926,10.784 7.926,10.292 L7.926,10.292 Z"
              className="si-glyph-fill"
            >
              {" "}
            </path>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}
