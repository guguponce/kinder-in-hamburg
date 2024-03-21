import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[300px] w-full flex flex-col justify-center items-center relative">
      <div className="loadingButton bg-white flex justify-center items-center w-24 h-24 text-3xl">
        Loading
      </div>

      <img
        id="hh-loading-img"
        className="object-cover max-w-[400px] w-1/2 rounded-sm"
        src={"/assets/icons/anchor-blue.svg"}
        alt={"Hamburg"}
      />
    </div>
  );
}
