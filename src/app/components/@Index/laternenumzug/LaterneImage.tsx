import Image from "next/image";
import React from "react";

export default function LaterneImage() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute w-16 h-16 bottom-[5%] left-[1%] bg-gradient-radial blur-[8px] from-orange-300 to-orange-400 rounded-full"></div>
      <Image
        src="/assets/icons/laterne/laterne.svg"
        alt="Laternen"
        layout="fill"
        priority
      />
    </div>
  );
}
