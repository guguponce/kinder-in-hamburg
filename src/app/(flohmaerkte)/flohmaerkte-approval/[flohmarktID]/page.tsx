import { getFlohmarktWithID } from "@app/api/dbActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function FlohmarktApprovalPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/flohmaerkte/" + flohmarktID);
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <>Flohmarkt not found</>;
  if (flohmarkt.status === "approved") return <>Flohmarkt already approved</>;
  return (
    <div>
      {flohmarkt.title}
      <br />
      template aproval
      <br />
      button
    </div>
  );
}
