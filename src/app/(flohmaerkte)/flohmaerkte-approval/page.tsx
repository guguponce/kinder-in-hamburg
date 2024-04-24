import { getSuggestedFlohmaerkte } from "@app/api/dbActions";
import MinimalFlohmarktDisplay from "@components/MinimalFlohmarktDisplay";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ApprovalPage() {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/flohmaerkte/");
  const flohmaerkte = await getSuggestedFlohmaerkte();
  if (!flohmaerkte)
    return <div>There was a problem retrieving flohmaerkte</div>;
  if (flohmaerkte.length === 0)
    return <div>There are no flohmaerkte to display</div>;
  return (
    <div className="flex flex-col gap-4">
      {flohmaerkte.map((flo) => (
        <React.Fragment key={flo.id}>
          <MinimalFlohmarktDisplay flohmarkt={flo} />
        </React.Fragment>
      ))}
    </div>
  );
}
