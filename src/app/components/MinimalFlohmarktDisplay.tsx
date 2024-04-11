import type { iFlohmarkt } from "@app/utils/types";
import React from "react";
import Link from "next/link";
import DataDisplay from "./SuggestedDataDisplay";
import DeleteButton from "./DeleteButton";

export default function MinimalFlohmarktDisplay({
  flohmarkt: { title, date, bezirk, id, addedBy },
}: {
  flohmarkt: iFlohmarkt;
}) {
  return (
    <article className="rounded-md p-4 flex flex-col w-full">
      <DataDisplay keyName={"Title"}>
        <h2 className="font-semibold">{title}</h2>
      </DataDisplay>
      <DataDisplay keyName={"Date"}>
        <h2 className="font-semibold">{new Date(date).toLocaleDateString()}</h2>
      </DataDisplay>
      <DataDisplay keyName={"Bezirk"}>
        <h2 className="font-semibold">{bezirk}</h2>
      </DataDisplay>

      <div className="flex justify-between items-end mt-2">
        <div className="flex gap-4 flex-wrap items-center">
          <Link
            className={`rounded bg-hh-500 px-2 md:py-1 py-2 font-bold text-white hover:bg-hh-700 `}
            href={`/flohmaerkte-approval/${id}`}
          >
            Check Suggestion
          </Link>
          <DeleteButton
            type="flohmarkt"
            size="small"
            id={id}
            title={title}
            deleteFrom="suggested"
          />
        </div>
        <small className="self-end text-xs text-hh-500">
          suggested by: {addedBy.name} - {addedBy.email}
        </small>
      </div>
    </article>
  );
}
