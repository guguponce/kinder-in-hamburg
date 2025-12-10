import HorizontalCard from "@components/@Cards/HorizontalCard";
import ScrollableContainer from "@components/ScrollableContainer";
import {
  addressWithoutCity,
  getDate,
  separateByDate,
} from "@app/utils/functions";
import { iFlohmarkt } from "@app/utils/types";
import React from "react";
import FlohmarktPoster from "./FlohmarktPoster";

function EventsSection({
  title,
  description,
  eventsByDate,
  eventsList,
  boxColor = "from-hh-900 to-hh-800 text-hh-50",
}: {
  title?: string;
  description?: string;
  eventsByDate?: Record<string, iFlohmarkt[]>;
  eventsList?: iFlohmarkt[];
  boxColor?: string;
}) {
  return (
    <div className="w-full flex flex-col justify-center">
      {title && <h3 className="text-2xl pb-0 font-semibold">{title}</h3>}
      {description && <p className="italic text-sm">{description}</p>}
      {(!!eventsList || !!eventsByDate) && (
        <ScrollableContainer>
          {eventsList?.map((e) => (
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

          {!!eventsByDate &&
            Object.entries(eventsByDate).map(([date, events]) => (
              <article
                key={date}
                className={`bg-gradient-to-br ${boxColor}  bg-opacity-25 transition-all flex flex-col rounded p-2 pt-0 min-w-fit`}
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
                      bezirk,
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
                            bezirk={bezirk}
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
      )}
    </div>
  );
}

export default function EventsByDateList({
  events,
  title,
  description,
  children,
  color,
}: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  events: {
    eventTitle?: string;
    eventDescription?: string;
    eventsByDate?: iFlohmarkt[];
    eventsList?: iFlohmarkt[];
  }[];
  color?: {
    tone: 100 | 800;
    colorName: "hh" | "negative" | "positive" | "orange";
  };
}) {
  const isDark = color?.tone === 800;
  const colors = {
    section: `bg-${color?.colorName || "hh"}-${isDark ? 800 : 300} from-${color?.colorName || "hh"}-${isDark ? 800 : 200} to-${color?.colorName || "hh"}-${isDark ? 800 : 300} text-${color?.colorName || "hh"}-${isDark ? 50 : 800}`,
    boxColor: `bg-${color?.colorName || "hh"}-${isDark ? 900 : 600} from-${color?.colorName || "hh"}-${isDark ? 900 : 600} to-${color?.colorName || "hh"}-${isDark ? 900 : 500} text-${color?.colorName || "hh"}-${isDark ? 900 : 50}`,
  };

  return (
    <section
      id="events-by-date-list"
      className={`p-4 rounded-lg bg-gradient-to-b ${colors.section} shadow-2xl w-full max-w-[800px] flex gap-4 flex-wrap items-center transition-all`}
    >
      <div className="w-full flex flex-col gap-2">
        <h2 className="text-3xl flex-grow font-bold ">{title}</h2>

        <p className="italic">{description}</p>
      </div>
      {events.map(
        ({ eventTitle, eventDescription, eventsByDate, eventsList }, index) => (
          <EventsSection
            key={index}
            title={eventTitle}
            description={eventDescription}
            eventsByDate={
              eventsByDate ? separateByDate(eventsByDate, true) : undefined
            }
            boxColor={colors.boxColor}
            eventsList={eventsList}
          />
        )
      )}
    </section>
  );
}
