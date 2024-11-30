import FlohmarktPoster from "@app/components/@Cards/FlohmarktPoster";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { addressWithoutCity, getDate } from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import React from "react";

export default function AdventsEvents({
  adventsEventsByDate,
  schiffEvents,
}: {
  adventsEventsByDate: Record<string, iFlohmarkt[]>;
  schiffEvents: iFlohmarkt[];
}) {
  return (
    <section
      id="adventsEvents"
      className="p-4 rounded-lg bg-gradient-to-b shadow-2xl from-negative-100 to-negative-200 w-full max-w-[800px] flex gap-4 flex-wrap items-center text-negative-800 transition-all"
    >
      <div className="w-full flex flex-col gap-2 text-negative-800">
        <h2 className="text-3xl flex-grow font-bold ">Adventsaktivitäten</h2>

        <p className="italic">
          Auf den Weihnachtsmärkten in Hamburg gibt es für Kinder und Familien
          zahlreiche kreative Aktivitäten: Von Weihnachtssterne und Baumschmuck
          basteln, über Kinderschminken und Erzähltheater, bis hin zur
          festlichen Weihnachtsparade.
        </p>
        <p className="italic">
          Hier sind einige Veranstaltungen, an denen ihr während der Adventszeit
          teilnehmen könnt.
        </p>
      </div>
      <ScrollableContainer>
        {Object.entries(adventsEventsByDate).map(([date, events]) => (
          <article
            key={date}
            className="bg-gradient-to-br from-negative-900 to-negative-800 text-negative-50 bg-opacity-25 transition-all flex flex-col rounded p-2 pt-0 min-w-fit"
          >
            <h3 className="font-semibold p-2">
              {date === getDate(parseInt(date), true) ? "Heute" : date}
            </h3>
            <div className="min-w-fit flex gap-4 items-center">
              {events.map(
                ({
                  id,
                  type,
                  title,
                  image,
                  address,
                  date,
                  time,
                  stadtteil,
                }) => (
                  <div key={id} className="w-[360px] min-w-[300px]">
                    <HorizontalCard
                      key={id}
                      type={type}
                      title={title}
                      id={id}
                      link={`/events/${id}`}
                      image={image}
                    >
                      <HorizontalCard.FlohmarktInfo
                        title={title}
                        address={addressWithoutCity(address)}
                        stadtteil={stadtteil}
                        date={date}
                        time={time}
                      />
                    </HorizontalCard>
                  </div>
                )
              )}
            </div>
          </article>
        ))}
      </ScrollableContainer>
      <div className="w-full flex flex-col justify-center mt-4">
        <h3 className="text-2xl pb-0 font-semibold">
          Programm auf den Märchenschiffen
        </h3>
        <p className="italic text-sm">
          Vom 28. November bis 23. Dezember am Anleger Jungfernstieg können die
          Kleinen täglich in den Theaterschiff, Traumschiff und Backschiffe an
          verschiedenen Aktionen teilnehmen.
        </p>
        <ScrollableContainer>
          {schiffEvents.map((e) => (
            <article
              key={e.id}
              className={`overflow-hidden h-[250px] min-w-[180px] shadow-lg`}
            >
              <FlohmarktPoster
                title={e.title}
                image={e.image}
                date={e.date}
                bezirk={e.bezirk}
                prefixLink={
                  e.status === "approved" ? "/events/" : "/event-suggestion/"
                }
                id={e.id}
                eventType={e.type}
                size={"small"}
                endDate={e.endDate}
                stadtteil={e.stadtteil}
              />
            </article>
          ))}
        </ScrollableContainer>
      </div>
    </section>
  );
}
