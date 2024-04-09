import { getFlohmarktWithID } from "@app/api/dbActions";
import React from "react";

export default async function FlohmarktPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <div>Flohmarkt not found</div>;
  if (flohmarkt.status === "rejected") return <div>Rejected</div>;
  if (flohmarkt.status === "pending") return <div>Pending</div>;
  return <div>{flohmarkt.title}</div>;
}
