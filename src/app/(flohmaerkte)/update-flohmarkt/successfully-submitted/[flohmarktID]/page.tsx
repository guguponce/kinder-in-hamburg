import SuccessfulFormFlohmarkt from "@app/(flohmaerkte)/SuccessfulFormFlohmarkt";
import React from "react";

export default function SuccessfulApprovedFlohmarktUpdate({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  return (
    <SuccessfulFormFlohmarkt submitType="update" flohmarktID={flohmarktID} />
  );
}
