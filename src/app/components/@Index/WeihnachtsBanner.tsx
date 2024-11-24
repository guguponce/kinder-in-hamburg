import Banner from "@app/components/Banner";
import React from "react";
import EventsGallery from "./laternenumzug/EventsGallery";

export default function WeihnachtsBanner() {
  return (
    <Banner
      textSide="right"
      href="/weihnachtszeit"
      linkText="alle erkunden"
      className="from-positive-700 to-[#628d5a50] bg-opacity-20"
    >
      <div className="min-h-full min-w-[320px] self-center md:self-stretch mt-4 flex items-center md:max-w-none max-w-52 sm:items-stretch justify-around flex-col sm:flex-row gap-4 rounded">
        <EventsGallery eventType="weihnachtsmarkt" />
      </div>
      <Banner.TextSide>
        <Banner.Title href={"/weihnachtszeit"}>Weihnachtsmärkte</Banner.Title>
        <Banner.Text>
          Eine der schönsten Traditionen in dieser Jahreszeit ist der
          Weihnachtsmarkt. Hier könnt ihr mit Familie und Freunden bummeln und
          die festliche Atmosphäre genießen. Auf vielen Märkten gibt es
          spezielle Attraktionen oder Kinderprogramme, die die Kleinen in
          Weihnachtsstimmung versetzen. Hier findet ihr eine Übersicht der
          kinderfreundlichen Weihnachtsmärkte in Hamburg.
        </Banner.Text>
        {/* <div
          className="flex-grow min-h-32 h-32 xs:h-fit aspect-square min-w-32 mt-2 relative"
          style={{ transform: "rotateY(180deg)" }}
        >
          <LaterneImage />
        </div> */}
      </Banner.TextSide>
    </Banner>
  );
}
