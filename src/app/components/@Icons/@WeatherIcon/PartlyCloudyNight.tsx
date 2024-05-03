import React from "react";

const PartlyCloudyDay = ({ size, color }: { size: string; color: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M421.23264 788.48c-96.4608 0-178.75968-34.14016-247.0912-102.5024C105.79968 617.59488 71.68 535.18336 71.68 438.74304 71.68 369.3568 91.27936 305.13152 130.39616 245.76 169.6256 186.4704 220.85632 142.78656 284.1088 114.5856c3.9936-3.03104 8.0384-2.48832 12.02176 1.50528 5.0176 3.04128 6.56384 7.49568 4.53632 13.57824-16.00512 38.2976-24.064 76.88192-24.064 116.11136 0 89.45664 31.90784 166.07232 95.71328 229.90848 63.78496 63.82592 140.35968 95.744 229.77536 95.744 49.2032 0 91.92448-7.50592 128.08192-22.5792 3.9936-3.10272 7.96672-2.58048 11.97056 1.40288 4.98688 3.05152 6.5536 7.51616 4.5056 13.59872-26.08128 68.36224-68.51584 122.86976-127.32416 163.57376C560.5888 768.12288 494.55104 788.48 421.23264 788.48z"
        fill="#FA870B"
      ></path>
      <path
        d="M279.42912 917.07392v-0.04096l-3.47136 0.04096C164.33152 917.07392 73.6256 828.28288 71.71072 718.0288L71.68 714.50624c0-111.872 91.46368-202.55744 204.288-202.55744 102.912 0 188.04736 75.45856 202.20928 173.6192h4.47488v-1.36192c0-127.31392 103.04512-230.76864 230.94272-232.82688l3.8912-0.03072C847.17568 451.34848 952.32 555.60192 952.32 684.20608c0 128.6144-105.14432 232.8576-234.83392 232.8576l2.60096-0.02048v0.03072H279.43936z"
        fill="#DFF1FB"
      ></path>
    </g>
  </svg>
);

export default PartlyCloudyDay;
