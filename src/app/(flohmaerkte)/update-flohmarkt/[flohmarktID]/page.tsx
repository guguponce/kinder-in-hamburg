import { getEventWithID } from "@app/api/dbActions";
import ClearLatLonButton from "@app/components/@Icons/@Flohmarkt/ClearLatLonButton";
import AdminRoute from "@app/providers/AdminRoute";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import FlohForm from "@components/@FlohForm/FlohForm";
import NotFound from "@components/@NotFound/NotFound";
import { getServerUser } from "@app/api/auth/supabaseAuth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { iUserMetadata } from "@app/api/auth/types";
import AdminEditButtons from "@app/components/@Buttons/AdminEditButtons";

export default async function UpdateApprovedFlohmarktPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const user = await getServerUser();
  const flohmarkt = await getEventWithID(flohmarktID);
  if (!flohmarkt) return <NotFound />;
  if (
    !flohmarkt.addedBy.email ||
    !user?.email ||
    ![flohmarkt.addedBy.email, process.env.ADMIN_EMAIL].includes(user.email)
  )
    redirect("/flohmaerkte/" + flohmarktID);

  if (flohmarkt.status === "rejected")
    return (
      <main className="mx-auto flex h-fit w-full max-w-[400px] flex-col items-center justify-center rounded-md bg-hh-100 p-4 gap-4 text-center">
        <h2 className="font-semibold text-xl">
          For some reason the suggested flohmarkt {'"'}
          {flohmarkt.title}
          {'"'} was rejected
        </h2>
        <Link
          className="px-2 py-1 rounded-md font-semibold bg-hh-700 text-white hover:bg-hh-600"
          href="/dashboard"
        >
          Go to your dashboard
        </Link>
      </main>
    );
  const { email, full_name: name, picture: image } = user;
  return (
    <AdminRoute>
      <main className="relative mb-10 mt-6 max-w-[1000px] w-full bg-hh-100 rounded-xl p-4 text-gray-200 lg:mx-8">
        <AdminServerComponent>
          <AdminEditButtons
            deleteButton={{
              deleteFrom:
                flohmarkt.status === "approved" ? "approved" : "suggested",
              id: flohmarkt.id,
              title: flohmarkt.title,
              type: "flohmarkt",
              size: "medium",
            }}
            approveButton={
              flohmarkt.status !== "approved"
                ? {
                    flohmarktID,
                    size: "medium",
                    contributor: flohmarkt.addedBy,
                  }
                : undefined
            }
            addLatLonButton={
              !flohmarkt.lat || !flohmarkt.lon ? { item: flohmarkt } : undefined
            }
          >
            {flohmarkt.lat ||
              (flohmarkt.lon && (
                <ClearLatLonButton type="flohmarkt" id={flohmarktID} />
              ))}
          </AdminEditButtons>
        </AdminServerComponent>
        <div className="h-full w-full bg-hh-200 p-5 px-5">
          <h1 className="title-font mb-4 text-center text-xl font-bold text-gray-900 sm:text-3xl">
            UPDATE {flohmarkt.status === "approved" ? "APPROVED" : "SUGGESTED"}{" "}
            FLOHMARKT
          </h1>
          <FlohForm
            flohFormType="update-flohmarkt"
            FlohForm={flohmarkt}
            user={{ email, name, image }}
          />
        </div>
      </main>
    </AdminRoute>
  );
}
