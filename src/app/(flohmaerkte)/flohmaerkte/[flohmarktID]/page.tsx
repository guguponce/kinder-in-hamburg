import { getEventMetadata, getEventWithID } from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import FlohmarktTemplate from "@app/components/FlohmarktTemplate";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { Metadata } from "next";
import React from "react";
import FlohmarktPageMapContainer from "./FlohmarktPageMapContainer";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import SpielplaetzeNearby from "./SpielplaetzeNearby";
import AdminEditButtons from "@app/components/AdminEditButtons";
import OldFlohmarktSign from "./OldFlohmarktSign";

interface FlohmarktPageProps {
  params: { flohmarktID: string };
}

export async function generateMetadata({
  params,
}: FlohmarktPageProps): Promise<Metadata> {
  const flohInfo = await getEventMetadata(params.flohmarktID);
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
  const flohmarkt = await getEventWithID(flohmarktID);
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
        {flohmarkt.status === "old" && <OldFlohmarktSign />}
        <AdminServerComponent>
          <AdminEditButtons
            updateButton={{
              size: "medium",
              link: `/update-flohmarkt/${flohmarkt.id}`,
              status: flohmarkt.status || "pending",
              type: "flohmarkt",
            }}
            deleteButton={{
              deleteFrom: "approved",
              id: flohmarkt.id,
              title: flohmarkt.title,
              type: "flohmarkt",
              size: "medium",
            }}
            copyButton={{ type: "flohmarkt", id: flohmarkt.id }}
            addLatLonButton={{ item: flohmarkt }}
          />
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
