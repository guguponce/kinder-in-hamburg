import { getSuggestedFlohmaerkte } from "@app/api/dbActions";
import AdminRoute from "@app/providers/AdminRoute";
import MinimalFlohmarktDisplay from "@components/MinimalFlohmarktDisplay";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ApprovalPage() {
  const session = await getServerUser();
  if (
    !session?.user?.email ||
    session.user.user_metadata.email !== process.env.ADMIN_EMAIL
  )
    redirect("/flohmaerkte/");
  const flohmaerkte = await getSuggestedFlohmaerkte();
  if (!flohmaerkte)
    return <div>There was a problem retrieving flohmaerkte</div>;
  if (flohmaerkte.length === 0)
    return <div>There are no flohmaerkte to display</div>;
  return (
    <AdminRoute>
      <div className="flex flex-col gap-4">
        {flohmaerkte
          .sort((a, b) => a.date - b.date)
          .map((flo) => (
            <div key={flo.id} className="rounded p-1 bg-hh-900">
              <MinimalFlohmarktDisplay flohmarkt={flo} />
              <p className="text-white uppercase">{flo.status}</p>
            </div>
          ))}
      </div>
    </AdminRoute>
  );
}
