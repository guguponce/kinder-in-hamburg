import {
  getAllFlohmaerkte,
  getApprovedFlohmaerkte,
  getSuggestedFlohmaerkte,
} from "@app/api/dbActions";
import { iFlohmarkt } from "@app/utils/types";
import React from "react";

export default async function page() {
  const allFlohs = await getAllFlohmaerkte();
  const allApprovedFlohs = await getApprovedFlohmaerkte();
  const suggestedFlohs = await getSuggestedFlohmaerkte();

  return (
    <div>
      {(
        [allFlohs, allApprovedFlohs, suggestedFlohs] as (iFlohmarkt[] | false)[]
      ).map((flohList, i) =>
        flohList === false || !flohList.length ? (
          <div key={i}>{i + 1} not retrieved</div>
        ) : (
          <div key={i}>
            {flohList.map((floh) => (
              <div key={floh.title}>{floh.title}</div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
