import React from "react";
const Cloudy = ({ size, color }: { size: string; color: string }) => (
  <svg
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
    height={size}
    width={size}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M503.53152 457.0624m-262.5024 0a262.5024 262.5024 0 1 0 525.0048 0 262.5024 262.5024 0 1 0-525.0048 0Z"
        fill="#F2FAFE"
      ></path>
      <path
        d="M279.42912 838.10304v-0.04096l-3.47136 0.04096C164.33152 838.10304 73.6256 749.32224 71.71072 639.0784L71.68 635.5456C71.68 523.6736 163.14368 432.97792 275.968 432.97792c102.912 0 188.04736 75.4688 202.20928 173.62944h4.47488v-1.36192c0-127.32416 103.04512-230.77888 230.94272-232.83712l3.8912-0.03072C847.17568 372.3776 952.32 476.64128 952.32 605.2352c0 128.6144-105.14432 232.86784-234.83392 232.86784l2.60096-0.03072v0.03072H279.43936z"
        fill="#DFF1FB"
      ></path>
    </g>
  </svg>
);

export default Cloudy;
