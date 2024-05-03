import React from "react";

const PartlyCloudyDay = ({ size, color }: { size: string; color: string }) => (
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
        d="M508.75392 454.01088m-259.45088 0a259.45088 259.45088 0 1 0 518.90176 0 259.45088 259.45088 0 1 0-518.90176 0Z"
        fill="#FA870B"
      ></path>
      <path
        d="M287.25248 830.6176v-0.03072l-3.4304 0.03072c-110.336 0-199.9872-87.7568-201.87136-196.7104L81.92 630.40512c0-110.57152 90.39872-200.21248 201.90208-200.21248 101.71392 0 185.86624 74.58816 199.86432 171.60192h4.42368v-1.3312c0-125.8496 101.84704-228.096 228.25984-230.13376l3.84-0.03072C848.40448 370.30912 952.32 473.35424 952.32 600.4736c0 127.11936-103.91552 230.15424-232.11008 230.15424l2.58048-0.03072v0.03072H287.26272z"
        fill="#DFF1FB"
      ></path>
    </g>
  </svg>
);

export default PartlyCloudyDay;
