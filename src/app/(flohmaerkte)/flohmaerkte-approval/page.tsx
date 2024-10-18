import { getSuggestedEvents } from "@app/api/dbActions";
import AdminRoute from "@app/providers/AdminRoute";
import MinimalEventDisplay from "@components/MinimalEventDisplay";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ApprovalPage() {
  const user = await getServerUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL)
    redirect("/flohmaerkte/");
  const alleFlohmaerkte = await getSuggestedEvents();
  if (!alleFlohmaerkte)
    return <div>There was a problem retrieving flohmaerkte</div>;
  const flohmaerkte = alleFlohmaerkte.filter((floh) =>
    ["pending", "rejected"].includes(floh.status)
  );
  if (flohmaerkte.length === 0)
    return <div>There are no flohmaerkte to display</div>;

  return (
    <AdminRoute>
      <div className="flex flex-col gap-4">
        {flohmaerkte
          .sort((a, b) => a.date - b.date)
          .map((flo) => (
            <div key={flo.id} className="rounded p-1 bg-hh-900">
              <MinimalEventDisplay flohmarkt={flo} />
              <p className="text-white uppercase">{flo.status}</p>
            </div>
          ))}
      </div>
    </AdminRoute>
  );
}
