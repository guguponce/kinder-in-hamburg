import Image from "next/image";
import React from "react";

export default function LaterneImage({
  normalSize = true,
}: {
  normalSize?: boolean;
}) {
  return (
    <>
      <div
        className={`${normalSize ? "w-12 h-12 left-[-10%] bottom-[3%] sm:bottom-[5%] sm:left-[-6%]" : "w-4 h-4 left-[-4%] bottom-[2%] sm:bottom-[5%] sm:left-[-4%]"} absolute animate-pulse bg-gradient-radial blur-[4px] from-orange-300 to-orange-400 rounded-full`}
      ></div>
      <Image
        src="/assets/icons/laterne/laterne.svg"
        alt="Laternen"
        fill
        className="w-full h-full object-contain"
        priority
      />
    </>
  );
}
