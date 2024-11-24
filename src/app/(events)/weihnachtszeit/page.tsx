import { getFutureApprovedEventsFromType } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import BezirkableEventsList from "@components/BezirkableEventsList";
import React from "react";
import {
  addressWithoutCity,
  getTodayNexMonday,
  separateByDate,
} from "@app/utils/functions";
import dynamic from "next/dynamic";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import Link from "next/link";
import AddLatLon from "@components/AddLatLon";
import ClientLaterneGallery from "@app/components/@Index/laternenumzug/ClientEventsGallery";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import ScrollableContainer from "@app/components/ScrollableContainer";
import { iFlohmarkt } from "@app/utils/types";
import FlohmarktPoster from "@app/components/FlohmarktPoster";

const WeihnachtsmaerkteMap = dynamic(() => import("./WeihnachtsmaerkteMap"), {
  ssr: false,
  loading: () => (
    <article className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh]">
      <img
        src="/assets/bezirke/hamburg.webp"
        alt="Hamburg"
        className="w-full h-full object-cover"
      />
    </article>
  ),
});
export default async function LaternenumzuegePage() {
  // --------------------------------------------------------
  const weihnachtsmaerkte =
    await getFutureApprovedEventsFromType("weihnachtsmarkt");
  const adventsEvents: iFlohmarkt[] =
    (await getFutureApprovedEventsFromType("adventsevent")) || [];
  if (!weihnachtsmaerkte) return <NotFound multiples type="event" />;
  if (!weihnachtsmaerkte.length) return;
  const { today, nextMonday } = getTodayNexMonday();
  const lastMidnight = new Date(today).setHours(0, 0, 0, 0);

  const orderedEvents = [...weihnachtsmaerkte].sort((a, b) => a.date - b.date);
  const [futureEvents, thisWeekEvents] = orderedEvents.reduce(
    (acc, event) => {
      if (event.date < nextMonday - 1000 * 60 * 60 * 2) {
        acc[1].push(event);
      } else {
        acc[0].push(event);
      }
      return acc;
    },
    [[], []] as [typeof weihnachtsmaerkte, typeof weihnachtsmaerkte]
  );
  const schiffEventsIDS = [1732400443361, 1732318110756, 1732235057521];
  const [schiffEvents, andereEvents] = adventsEvents.reduce(
    (acc, event) => {
      if (schiffEventsIDS.includes(event.id)) {
        acc[0].push(event);
      } else {
        acc[1].push(event);
      }
      return acc;
    },
    [[], []] as [typeof adventsEvents, typeof adventsEvents]
  );
  const adventsEventsByDate = separateByDate(andereEvents);
  const todayLaternenumzuege = [...adventsEvents].filter(
    (event) => event.date < today
  );

  return (
    <main
      className={`flex flex-col gap-4 items-center w-full  ${!!todayLaternenumzuege.length ? "sm:max-w-[1000px]" : "sm:max-w-[800px]"} p-1 mb-4`}
    >
      <AdminServerComponent>
        <div className="flex flex-col gap-1 outline outline-2 outline-negative-200">
          {weihnachtsmaerkte.map((event) =>
            event.status !== "approved" || !event.lat || !event.lon ? (
              <Link
                key={event.id}
                href={"/events/" + event.id}
                className="flex gap-2 items-center flex-wrap bg-negative-600 text-negative-50"
              >
                <span className="font-semibold">{event.title}</span>
                {event.status !== "approved" && (
                  <span className="font-semibold">{event.status}</span>
                )}

                {!event.lat || (!event.lon && <AddLatLon item={event} />)}
              </Link>
            ) : null
          )}
        </div>
      </AdminServerComponent>
      <section
        style={{
          background: "linear-gradient(45deg, #982a1c 0%, #EE564B 100%)",
        }}
        className="p-4 md:py-8 rounded-lg  w-full flex gap-4 flex-col items-center max-w-full text-white shadow-xl bg-opacity-10 transition-all"
      >
        <div className="w-full max-w-[720px] flex flex-col gap-2 justify-between items-stretch">
          <h1 className="text-3xl flex-grow font-bold ">
            Weihnachtsmärkte in Hamburg <span className="text-2xl">🎄👧🧑‍🎄</span>
          </h1>

          <p className="italic">
            Die Weihnachtszeit bringt in Hamburg eine zauberhafte Stimmung mit
            sich, und die vielen Weihnachtsmärkte in der Stadt laden Familien
            und Freunde zum gemeinsamen Entdecken ein. Von kleinen, gemütlichen
            Nachbarschaftsmärkten bis hin zu großen, festlichen Veranstaltungen
            ist für jeden etwas dabei. Hier findet ihr eine Übersicht der
            kinderfreundlichsten Weihnachtsmärkte in Hamburg – perfekt, um die
            Vorweihnachtszeit in vollen Zügen zu genießen.
          </p>
        </div>
        <section className="self-start max-w-full flex justify-center items-center flex-wrap gap-4">
          {!!todayLaternenumzuege.length && (
            <div className="flex flex-col items-center gap-1 w-[300px]">
              <h2 className="text-2xl font-semibold">Heute</h2>
              <ClientLaterneGallery eventsList={todayLaternenumzuege} />
            </div>
          )}
          <div
            className={`flex-grow ${!!todayLaternenumzuege.length && "md:max-w-[calc(100%-332px)]"}`}
          >
            <BezirkableEventsList
              type="events"
              variant="transparent-dark"
              eventsList={orderedEvents}
            />
          </div>
        </section>
      </section>
      <article
        className="p-2 md:p-4 max-w-[800px] w-full mx-auto rounded-lg"
        style={{
          background: "linear-gradient(45deg, #4e7247 0%, #628d5a   100%)",
        }}
      >
        <WeihnachtsmaerkteMap
          darkBackground
          square={false}
          currentEvents={thisWeekEvents}
          future={futureEvents}
          today={lastMidnight}
        />
      </article>
      {!!adventsEvents.length && (
        <section
          id="adventsEvents"
          className="p-4 rounded-lg bg-gradient-to-b shadow-2xl from-negative-100 to-negative-200 w-full max-w-[800px] flex gap-4 flex-wrap items-center text-negative-800 transition-all"
        >
          <div className="w-full flex flex-col gap-2 text-negative-800">
            <h2 className="text-3xl flex-grow font-bold ">
              Adventsveranstaltungen
            </h2>

            <p className="italic">
              Die Adventszeit ist die perfekte Gelegenheit, um gemeinsam kreativ
              zu werden. Kinder und Familien haben viel Freude daran,
              Weihnachtsdekorationen selbst zu gestalten – von Adventskränzen
              über Weihnachtsschmuck bis hin zu kleinen Geschenken für Freunde
              und Familie. Ob aus Papier, Tannenzweigen oder Holz, der Fantasie
              sind keine Grenzen gesetzt.
            </p>
            <p className="italic">
              Hier sind einige Orte in Hamburg, an denen ihr während der
              Adventszeit an Bastelaktionen teilnehmen könnt. 🎨✨
            </p>
          </div>
          <ScrollableContainer>
            {Object.entries(adventsEventsByDate).map(([date, events]) => (
              <article
                key={date}
                className="bg-gradient-to-br from-negative-900 to-negative-800 text-negative-50 bg-opacity-25 transition-all flex flex-col rounded p-2 pt-0 min-w-fit"
              >
                <h3 className="font-semibold p-2">{date}</h3>
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
              Vom 28. November bis 23. Dezember am Anleger Jungfernstieg können
              die Kleinen täglich in den Theaterschiff, Traumschiff und
              Backschiffe an verschiedenen Aktionen teilnehmen.
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
                      e.status === "approved"
                        ? "/events/"
                        : "/event-suggestion/"
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
      )}
    </main>
  );
}
