import { deleteFlohmarkt, getFlohmarktWithID } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import DeleteButton from "@app/components/DeleteButton";
import FlohmarktTemplate from "@app/components/FlohmarktTemplate";
import UpdateButton from "@app/components/UpdateButton";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import UserServerComponents from "@app/providers/UserServerComponents";
import { redirect } from "next/navigation";
import React from "react";

export default async function FlohmarktPage({
  params: { flohmarktID },
}: {
  params: { flohmarktID: string };
}) {
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt || flohmarkt.status !== "approved")
    return <PostNotFound type="flohmarkt" />;
  return (
    <FlohmarktTemplate flohmarkt={flohmarkt}>
      <AdminServerComponent>
        <aside className="flex gap-2 items-center justify-center mb-4">
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
      </AdminServerComponent>
    </FlohmarktTemplate>
  );
}
