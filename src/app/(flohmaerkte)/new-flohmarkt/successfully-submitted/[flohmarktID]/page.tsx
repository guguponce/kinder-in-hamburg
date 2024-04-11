import SuccessfulFormFlohmarkt from "@app/(flohmaerkte)/SuccessfulFormFlohmarkt";
import React from "react";

export default function SuccessfulNewFlohmarkt({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  return (
    <SuccessfulFormFlohmarkt
      submitType="suggestion"
      flohmarktID={flohmarktID}
    />
  );
}
