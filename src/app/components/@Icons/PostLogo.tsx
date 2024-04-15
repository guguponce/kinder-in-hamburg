import React from "react";

export default function PostLogo({
  size = "24px",
  color = "#000",
  logo,
}: {
  size?: string;
  color?: string;
  logo: string;
}) {
  return (
    <>
      {logo === "triangle" && (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={color}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M4.2433 17.6513L10.5859 5.67095C11.0445 4.80456 11.2739 4.37136 11.5798 4.22973C11.8463 4.10637 12.1535 4.10637 12.42 4.22973C12.726 4.37136 12.9553 4.80456 13.414 5.67094L19.7565 17.6513C20.1668 18.4263 20.372 18.8138 20.3305 19.13C20.2943 19.4059 20.1448 19.6543 19.9179 19.8154C19.6579 19.9999 19.2194 19.9999 18.3425 19.9999H5.65737C4.78044 19.9999 4.34198 19.9999 4.08198 19.8154C3.85505 19.6543 3.70551 19.4059 3.66932 19.13C3.62785 18.8138 3.833 18.4263 4.2433 17.6513Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      )}
      {logo === "date" && (
        <svg
          width={size}
          height={size}
          viewBox="-0.5 0 15 15"
          xmlns="http://www.w3.org/2000/svg"
          fill={color}
        >
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              fill={color}
              fillRule="evenodd"
              d="M107,154.006845 C107,153.45078 107.449949,153 108.006845,153 L119.993155,153 C120.54922,153 121,153.449949 121,154.006845 L121,165.993155 C121,166.54922 120.550051,167 119.993155,167 L108.006845,167 C107.45078,167 107,166.550051 107,165.993155 L107,154.006845 Z M108,157 L120,157 L120,166 L108,166 L108,157 Z M116.5,163.5 L116.5,159.5 L115.757485,159.5 L114.5,160.765367 L114.98503,161.275112 L115.649701,160.597451 L115.649701,163.5 L116.5,163.5 Z M112.5,163.5 C113.412548,163.5 114,163.029753 114,162.362119 C114,161.781567 113.498099,161.473875 113.110266,161.433237 C113.532319,161.357765 113.942966,161.038462 113.942966,160.550798 C113.942966,159.906386 113.395437,159.5 112.505703,159.5 C111.838403,159.5 111.359316,159.761248 111.051331,160.115385 L111.456274,160.632075 C111.724335,160.370827 112.055133,160.231495 112.425856,160.231495 C112.819392,160.231495 113.13308,160.382438 113.13308,160.690131 C113.13308,160.974601 112.847909,161.102322 112.425856,161.102322 C112.28327,161.102322 112.020913,161.102322 111.952471,161.096517 L111.952471,161.839623 C112.009506,161.833817 112.26616,161.828012 112.425856,161.828012 C112.956274,161.828012 113.190114,161.967344 113.190114,162.275036 C113.190114,162.565312 112.93346,162.768505 112.471483,162.768505 C112.10076,162.768505 111.684411,162.605951 111.427757,162.327286 L111,162.87881 C111.279468,163.227141 111.804183,163.5 112.5,163.5 Z M110,152.5 C110,152.223858 110.214035,152 110.504684,152 L111.495316,152 C111.774045,152 112,152.231934 112,152.5 L112,153 L110,153 L110,152.5 Z M116,152.5 C116,152.223858 116.214035,152 116.504684,152 L117.495316,152 C117.774045,152 118,152.231934 118,152.5 L118,153 L116,153 L116,152.5 Z"
              transform="translate(-107 -152)"
            ></path>{" "}
          </g>
        </svg>
      )}
      {logo === "hamburg" && (
        <svg
          fill={color}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={size}
          height={size}
        >
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              id="hamburg--philharmone_2_"
              d="M28,28.359c-0.738,0-1.436-0.292-2-0.832c-1.129,1.08-2.871,1.08-4,0 c-1.129,1.08-2.871,1.08-4,0c-1.129,1.08-2.872,1.08-4,0c-1.128,1.08-2.872,1.08-4,0c-1.128,1.08-2.872,1.08-4,0 C4.776,28.7,2.842,28.58,1.723,27.229c-0.127-0.153-0.105-0.38,0.048-0.507c0.152-0.127,0.38-0.105,0.507,0.048 c0.929,1.121,2.517,1.121,3.445,0c0.137-0.166,0.418-0.166,0.555,0c0.929,1.121,2.517,1.121,3.445,0 c0.137-0.166,0.418-0.166,0.555,0c0.929,1.121,2.517,1.121,3.445,0c0.137-0.166,0.418-0.166,0.555,0 c0.929,1.121,2.516,1.121,3.445,0c0.137-0.166,0.418-0.166,0.555,0c0.93,1.121,2.516,1.121,3.445,0c0.137-0.166,0.418-0.166,0.555,0 c0.93,1.121,2.516,1.121,3.445,0c0.137-0.166,0.418-0.166,0.555,0c0.93,1.121,2.516,1.121,3.445,0 c0.127-0.153,0.353-0.176,0.507-0.048c0.153,0.127,0.175,0.354,0.048,0.507C29.674,27.958,28.864,28.359,28,28.359z M28.36,22 c0-0.199-0.161-0.36-0.36-0.36h-0.64v-1.28H28c0.199,0,0.36-0.161,0.36-0.36V8c0-0.136-0.077-0.26-0.198-0.321 S27.895,7.63,27.786,7.71c-0.154,0.112-3.77,2.717-6.498-0.926c-0.059-0.078-0.146-0.128-0.242-0.141 c-0.097-0.012-0.193,0.015-0.271,0.076c-0.193,0.153-4.794,3.701-9.499-1.949c-0.123-0.146-0.338-0.171-0.492-0.058 C10.771,4.723,9.293,5.8,7.549,5.456C6.314,5.213,5.224,4.324,4.308,2.813c-0.083-0.139-0.25-0.203-0.405-0.16 C3.748,2.697,3.64,2.838,3.64,3v17c0,0.199,0.161,0.36,0.36,0.36h0.64v1.279H4c-0.199,0-0.36,0.161-0.36,0.36v4h0.72v-3.64h1.28V26 h0.72v-3.64h1.28V26h0.72v-3.64h3.28V26h0.72v-3.64h1.28V26h0.72v-3.64h3.28V26h0.721v-3.64h1.279V26h0.721v-3.64h3.279V26h0.721 v-3.64h1.279V26h0.721v-3.64h1.279V26h0.721L28.36,22L28.36,22z M5.36,20.36H14c0.088,0,0.173-0.032,0.239-0.091 c0.595-0.527,1.756-0.909,2.761-0.909c1.004,0,2.165,0.382,2.762,0.909c0.065,0.059,0.15,0.091,0.238,0.091h6.64v1.279H5.36V20.36z M17,18.64c-1.125,0-2.387,0.407-3.131,1H4.36V4.151c0.888,1.115,1.913,1.79,3.059,2.013c1.59,0.311,2.944-0.348,3.513-0.689 c4.395,5.042,8.822,2.766,9.994,2.014c2.441,2.964,5.471,1.819,6.714,1.151v11h-7.509C19.386,19.047,18.124,18.64,17,18.64z M26.36,18h-0.72v1h0.721L26.36,18L26.36,18z M8.359,18H7.64v1h0.72L8.359,18L8.359,18z M6.36,17H5.64v1h0.72 C6.36,18,6.36,17,6.36,17z M25.36,16h-0.72v1h0.721L25.36,16L25.36,16z M19.36,16h-0.72v1h0.721L19.36,16L19.36,16z M10.36,16H9.64 v1h0.72C10.36,17,10.36,16,10.36,16z M8.36,15H7.64v1h0.72V15z M21.36,14h-0.72v1h0.721L21.36,14L21.36,14z M6.36,14H5.64v1h0.72 C6.36,15,6.36,14,6.36,14z M10.36,13H9.64v1h0.72C10.36,14,10.36,13,10.36,13z M26.36,12h-0.72v1h0.721L26.36,12L26.36,12z M12.36,12h-0.72v1h0.72V12z M8.36,12H7.64v1h0.72V12z M22.36,11h-0.72v1h0.721L22.36,11L22.36,11z M6.36,11H5.64v1h0.72 C6.36,12,6.36,11,6.36,11z M10.36,10H9.64v1h0.72C10.36,11,10.36,10,10.36,10z M12.36,9h-0.72v1h0.72V9z M8.36,9H7.64v1h0.72V9z M6.36,8H5.64v1h0.72C6.36,9,6.36,8,6.36,8z M10.36,7H9.64v1h0.72C10.36,8,10.36,7,10.36,7z"
            ></path>{" "}
            <rect
              id="_Transparent_Rectangle"
              style={{ fill: "none" }}
              width="32"
              height="32"
            ></rect>{" "}
          </g>
        </svg>
      )}
      {logo === "map" && (
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
      )}
      {logo === "instagram" && (
        <svg
          fill={color}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          id="Camada_1"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z"></path>{" "}
              <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8 c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z"></path>{" "}
              <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8 c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z"></path>{" "}
            </g>{" "}
          </g>
        </svg>
      )}
      {logo === "link" && (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L12.5 6.06212"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            ></path>{" "}
            <path
              d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373"
              stroke="#1C274C"
              strokeWidth="3"
              strokeLinecap="round"
            ></path>{" "}
          </g>
        </svg>
      )}
    </>
  );
}
