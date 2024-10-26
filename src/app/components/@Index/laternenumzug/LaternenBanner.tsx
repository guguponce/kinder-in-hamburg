import Banner from "@app/components/Banner";
import React from "react";
import LaternenGallery from "./LaternenGallery";
import LaterneImage from "./LaterneImage";

export default function LaternenBanner() {
  return (
    <Banner href="/laternenumzuege" linkText="alle entdecken">
      <Banner.TextSide>
        <Banner.Title href={"/laternenumzuege"}>Laternenumzüge</Banner.Title>
        <Banner.Text>
          Eine der beliebtesten Herbsttraditionen für Kinder und Familien. Hier
          könnt ihr mit euren Laternen durch die Straßen ziehen und gemeinsam
          Lieder singen. Hier ist eine Zusammenstellung der kommenden
          Laternenumzüge in Hamburg.
        </Banner.Text>
        <div
          className="flex-grow min-h-32 aspect-square"
          style={{ transform: "rotateY(180deg)" }}
        >
          <LaterneImage />
        </div>
      </Banner.TextSide>
      <div className="h-full self-center mt-4 flex items-center aspect-[2/3] max-w-52 sm:items-stretch justify-around flex-col sm:flex-row gap-4 p-2 rounded">
        <LaternenGallery />
      </div>
    </Banner>
  );
}
