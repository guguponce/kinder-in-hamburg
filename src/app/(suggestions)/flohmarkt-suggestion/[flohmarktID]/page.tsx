import { getFlohmarktWithID } from "@app/api/dbActions";
import AdminClientComponent from "@app/providers/AdminClientComponents";
import Link from "next/link";
import React from "react";

export default async function FlohmarktSuggestionPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const suggestion = await getFlohmarktWithID(flohmarktID);
  if (!suggestion)
    return <div>There was a problem retrieving the Flohmarkt info.</div>;

  return (
    <div>
      FlohTemplate
      <div className="flex self-center justify-center items-center rounded-md border-2 border-hh-600 bg-hh-200 mb-4 p-2">
        {suggestion.status === "approved" ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold">
              This sugggestion has already been approved
            </h2>
            <Link href={`/flohmaerkte/${suggestion.id}`}>Check it out!</Link>
          </div>
        ) : suggestion.status === "rejected" ? (
          <div className="flex flex-col items-center bg-negative-800 text-white rounded-md p-2">
            <h2 className="text-xl font-semibold">
              This sugggestion has been rejected
            </h2>
          </div>
        ) : (
          <div className="flex flex-col items-center ">
            <h2 className="text-xl font-semibold">
              This sugggestion has still not been approved
            </h2>
            <small className="text-xs">(You can modify it if you want)</small>
            <Link
              href={`/update-suggested-flohmarkt/${flohmarktID}`}
              className="px-2 py-1 bg-hh-700 hover:bg-hh-600 active:bg-hh-500 text-white rounded-md"
            >
              Update suggestion
            </Link>
          </div>
        )}
      </div>
      <AdminClientComponent>
        {/* <ApprovePostButton post={post} /> */}
        <Link
          href={`/update-suggested-flohmarkt/${flohmarktID}`}
          className="my-2 bg-hh-700 rounded-md text-center flex justify-center p-2 text-white hover:bg-hh-800 active:bg-hh-600"
        >
          Update Suggestion
        </Link>
      </AdminClientComponent>
    </div>
  );
}