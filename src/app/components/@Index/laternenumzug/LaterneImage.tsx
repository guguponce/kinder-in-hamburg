import Image from "next/image";
import React from "react";

export default function LaterneImage() {
  return (
    <>
      <div className="absolute animate-pulse w-4 h-4 left-[-8%] bottom-[2%] sm:bottom-[5%] sm:left-[-4%] bg-gradient-radial blur-[4px] from-orange-300 to-orange-400 rounded-full"></div>
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
