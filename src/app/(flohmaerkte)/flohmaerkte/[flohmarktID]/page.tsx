import {
  checkIfEventOrFlohmarktExists,
  getEventMetadata,
  getEventWithID,
} from "@app/api/dbActions";
import NotFound from "@components/@NotFound/NotFound";
import FlohmarktTemplate from "@components/FlohmarktTemplate";
import AdminServerComponent from "@app/providers/AdminServerComponents";
import type { Metadata } from "next";
import React from "react";
import FlohmarktPageMapContainer from "./FlohmarktPageMapContainer";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import SpielplaetzeNearby from "./SpielplaetzeNearby";
import AdminEditButtons from "@components/@Buttons/AdminEditButtons";
import OldFlohmarktSign from "./OldFlohmarktSign";
import { getDate, parseDescriptionWithTags } from "@app/utils/functions";
import { redirect } from "next/navigation";
import FlohmaerkteSameLocation from "./FlohmaerkteSameLocation";
import { createMetadata, singleFlohmarktMetadata } from "@app/utils/metadata";
import StatusSetter from "@app/dashboard/StatusSetter";
import { unstable_cache } from "next/cache";

export const revalidate = 300;

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
  const { title, optionalComment, image, stadtteil, bezirk, date } =
    flohmarktInfo;
  const description = parseDescriptionWithTags(optionalComment?.slice(0, 200));
  const fullDescription = `Flohmarkt in ${stadtteil || ""}${bezirk ? `, ${bezirk}. ` : ". "}${
    description
  }`;
  const fullTitle =
    title ||
    `Flohmarkt in ${stadtteil || bezirk || "Hamburg"}${date ? ` am ${getDate(date, "short", false, false)}` : ""}`;
  return createMetadata({
    title: fullTitle,
    description: fullDescription,
    image,
    pathname: `/flohmaerkte/${flohmarktID}`,
    robots: flohmarktInfo.status === "approved",
    keywords: [title || "", ...singleFlohmarktMetadata],
  });
}

const getFlohmarkt = unstable_cache(getEventWithID, ["flohmaerkte"], {
  revalidate: 300,
});

export default async function FlohmarktPage({
  params: { flohmarktID },
}: FlohmarktPageProps) {
  const flohmarkt = await getFlohmarkt(flohmarktID);
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
      PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[flohmarkt.stadtteil!] || [
        flohmarkt.stadtteil,
      ],
    )) || [];
  return (
    <>
      <FlohmarktTemplate flohmarkt={flohmarkt}>
        <OldFlohmarktSign status={flohmarkt.status || ""} date={flohmarkt.date}>
          <AdminServerComponent>
            <div className="flex flex-col items-center justify-center p-2 rounded bg-hh-800 text-hh-50">
              <p>Today: {getDate(new Date().getTime())}</p>
              <p>Flohmarkt date: {getDate(flohmarkt.date)}</p>
              <StatusSetter
                horizontal
                type="flohmarkt"
                status={flohmarkt.status || "pending"}
                target={flohmarkt}
              />
            </div>
          </AdminServerComponent>
        </OldFlohmarktSign>
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
      <FlohmaerkteSameLocation
        location={flohmarkt.location || ""}
        image={!!flohmarkt.image}
        flohmarktID={flohmarktID}
      />
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
