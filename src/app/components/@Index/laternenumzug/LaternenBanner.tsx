import React from "react";
import EventsGallery from "./EventsGallery";
import LaterneImage from "./LaterneImage";
import Image from "next/image";
import Link from "next/link";
import PageTitle from "@app/components/PageTitle";

export default function LaternenBanner() {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisDay = today.getDate();
  if (thisMonth < 8 && thisMonth > 11) {
    return null;
  }

  return (
    <section className="p-4 relative rounded-lg bg-gradient-to-b  min-w-fit flex gap-2 flex-col items-center from-hh-950 to-hh-800  w-fit max-w-[420px] text-white bg-opacity-10 transition-all overflow-hidden">
      <div className="sm:gap-2 flex flex-col items-center w-full min-h-full ">
        <Image
          style={{ left: "-6px" }}
          fill
          src={"/assets/icons/laterne/stars.svg"}
          alt="stars"
          className="absolute top-0 min-w-[1200px] max-h-[150px] bg-opacity-25 rounded-lg opacity-50 -z-1"
        />
        <div className="h-full flex flex-col items-center justify-between gap-2 w-fit rounded-3xl overflow-hidden bg-hh-950 bg-opacity-5">
          <div className="min-h-fit min-w-[280px] w-full max-w-[300px] flex-grow flex items-center justify-around flex-col rounded">
            <PageTitle
              title="Laternenumzüge"
              className="text-4xl"
              link="/laternenumzuege"
            />

            <h4 className="text-center text-sm sm:text-base italic lg:backdrop-blur-sm mb-2">
              {thisMonth === 9 && thisDay <= 15
                ? "Die Laternensaison hat gerade erst begonnen! Schau dir die kommenden Umzüge an."
                : thisMonth === 10 && thisDay >= 20
                  ? "Die Laternensaison ist fast zu Ende, aber es gibt noch ein paar Lichterumzüge vor dem Dezember!"
                  : "Die Laternensaison ist in vollem Gange! Schau dir die kommenden Umzüge an."}
            </h4>
            <EventsGallery eventType="laterne" />
          </div>
          <div className="relative flex justify-end w-full pb-2">
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
