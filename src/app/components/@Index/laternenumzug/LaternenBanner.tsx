import React from "react";
import EventsGallery from "./EventsGallery";
import LaterneImage from "./LaterneImage";
import Image from "next/image";
import Link from "next/link";

export default function LaternenBanner() {
  const today = Date.now();
  if (today > new Date("2024-12-29").getTime()) return null;
  return (
    <section className="p-4 relative rounded-lg bg-gradient-to-b  min-w-fit flex gap-2 flex-col items-center w-full  max-w-[800px] lg:from-hh-950 lg:to-hh-800  lg:w-fit lg:max-w-[420px] text-white bg-opacity-10 transition-all overflow-hidden">
      <div className="sm:gap-2 flex flex-col items-center w-full justify-stretch">
        <Image
          style={{ left: "-6px" }}
          fill
          src={"/assets/icons/laterne/stars.svg"}
          alt="stars"
          className="absolute top-0 min-w-[1200px] max-h-[150px] bg-opacity-25 rounded-lg opacity-50 -z-1 lg:invert-0 invert"
        />
        <div className="flex flex-col items-center gap-2 w-fit rounded-3xl overflow-hidden bg-hh-950 bg-opacity-5">
          <div className="min-h-full min-w-[280px] w-full max-w-[300px] flex items-center justify-around flex-col rounded">
            <Link
              className="text-3xl text-center font-bold p-1 sm:mb-none hover:text-hh-50 hover:scale-[1.01] transition-all"
              href={"/laternenumzuege"}
            >
              Laternenumzüge
            </Link>
            <h4 className="text-center text-sm sm:text-base italic lg:backdrop-blur-sm mb-2">
              Die Laternensaison ist fast zu Ende, aber es gibt noch ein paar
              Lichterumzüge vor dem Dezember!
            </h4>
            <EventsGallery eventType="laterne" />
          </div>
          <div className="relative flex justify-end w-72 pb-2">
            <div
              className="absolute left-2 bottom-0 h-12 w-12"
              style={{ transform: "scaleX(-1)" }}
            >
              <LaterneImage normalSize={false} />
            </div>
            <Link
              href={"/laternenumzuege"}
              className="underline underline-offset-2 font-semibold px-2 text-end text-white self-end hover:scale-[1.01] transition-all hover:underline-offset-4"
            >
              {"alle entdecken"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
// <Banner href="/laternenumzuege" linkText="alle entdecken">
//   <Image
//     style={{ left: "-6px" }}
//     fill
//     src={"/assets/icons/laterne/stars.svg"}
//     alt="stars"
//     className="absolute top-0 min-w-[1200px] max-h-[150px] bg-opacity-25 rounded-lg opacity-50 -z-1"
//   />
//   <Banner.TextSide>
//     <Banner.Title href={"/laternenumzuege"}>Laternenumzüge</Banner.Title>
//     <Banner.Text>
//       Eine der beliebtesten Herbsttraditionen für Kinder und Familien. Hier
//       könnt ihr mit euren Laternen durch die Straßen ziehen und gemeinsam
//       Lieder singen. Hier ist eine Zusammenstellung der kommenden
//       Laternenumzüge in Hamburg.
//     </Banner.Text>
//     <div
//       className="flex-grow min-h-32 h-32 xs:h-fit aspect-square min-w-32 mt-2 relative"
//       style={{ transform: "rotateY(180deg)" }}
//     >
//       <LaterneImage />
//     </div>
//   </Banner.TextSide>
//   <div className="min-h-full min-w-[320px] self-center md:self-stretch mt-4 flex items-center md:max-w-none max-w-52 sm:items-stretch justify-around flex-col sm:flex-row gap-4 rounded">
//     <EventsGallery />
//   </div>
// </Banner>
