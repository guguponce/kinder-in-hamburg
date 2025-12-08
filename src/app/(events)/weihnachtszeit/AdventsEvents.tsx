import { iFlohmarkt } from "@app/utils/types";
import EventsByDateList from "@app/components/@Cards/EventsByDateList";
import { getWeihnachtsEvents } from "@app/api/dbActions";
import { unstable_cache } from "next/cache";

const cachedWeihnachtsEvents = unstable_cache(
  getWeihnachtsEvents,
  ["flohmaerkte", "events"],
  {
    revalidate: 600,
  }
);
export default async function AdventsEvents({
  eventsByDate,
  schiffEvents,
}: {
  eventsByDate?: iFlohmarkt[];
  schiffEvents?: iFlohmarkt[];
}) {
  const { adventsEvents } = eventsByDate
    ? { adventsEvents: eventsByDate }
    : await cachedWeihnachtsEvents(["adventsevent"]);
  return (
    <EventsByDateList
      title="Adventsaktivitäten"
      description={`Auf den Weihnachtsmärkten in Hamburg gibt es für Kinder und Familien
          zahlreiche kreative Aktivitäten: Von Weihnachtssterne und Baumschmuck
          basteln, über Kinderschminken und Erzähltheater, bis hin zur
          festlichen Weihnachtsparade.
          Hier sind einige Veranstaltungen, an denen ihr während der Adventszeit
          teilnehmen könnt.`}
      events={[
        { eventsByDate: adventsEvents },
        {
          eventTitle: "Programm auf den Märchenschiffen",
          eventDescription:
            "Vom 28. November bis 23. Dezember am Anleger Jungfernstieg können die Kleinen täglich in den Theaterschiff, Traumschiff und Backschiffe an verschiedenen Aktionen teilnehmen.",
          eventsList: schiffEvents,
        },
      ]}
      color={{ tone: 100, colorName: "negative" }}
    ></EventsByDateList>
  );
}
