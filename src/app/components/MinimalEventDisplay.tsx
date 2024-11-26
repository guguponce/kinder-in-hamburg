import type { iFlohmarkt } from "@app/utils/types";
import React from "react";
import Link from "next/link";
import DataDisplay from "./SuggestedDataDisplay";
import DeleteButton from "./@Buttons/DeleteButton";

export default function MinimalEventDisplay({
  type = "flohmarkt",
  flohmarkt: { title, date, bezirk, id, addedBy, image },
}: {
  type?: "flohmarkt" | "event";
  flohmarkt: iFlohmarkt;
}) {
  return (
    <article className="rounded-md p-4 flex flex-wrap w-full bg-hh-100 bg-opacity-80 gap-2">
      <div className="h-[200px] aspect-square bg-hh-200 rounded-md">
        <img
          loading="lazy"
          src={image}
          alt={title}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <DataDisplay keyName={"Title"}>
          <h2 className="font-semibold">{title}</h2>
        </DataDisplay>
        <DataDisplay keyName={"Date"}>
          <h2 className="font-semibold">
            {new Date(date).toLocaleDateString()}
          </h2>
        </DataDisplay>
        <DataDisplay keyName={"Bezirk"}>
          <h2 className="font-semibold">{bezirk}</h2>
        </DataDisplay>

        <div className="flex gap-4 flex-wrap items-center">
          <Link
            className={`rounded bg-hh-500 px-2 md:py-1 py-2 font-bold text-white hover:bg-hh-700 `}
            href={`/${type === "flohmarkt" ? "flohmarkt-suggestion" : "events"}/${id}`}
          >
            Check Suggestion
          </Link>
          <DeleteButton
            type={type}
            size="small"
            id={id}
            callbackURL={
              type === "flohmarkt" ? "/flohmarkt-approval" : "/events-approval"
            }
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
