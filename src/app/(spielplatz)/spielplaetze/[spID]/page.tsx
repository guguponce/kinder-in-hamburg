import "./style.scss";
import { getSpielplatzMetadata, getSpielplatzWithID } from "@app/api/spActions";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import SPBezirkMap from "./SPBezirkMapContainer";
import FlohmaerkteNearby from "../FlohmaerkteNearby";
import dynamic from "next/dynamic";
import ImagesModalGallery from "@components/ImagesModalGallery";
import { Metadata } from "next";
import AdminEditButtons from "@components/@Buttons/AdminEditButtons";
import LocationBox from "@components/@Templates/LocationBox";
import DisplayTypeText from "@components/@PostForm/DisplayTypeText";
import PageTitle from "@components/PageTitle";
import { unstable_cache } from "next/cache";
import { parseDescriptionWithTags } from "@app/utils/functions";

interface SpielplatzPageProps {
  params: { spID: string };
}

const SpielplatzgeraeteBackground = dynamic(
  () => import("@components/@Cards/SpielplatzgeraeteBackground"),
  {
    ssr: false,
  }
);

const getSpielplatzData = unstable_cache(
  getSpielplatzWithID,
  ["spielplaetze", "posts"],
  {
    tags: ["spielplaetze", "posts"],
    revalidate: 600,
  }
);

export async function generateMetadata({
  params,
}: SpielplatzPageProps): Promise<Metadata> {
  const spInfo = await getSpielplatzMetadata(params.spID);
  if (!spInfo)
    return {
      title: "Spielplatz nicht gefunden",
      description: "Der Spielplatz wurde nicht gefunden.",
    };
  const { title, text: description, image, bezirk, stadtteil } = spInfo;
  return {
    title: title,
    description:
      "Spielplatz in " + stadtteil || "" + bezirk
        ? `,${bezirk}. `
        : ". " + description || "",
    openGraph: {
      type: "website",
      url: "https://www.kinder-in-hamburg.de/spielplaetze/" + params.spID,
      title: title,
      description: parseDescriptionWithTags(description?.slice(0, 100)),
      images: spInfo.image || process.env.BASE_URL + "opengraph-image.png",
      siteName: "Kinder in Hamburg",
    },
    twitter: {
      description: parseDescriptionWithTags(description?.slice(0, 100)),
      title: title,
      images: spInfo.image || process.env.BASE_URL + "opengraph-image.png",
      site: "https://www.kinder-in-hamburg.de/spielplaetze/" + params.spID,
      card: "summary_large_image",
    },
  };
}

export default async function SpielplatzPage({
  params: { spID },
}: {
  params: { spID: string };
}) {
  const spielplatz = await getSpielplatzData(spID);
  if (!spielplatz) return <NotFound type="spielplatz" />;
  const {
    id,
    lat,
    lon,
    title,
    spielgeraete = [],
    bezirk,
    address,
    status,
    stadtteil,
    type,
    image,
    text,
  } = spielplatz;
  const addressQuery = spielplatz.address
    ? Object.values(spielplatz.address)
        .map((part) => part.replace(" ", "+"))
        .join("+")
    : "";
  const types = type.filter((t) => t !== "outdoor");
  return (
    <main
      id="spielplatz-page"
      className="w-full items-center gap-2 p-2 flex flex-col"
    >
      <AdminEditButtons
        updateButton={{
          link: "/update-spielplatz/" + spID,
          size: "medium",
          status,
          type: "spielplatz",
        }}
        deleteButton={{
          deleteFrom:
            status === "pending" || status === "approved" ? "approved" : "all",
          id: parseInt(spID),
          title,
          type: "spielplatz",
          size: "medium",
        }}
        addLatLonButton={{ item: spielplatz }}
        approveButton={
          status !== "approved"
            ? {
                spielplatzID: spID,
                size: "medium",
                redirect: false,
              }
            : undefined
        }
        copyButton={{ type: "spielplatz", id: parseInt(spID) }}
      />
      <div
        id="spielplatz-header"
        className="text-4xl min-h-16 font-bold text-center text-hh-50 flex flex-col justify-center items-center gap-2 lg:p-4 lg:pb-0"
      >
        <PageTitle
          className="m-0"
          title={
            title.toLowerCase().includes("spielplatz")
              ? title
              : "Spielplatz " + title
          }
        />
        {!!types.length && (
          <div className="flex justify-center items-center flex-wrap gap-2 text-base text-hh-950 px-2 pb-2">
            {types
              .filter((t) => t !== "outdoor")
              .map((t) => (
                <h3
                  // href={"/spielplaetze/type/" + t}
                  key={t}
                  className="capitalize rounded-xl bg-hh-50 bg-opacity-90 text-hh-950 px-2 hover:bg-hh-100 transition-colors"
                >
                  {t}
                </h3>
              ))}
          </div>
        )}
      </div>
      <div id="spielplatz-grid" className="w-full xs:px-2 sm:px-4">
        {/* {spielgeraete && <Spielgeraete spielgeraete={spielgeraete} />} */}
        <section
          id="spielplatz-map-container"
          className="flex flex-col gap-2 p-2 bg-hh-50 bg-opacity-50 rounded-md w-full lg:h-fit lg:max-w-[400px] mb-2"
        >
          <div className="flex justify-center gap-2 w-full max-w-[800px] mx-auto min-h-32 rounded">
            <LocationBox
              address={address}
              bezirk={bezirk}
              stadtteil={stadtteil}
              className="lg:w-full lg:mx-4"
            />
          </div>
          <SPBezirkMap currentSP={id} bezirk={bezirk} stadtteil={stadtteil} />
        </section>
        <section
          id="spielplatz-data"
          className="flex flex-col justify-start items-center gap-2 w-full h-fit lg:h-full overflow-hidden flex-grow mb-2"
        >
          <SpielplatzgeraeteBackground
            small={false}
            color="#47596b37"
            spList={spielgeraete}
            size="5rem"
          />
          <div className="flex flex-col justify-start w-full h-fit relative overflow-hidden rounded-md bg-hh-50 bg-opacity-50">
            {!!image?.length && (
              <section
                id="image-container"
                className="w-full h-72 bg-hh-950 bg-opacity-10 flex gap-2 p-2 pb-4 justify-center items-center"
              >
                <ImagesModalGallery images={image} title={title} />
              </section>
            )}

            {!!text && (
              <section
                id="description-container"
                className="w-full h-fit rounded-md p-4 z-10"
              >
                <DisplayTypeText text={text} type="paragraph" />
              </section>
            )}
          </div>
        </section>
        <FlohmaerkteNearby
          title={"Spielplatz " + title}
          bezirk={bezirk}
          stadtteil={stadtteil}
          lat={lat}
          lon={lon}
        />
      </div>

      {/* <CategoryBezirkStadtteileRecommendation
        lat={lat}
        lon={lon}
        bezirk={bezirk}
        id={id}
        stadtteile={
          PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[bezirk] || [stadtteil]
        }
        indoor={type.includes("indoor")}
        planschbecken={type.includes("planschbecken")}
      /> */}
    </main>
  );
}
