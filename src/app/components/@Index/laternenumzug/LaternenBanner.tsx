import Banner from "@app/components/Banner";
import React from "react";
import LaternenGallery from "./LaternenGallery";
import LaterneImage from "./LaterneImage";
import Image from "next/image";

export default function LaternenBanner() {
  return (
    <Banner href="/laternenumzuege" linkText="alle entdecken">
      <Image
        style={{ left: "-6px" }}
        fill
        src={"/assets/icons/laterne/stars.svg"}
        alt="stars"
        className="absolute top-0 min-w-[1200px] max-h-[150px] bg-opacity-25 rounded-lg opacity-50 -z-1"
      />
      <Banner.TextSide>
        <Banner.Title href={"/laternenumzuege"}>Laternenumzüge</Banner.Title>
        <Banner.Text>
          Eine der beliebtesten Herbsttraditionen für Kinder und Familien. Hier
          könnt ihr mit euren Laternen durch die Straßen ziehen und gemeinsam
          Lieder singen. Hier ist eine Zusammenstellung der kommenden
          Laternenumzüge in Hamburg.
        </Banner.Text>
        <div
          className="flex-grow min-h-32 h-32 xs:h-fit aspect-square min-w-32 mt-2 relative"
          style={{ transform: "rotateY(180deg)" }}
        >
          <LaterneImage />
        </div>
      </Banner.TextSide>
      <div className="min-h-full min-w-[320px] self-center md:self-stretch mt-4 flex items-center md:max-w-none max-w-52 sm:items-stretch justify-around flex-col sm:flex-row gap-4 rounded rounded">
        <LaternenGallery />
      </div>
    </Banner>
  );
}
