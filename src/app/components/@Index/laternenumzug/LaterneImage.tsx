import Image from "next/image";
import React from "react";

export default function LaterneImage() {
  return (
    <>
      <div className="absolute w-16 h-16 left-[-8%] bottom-[2%] sm:bottom-[5%] sm:left-[-8%] bg-gradient-radial blur-[8px] from-orange-300 to-orange-400 rounded-full"></div>
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
