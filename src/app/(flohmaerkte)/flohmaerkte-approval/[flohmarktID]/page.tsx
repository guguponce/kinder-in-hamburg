import { getFlohmarktWithID } from "@app/api/dbActions";
import DeleteButton from "@app/components/DeleteButton";
import UpdateButton from "@app/components/UpdateButton";
import AdminRoute from "@app/providers/AdminRoute";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function FlohmarktApprovalPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const session = await getServerSession();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL)
    redirect("/flohmaerkte/" + flohmarktID);
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt) return <>Flohmarkt not found</>;
  if (flohmarkt.status === "approved") return <>Flohmarkt already approved</>;
  return (
    <AdminRoute>
      <aside className="flex flex-wrap justify-center items-center gap-2 p-4">
        <UpdateButton
          size="medium"
          id={flohmarkt.id}
          status={flohmarkt.status || "pending"}
          type="flohmarkt"
        />
        <DeleteButton
          deleteFrom="approved"
          id={flohmarkt.id}
          title={flohmarkt.title}
          type="flohmarkt"
          size="medium"
        />
      </aside>
    </AdminRoute>
  );
}
