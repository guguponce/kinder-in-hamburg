import { getAllEventsFromType } from "@app/api/dbActions";
import StatusSetter from "@app/dashboard/StatusSetter";
import AdminClientComponent from "@app/providers/AdminClientComponents";
import {
  getTodayNexMonday,
  parseDescriptionWithTags,
} from "@app/utils/functions";
import { iEventType, iFlohmarkt } from "@app/utils/types";
import Link from "next/link";

export default async function AlteEvents({ type }: { type: iEventType[] }) {
  const { today } = getTodayNexMonday();
  const alleEvents = (
    await Promise.all(
      type.map(async (t) => (await getAllEventsFromType(t)) || [])
    ).then((res) => res.flat())
  )
    .filter((ev) => ev.status !== "rejected")
    .sort((a, b) => a.date - b.date);
  const { alteEvents, futureEvents } = alleEvents.reduce(
    (acc, event) => {
      if (event.endDate ? event.endDate < today : event.date < today) {
        acc.alteEvents.push(event);
      } else {
        acc.futureEvents.push(event);
      }
      return acc;
    },
    { alteEvents: [], futureEvents: [] } as {
      alteEvents: iFlohmarkt[];
      futureEvents: iFlohmarkt[];
    }
  );
  return (
    <AdminClientComponent>
      <div className="container mx-auto px-4 py-8 bg-hh-900">
        <h1 className="text-3xl font-bold mb-6">Alte Laternenumzüge</h1>
        {alteEvents.length === 0 ? (
          <p className="text-hh-50">Keine alten Laternenumzüge gefunden.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {futureEvents.map((event) => (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="text-positive-300 bg-hh-100 bg-opacity-10 p-4 rounded hover:bg-opacity-20 transition"
              >
                {event.title} - {new Date(event.date).toLocaleDateString()} - -{" "}
                {event.type} -{event.status}
              </Link>
            ))}
            {alteEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <Link
                  href={`/events/${event.id}`}
                  key={event.id}
                  className="text-negative-300 bg-hh-100 bg-opacity-10 p-4 rounded hover:bg-opacity-20 transition"
                >
                  {event.title} - {new Date(event.date).toLocaleDateString()} -{" "}
                  {event.status}
                </Link>
                <StatusSetter
                  horizontal
                  status={event.status}
                  target={event}
                  type="event"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminClientComponent>
  );
}
