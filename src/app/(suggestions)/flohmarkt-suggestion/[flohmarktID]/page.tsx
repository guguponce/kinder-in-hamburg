import { getFlohmarktWithID } from "@app/api/dbActions";
import ApproveFlohmarktButton from "@components/ApproveButton";
import DeleteButton from "@components/DeleteButton";
import FlohmarktTemplate from "@components/FlohmarktTemplate";
import Link from "next/link";
import React from "react";
import UpdateButton from "@app/components/UpdateButton";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import UserServerComponents from "@app/providers/UserServerComponents";
import RestoreButton from "@app/components/RestoreButton";
import AdminRoute from "@app/providers/AdminRoute";
import AddLatLon from "@app/components/AddLatLon";

import { iFlohmarktWithCoordinates } from "@app/utils/types";
import dynamic from "next/dynamic";
import NotFound from "@app/components/@NotFound/NotFound";

const FlohmaerkteMap = dynamic(
  () => import("@app/components/@Map/FlohmaerkteMap"),
  {
    ssr: false,
  }
);

export default async function FlohmarktSuggestionPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const suggestion = await getFlohmarktWithID(flohmarktID);
  if (!suggestion) return <NotFound type="flohmarkt" />;
  const session = await getServerUser();
  if (
    ![suggestion.addedBy.email, process.env.ADMIN_EMAIL].includes(
      session?.user?.email
    )
  )
    return redirect("/flohmaerkte/" + flohmarktID);
  return (
    <AdminRoute>
      <>
        <FlohmarktTemplate flohmarkt={suggestion}>
          <div className="flex self-center flex-col justify-center items-center rounded-md border-2 border-hh-600 bg-hh-200 mb-4 p-4 gap-2">
            {suggestion.status === "approved" ? (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">
                  This sugggestion has already been approved
                </h2>{" "}
                <Link
                  className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
                  href={`/flohmaerkte/${flohmarktID}`}
                >
                  Check it out
                </Link>
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
                <small className="text-xs">
                  (You can modify it if you want)
                </small>
              </div>
            )}

            {suggestion.status === "rejected" ? (
              <AdminServerComponent>
                <RestoreButton flohmarktID={flohmarktID} size="medium" />
                <DeleteButton
                  deleteFrom="all"
                  id={suggestion.id}
                  title={suggestion.title}
                  type="flohmarkt"
                  size="small"
                />
              </AdminServerComponent>
            ) : (
              <UserServerComponents creator={suggestion.addedBy.email}>
                <aside className="flex items-center justify-center gap-2 flex-wrap m-4">
                  <UpdateButton
                    id={suggestion.id}
                    status={suggestion.status || "pending"}
                    type="flohmarkt"
                    size="small"
                  />
                  <DeleteButton
                    deleteFrom={
                      session?.user?.email === suggestion.addedBy.email
                        ? "all"
                        : suggestion.status === "approved"
                        ? "approved"
                        : "suggested"
                    }
                    id={suggestion.id}
                    title={suggestion.title}
                    type="flohmarkt"
                    size="small"
                  />
                  {suggestion.status !== "approved" && (
                    <AdminServerComponent>
                      <ApproveFlohmarktButton
                        size="small"
                        flohmarktContributor={suggestion.addedBy}
                        flohmarktID={flohmarktID}
                      />
                    </AdminServerComponent>
                  )}
                  {!suggestion.lat && !suggestion.lon ? (
                    <AddLatLon item={suggestion} />
                  ) : (
                    <FlohmaerkteMap
                      flohmaerkteWithCoordinates={[]}
                      currentTarget={suggestion as iFlohmarktWithCoordinates}
                      flohmarktID={flohmarktID}
                    ></FlohmaerkteMap>
                  )}
                </aside>
              </UserServerComponents>
            )}
          </div>
        </FlohmarktTemplate>
        {/* other flohmarkts in the same bezirk */}
        <br />
        {/* other flohmarkts in the same WEEKEND */}
      </>
    </AdminRoute>
  );
}
