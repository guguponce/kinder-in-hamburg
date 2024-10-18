import React from "react";
import FlohForm from "@components/@FlohForm/FlohForm";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import AdminRoute from "@app/providers/AdminRoute";
import { getEventWithID } from "@app/api/dbActions";

export default async function AddCopiedEvent({
  params,
}: {
  params: { eventID: string };
}) {
  const user = await getServerUser();
  if (!user) redirect("/");
  const event = await getEventWithID(params.eventID, "events");
  if (!event) redirect("/new-event");
  const id = new Date().getTime();
  const { email, full_name: name, picture: image } = user;
  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <div className="h-full w-full bg-hh-200 p-5 px-5">
          <h1 className="title-font mb-4 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
            Copy Event {event.title}
          </h1>
          <FlohForm
            flohFormType="new-event"
            FlohForm={{ ...event, id, createdAt: id }}
            user={{ email, name, image }}
          />
        </div>
      </main>
    </AdminRoute>
  );
}
