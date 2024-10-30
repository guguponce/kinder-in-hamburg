import { getSuggestedEvents } from "@app/api/dbActions";
import AdminRoute from "@app/providers/AdminRoute";
import MinimalEventDisplay from "@components/MinimalEventDisplay";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ApprovalPage() {
  const user = await getServerUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/events/");
  const allEvents = await getSuggestedEvents("events");
  if (!allEvents) return <div>There was a problem retrieving events</div>;
  const events = allEvents
    .filter((e) => ["pending", "rejected"].includes(e.status))
    .sort((a, b) => a.date - b.date);
  if (events.length === 0) return <div>There are no events to display</div>;
  return (
    <AdminRoute>
      <div className="flex flex-col gap-4">
        {events.map((ev) => (
          <div key={ev.id} className="rounded p-1 bg-hh-900">
            <MinimalEventDisplay flohmarkt={ev} type="event" />
            <p className="text-white uppercase">{ev.status}</p>
          </div>
        ))}
      </div>
    </AdminRoute>
  );
}
