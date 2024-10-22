import { getAllEventsFromType } from "@app/api/dbActions";
import NotFound from "@app/components/@NotFound/NotFound";
import FlohPostersList from "@app/components/FlohPostersList";
import ScrollableContainer from "@app/components/ScrollableContainer";
import AdminRoute from "@app/providers/AdminRoute";
import React from "react";

export default async function LaternenumzuegePage() {
  const laternenEvents = await getAllEventsFromType("laterne");
  if (!laternenEvents) return <NotFound multiples type="event" />;
  if (!laternenEvents.length) return;
  return (
    <AdminRoute>
      <main className="flex flex-col w-full max-w-[800px] p-1">
        <h1>Laternenumzüge</h1>
        <p>
          Der Laternenumzug ist ein tolles Erlebnis für die ganze Familie. Hier
          findest du alle Infos und Termine für Laternenumzüge in Hamburg.
        </p>
        <section>
          <ScrollableContainer>
            <FlohPostersList flohList={laternenEvents} prefixLink="/events/" />
          </ScrollableContainer>
        </section>
      </main>
    </AdminRoute>
  );
}
