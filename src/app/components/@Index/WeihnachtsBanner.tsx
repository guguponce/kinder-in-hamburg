import React from "react";
import EventsGallery from "./laternenumzug/EventsGallery";
import PageTitle from "../PageTitle";
import Link from "next/link";
import WeihnachtsmarktIcon from "../@Icons/@Events/WeihnachtsmarktIcon";
import { getTodayNexMonday } from "@app/utils/functions";

export default function WeihnachtsBanner() {
  const { todaysMonth, todaysDate } = getTodayNexMonday();
  if (![1, 10, 11].includes(todaysMonth)) {
    return null;
  }

  return (
    <section className="p-4 relative rounded-lg bg-gradient-to-b  min-w-fit flex gap-2 flex-col items-center from-positive-700 via-positive-700 to-[#628d5a50] w-fit max-w-[420px] text-white bg-opacity-10 transition-all overflow-hidden">
      <div className="sm:gap-2 flex flex-col items-center w-full min-h-full ">
        {/* <div className="h-full flex flex-col items-center justify-between gap-2 w-fit rounded-3xl overflow-hidden bg-hh-950 bg-opacity-5"> */}
        <div className="min-h-fit min-w-[280px] w-full max-w-[300px] flex-grow flex items-center justify-around flex-col rounded">
          <PageTitle
            title="Weihnachtsmärkte"
            className="text-4xl"
            link="/weihnachtszeit"
          />

          <h4 className="text-center text-sm sm:text-base italic lg:backdrop-blur-sm mb-2">
            {todaysMonth === 10 && todaysDate <= 15
              ? "Die Weihnachtssaison hat gerade erst begonnen! Entdecke jetzt die kommenden Events und Märkte."
              : todaysMonth === 11 && todaysDate >= 20
                ? "Die Weihnachtssaison ist fast zu Ende, aber es gibt noch ein paar Events und Märkte!"
                : "Die Weihnachtssaison ist in vollem Gange! Entdecke jetzt die kommenden Events und Märkte."}
          </h4>
          <EventsGallery eventType="adventsevent" />
        </div>
        <div className="h-12 relative flex justify-between items-end w-full pb-2">
          <Link
            href={"/weihnachtszeit"}
            className="underline underline-offset-2 font-semibold px-2 text-end text-white self-end hover:scale-[1.01] transition-all hover:underline-offset-4"
          >
            alle entdecken
          </Link>
          <div className="h-12 aspect-square">
            <WeihnachtsmarktIcon desaturate size="h-12" />
          </div>
        </div>
        {/* </div> */}
      </div>
    </section>
    // <Banner
    //   textSide="right"
    //   href="/weihnachtszeit"
    //   linkText="alle erkunden"
    //   className="from-positive-700 via-positive-700 to-[#628d5a50] self-stretch bg-opacity-20 sm:max-w-[720px]"
    // >
    //   <div className="sm:hidden p-2">
    //     <Banner.Text>
    //       Wir haben die kinderfreundlichsten Weihnachtsmärkte in Hamburg für
    //       euch zusammengestellt.
    //     </Banner.Text>
    //   </div>
    //   {/* <div className="min-h-full min-w-[320px] self-center md:self-stretch mt-4 flex items-center md:max-w-none max-w-52 sm:items-stretch justify-around flex-col sm:flex-row gap-4 rounded">
    //     <EventsGallery eventType="adventsevent" />
    //   </div> */}
    //    <div className={cn("max-w-full aspect-[5/8]", shuffleContainerClassname)}>
    //           <ShuffleGallery
    //             idSetter={idSetter}
    //             list={shuffleList}
    //             size="small"
    //             dark
    //             transparent
    //             posterClassname="max-w-[180px] min-w-[180px] aspect-[3/4] bg-positive-900"
    //           />
    //   <Banner.TextSide>
    //     <Banner.Title href={"/weihnachtszeit"}>Weihnachtsmärkte</Banner.Title>
    //     <Banner.Text className="lg:text-base">
    //       Eine der schönsten Traditionen in dieser Jahreszeit ist der
    //       Weihnachtsmarkt. Hier könnt ihr mit Familie und Freunden bummeln und
    //       die festliche Atmosphäre genießen. Auf vielen Märkten gibt es
    //       spezielle Attraktionen oder Kinderprogramme, die die Kleinen in
    //       Weihnachtsstimmung versetzen.
    //     </Banner.Text>
    //     <div className="hidden sm:block">
    //       <Banner.Text className="lg:text-base">
    //         Wir haben die kinderfreundlichsten Weihnachtsmärkte in Hamburg für
    //         euch zusammengestellt.
    //       </Banner.Text>
    //     </div>
    //     {/* <div
    //       className="flex-grow min-h-32 h-32 xs:h-fit aspect-square min-w-32 mt-2 relative"
    //       style={{ transform: "rotateY(180deg)" }}
    //     >
    //       <LaterneImage />
    //     </div> */}
    //   </Banner.TextSide>
    // </Banner>
  );
}
