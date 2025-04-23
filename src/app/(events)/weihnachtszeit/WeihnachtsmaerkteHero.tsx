import { iFlohmarkt } from "@app/utils/types";
import BezirkableList from "@components/BezirkableList";
import React from "react";

export default function WeihnachtsmaerkteHero({
  todayLaternenumzuege,
  orderedEvents,
}: {
  todayLaternenumzuege: iFlohmarkt[];
  orderedEvents: iFlohmarkt[];
}) {
  return (
    <section className="rounded-lg bg-gradient-to-b shadow-2xl from-negative-600 to-negative-700 text-negative-100 p-4 md:py-8 w-full flex gap-4 flex-col items-center max-w-full bg-opacity-10 transition-all">
      <div className="w-full max-w-[720px] flex flex-col gap-2 justify-between items-stretch">
        <h1 className="text-3xl flex-grow font-bold ">
          Weihnachtsmärkte in Hamburg <span className="text-2xl">🎄👧🧑‍🎄</span>
        </h1>

        <p className="italic">
          Die Weihnachtszeit bringt in Hamburg eine zauberhafte Stimmung mit
          sich, und die vielen Weihnachtsmärkte in der Stadt laden Familien und
          Freunde zum gemeinsamen Entdecken ein. Von kleinen, gemütlichen
          Nachbarschaftsmärkten bis hin zu großen, festlichen Veranstaltungen
          ist für jeden etwas dabei. Hier findet ihr eine Übersicht der
          kinderfreundlichsten Weihnachtsmärkte in Hamburg – perfekt, um die
          Vorweihnachtszeit in vollen Zügen zu genießen.
        </p>
      </div>
      <section className="self-start max-w-full flex justify-center items-center flex-wrap gap-4">
        {/* {!!todayLaternenumzuege.length && (
          <div className="flex flex-col items-center gap-1 w-[300px]">
            <h2 className="text-2xl font-semibold">Heute</h2>
            <ClientLaterneGallery eventsList={todayLaternenumzuege} />
          </div>
        )} */}

        <BezirkableList
          type="events"
          variant="transparent-dark"
          list={orderedEvents}
        />
      </section>
    </section>
  );
}
