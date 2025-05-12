import {
  checkIfEventOrFlohmarktExists,
  getEventMetadata,
  getEventWithID,
} from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import FlohmarktTemplate from "@components/FlohmarktTemplate";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import { Metadata } from "next";
import React from "react";
import FlohmarktPageMapContainer from "./FlohmarktPageMapContainer";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import SpielplaetzeNearby from "./SpielplaetzeNearby";
import AdminEditButtons from "@components/@Buttons/AdminEditButtons";
import OldFlohmarktSign from "./OldFlohmarktSign";
import { parseDescriptionWithTags } from "@app/utils/functions";
import { redirect } from "next/navigation";

interface FlohmarktPageProps {
  params: { flohmarktID: string };
}

export async function generateMetadata({
  params: { flohmarktID },
}: FlohmarktPageProps): Promise<Metadata> {
  const flohmarktInfo = await getEventMetadata(flohmarktID, "flohmaerkte");
  if (!flohmarktInfo)
    return {
      title: "Flohmarkt nicht gefunden",
      description: "Der Flohmarkt wurde nicht gefunden.",
    };
  const {
    title,
    optionalComment: description,
    image,
    stadtteil,
  } = flohmarktInfo;
  return {
    title: title,
    description: "Flohmarkt in " + stadtteil || "" + " " + description || "",
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/flohmaerkte/" + flohmarktID,
      title: title,
      description: parseDescriptionWithTags(description?.slice(0, 100)),
      images:
        flohmarktInfo.image || process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      description: parseDescriptionWithTags(description?.slice(0, 100)),
      title: title,
      images:
        flohmarktInfo.image || process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/events/" + flohmarktID,
      card: "summary_large_image",
    },
  };
}

export default async function FlohmarktPage({
  params: { flohmarktID },
}: FlohmarktPageProps) {
  const flohmarkt = await getEventWithID(flohmarktID);
  if (flohmarkt === false) {
    const eventID = await checkIfEventOrFlohmarktExists(flohmarktID, "events");
    if (!!eventID) {
      redirect("/events/" + eventID);
    }
  }
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
      <section className="w-full flex flex-wrap-reverse lg:flex-wrap justify-center gap-2 px-1 xs:px-2">
        <FlohmarktPageMapContainer
          spielplaetzeAround={spielplaetzeNearby}
          currentTarget={flohmarkt}
          mapClassName="bg-hh-700 bg-opacity-90"
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
