import { getFlohmarktMetadata, getFlohmarktWithID } from "@app/api/dbActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import AddLatLonFlohmarkt from "@app/components/AddLatLonFlohmarkt";
import DeleteButton from "@app/components/DeleteButton";
import FlohmarktTemplate from "@app/components/FlohmarktTemplate";
import UpdateButton from "@app/components/UpdateButton";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { Metadata } from "next";
import React from "react";
import MapContainer from "./FlohmarktPageMapContainer";

interface FlohmarktPageProps {
  params: { flohmarktID: string };
}

export const revalidate = 0;

export async function generateMetadata({
  params,
}: FlohmarktPageProps): Promise<Metadata> {
  const flohInfo = await getFlohmarktMetadata(params.flohmarktID);
  if (!flohInfo)
    return {
      title: "Flohmarkt nicht gefunden",
      description: "Der Flohmarkt wurde nicht gefunden.",
    };
  return {
    title: flohInfo.title,
    description:
      "Flohmarkt in " + flohInfo.bezirk + " " + flohInfo.optionalComment,
  };
}

export default async function FlohmarktPage({
  params: { flohmarktID },
}: FlohmarktPageProps) {
  const flohmarkt = await getFlohmarktWithID(flohmarktID);
  if (!flohmarkt || flohmarkt.status !== "approved")
    return <PostNotFound type="flohmarkt" />;
  return (
    <>
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
            <AddLatLonFlohmarkt item={flohmarkt} />
          </aside>
        </AdminServerComponent>
      </FlohmarktTemplate>
      <MapContainer currentTarget={flohmarkt} />
    </>
  );
}
