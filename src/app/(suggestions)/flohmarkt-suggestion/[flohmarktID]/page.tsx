import { getEventWithID } from "@app/api/dbActions";
import FlohmarktTemplate from "@app/components/FlohmarktTemplate";
import React from "react";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import NotFound from "@app/components/@NotFound/NotFound";
import AdminEditButtons from "@app/components/@Buttons/AdminEditButtons";
import AdminRoute from "@app/providers/AdminRoute";
import StatusDisplay from "@app/components/StatusDisplay";

const SuggestedFlohmarktMap = dynamic(
  () => import("@app/components/@Map/GeneralMap"),
  {
    ssr: false,
  }
);

export default async function FlohmarktSuggestionPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const suggestion = await getEventWithID(flohmarktID);
  if (!suggestion) return <NotFound type="flohmarkt" />;
  const user = await getServerUser();
  if (
    !user ||
    ![suggestion.addedBy.email, process.env.ADMIN_EMAIL].includes(user.email)
  )
    return redirect("/flohmaerkte/" + flohmarktID);
  return (
    <AdminRoute>
      <>
        <FlohmarktTemplate flohmarkt={suggestion}>
          <StatusDisplay status={suggestion.status}>
            <StatusDisplay.Title>
              {suggestion.status === "approved"
                ? "Dieser Flohmarkt wurde schon angenommen"
                : suggestion.status === "rejected"
                  ? "Dieser Flohmarkt wurde abgelehnt"
                  : "Dieser Flohmarkt wurde noch nicht angenommen"}
            </StatusDisplay.Title>
            <StatusDisplay.Link
              href={
                suggestion.status === "approved"
                  ? `/flohmaerkte/${suggestion.id}`
                  : `/update-flohmarkt/${flohmarktID}`
              }
              status={suggestion.status}
            >
              <>
                <small className="block text-xs">
                  (You can modify it if you want)
                </small>
                {suggestion.status === "approved"
                  ? "Check it out!"
                  : "Update suggestion"}
              </>
            </StatusDisplay.Link>
          </StatusDisplay>{" "}
          <AdminEditButtons
            updateButton={{
              size: "medium",
              link: `/update-flohmarkt/${flohmarktID}`,
              status: suggestion.status || "pending",
              type: "flohmarkt",
            }}
            deleteButton={{
              deleteFrom:
                suggestion.status === "approved" ? "approved" : "suggested",
              id: suggestion.id,
              title: suggestion.title,
              type: "flohmarkt",
              size: "medium",
            }}
            copyButton={{ type: "flohmarkt", id: suggestion.id }}
            addLatLonButton={
              !suggestion.lat && !suggestion.lon
                ? { item: suggestion }
                : undefined
            }
            approveButton={
              suggestion.status !== "approved"
                ? {
                    size: "medium",
                    contributor: suggestion.addedBy,
                    flohmarktID: flohmarktID,
                  }
                : undefined
            }
          />
          {suggestion.lat && suggestion.lon && (
            <SuggestedFlohmarktMap currentTarget={suggestion} zoom={13} />
          )}
        </FlohmarktTemplate>
      </>
    </AdminRoute>
  );
}
