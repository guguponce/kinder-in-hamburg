import { cn } from "@app/utils/functions";
import Image from "next/image";
import React from "react";

export default function LaterneImage({
  normalSize = true,
  ff,
}: {
  normalSize?: boolean;
  ff?: boolean;
}) {
  return (
    <div className="relative w-full aspect-square">
      <div
        className={cn(
          "absolute animate-pulse bg-gradient-radial blur-[4px] from-orange-300 to-orange-400 rounded-full",
          normalSize
            ? "w-[40%] aspect-square left-[-5%] bottom-[4%] sm:bottom-[3%] sm:left-[-4%]"
            : "-translate-x-1/2 -translate-y-1/2 w-[20%] aspect-square left-[15%] bottom-[20%] sm:bottom-[10%] sm:left-[16%]"
        )}
      ></div>
      {ff && (
        <div className="w-full aspect-square absolute -right-1/2  object-contain">
          <Image
            src="/assets/icons/feuerwehr.svg"
            alt="Feuerwehr"
            fill
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <Image
        src="/assets/icons/laterne/laterne.svg"
        alt="Laternen"
        fill
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
