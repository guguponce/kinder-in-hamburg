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
        flohList === false ? (
          <div className="p-2 my-2 bg-positive-200" key={i}>
            {i + 1} not retrieved
          </div>
        ) : !flohList.length ? (
          <div className="p-2 my-2 bg-positive-200" key={i}>
            {i + 1} empty
          </div>
        ) : (
          <div className="p-2 my-2 bg-positive-300" key={i}>
            {i === 0
              ? "All Flohmaerkte"
              : i === 1
              ? "Approved Flohmaerkte"
              : "Suggested Flohmaerkte"}
            {flohList.map((floh, j) => (
              <div className="p-2 bg-positive-400" key={floh.title}>
                {j + 1} - {floh.title}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
