import { getFlohmarktMetadata, getFlohmarktWithID } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import AddLatLon from "@app/components/AddLatLon";
import DeleteButton from "@app/components/DeleteButton";
import FlohmarktTemplate from "@app/components/FlohmarktTemplate";
import UpdateButton from "@app/components/UpdateButton";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { Metadata } from "next";
import React from "react";
import FlohmarktPageMapContainer from "./FlohmarktPageMapContainer";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import SpielplaetzeNearby from "./SpielplaetzeNearby";
import Link from "next/link";

interface FlohmarktPageProps {
  params: { flohmarktID: string };
}

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
  if (
    !flohmarkt ||
    flohmarkt.status === null ||
    !["approved", "old"].includes(flohmarkt.status)
  )
    return <NotFound type="flohmarkt" />;

  const spielplaetzeNearby =
    (await getSpielplatzFromBezirkStadtteil(
      flohmarkt.bezirk!,
      PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[flohmarkt.bezirk!] || [
        flohmarkt.stadtteil,
      ]
    )) || [];

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
            <AddLatLon item={flohmarkt} />
            <Link
              href={`/copy-flohmarkt/${flohmarkt.id}`}
              className="p-2 rounded bg-hh-900 text-hh-50"
            >
              Copy Flohmarkt
            </Link>
          </aside>
        </AdminServerComponent>
      </FlohmarktTemplate>
      <section className="w-full flex flex-wrap-reverse xl:flex-wrap justify-center gap-2">
        <FlohmarktPageMapContainer
          spielplaetzeAround={spielplaetzeNearby}
          currentTarget={flohmarkt}
        />
        <SpielplaetzeNearby
          spielplaetzeNearby={spielplaetzeNearby}
          lat={flohmarkt.lat}
          lon={flohmarkt.lon}
        />
      </section>
    </>
  );
}
