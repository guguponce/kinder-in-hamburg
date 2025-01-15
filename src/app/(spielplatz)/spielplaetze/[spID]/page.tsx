import "./style.scss";
import { getSpielplatzMetadata, getSpielplatzWithID } from "@app/api/spActions";
import NotFound from "@components/@NotFound/NotFound";
import React from "react";
import SPBezirkMap from "./SPBezirkMapContainer";
import FlohmaerkteNearby from "../FlohmaerkteNearby";
import dynamic from "next/dynamic";
import ImagesModalButton from "@app/components/ImagesModalGallery";
import Spielgeraete from "./Spielgeraete";
import PostLogo from "@app/components/@Icons/@PostLogo/PostLogo";
import Link from "next/link";
import { Metadata } from "next";
import BezirkIcon from "@components/@Icons/@BezirkIcon/BezirkIcon";
import AdminEditButtons from "@app/components/@Buttons/AdminEditButtons";

interface SpielplatzPageProps {
  params: { spID: string };
}

const SpielplatzgeraeteBackground = dynamic(
  () => import("@app/components/@Cards/SpielplatzgeraeteBackground"),
  {
    ssr: false,
  }
);

export async function generateMetadata({
  params,
}: SpielplatzPageProps): Promise<Metadata> {
  const flohInfo = await getSpielplatzMetadata(params.spID);
  if (!flohInfo)
    return {
      title: "Flohmarkt nicht gefunden",
      description: "Der Flohmarkt wurde nicht gefunden.",
    };
  return {
    title: flohInfo.title,
    description: "Flohmarkt in " + flohInfo.bezirk + " " + flohInfo.text,
  };
}

export default async function SpielplatzPage({
  params: { spID },
}: {
  params: { spID: string };
}) {
  const spielplatz = await getSpielplatzWithID(spID);
  if (!spielplatz) return <NotFound type="spielplatz" />;
  const {
    id,
    lat,
    lon,
    title,
    spielgeraete = [],
    bezirk,
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
  const { number } = spielplatz.address || { number: "" };
  return (
    <main
      id="spielplatz-page"
      className="w-full items-center gap-4 p-2 flex flex-col"
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
        className="text-4xl min-h-16 font-bold text-center text-hh-50 flex flex-col justify-center items-center gap-4 lg:p-4"
      >
        <h1 className="flex justify-center items-center flex-wrap">
          {!title.toLowerCase().includes("spielplatz") && "Spielplatz "}
          {title}
        </h1>
        {!!type.length && (
          <div className="flex justify-center items-center flex-wrap gap-2 text-base text-hh-950 p-2">
            {type.map((t) =>
              t === "outdoor" ? null : (
                <h3
                  // href={"/spielplaetze/type/" + t}
                  key={t}
                  className="capitalize rounded-xl bg-hh-50 px-2 hover:bg-hh-100 transition-colors"
                >
                  {t}
                </h3>
              )
            )}
          </div>
        )}
      </div>
      <div id="spielplatz-grid" className="w-full xs:px-2 sm:px-4 gap-4">
        {spielgeraete && <Spielgeraete spielgeraete={spielgeraete} />}
        <section
          id="spielplatz-map-container"
          className="flex flex-col gap-2 p-2 bg-hh-200 bg-opacity-25 rounded-md w-full h-fit lg:h-fit lg:max-w-[400px]"
        >
          <div className="flex justify-center gap-2 w-full max-w-[800px] mx-auto min-h-32 rounded">
            <div
              id="location"
              className="relative flex w-full max-w-[400px] h-fit rounded text-white bg-hh-600 bg-opacity-75 py-2 px-4"
            >
              <div className="flex flex-col justify-between flex-grow max-w-[66%]">
                <h2 className="text-lg font-semibold">Standort:</h2>
                {bezirk && (
                  <div className="flex gap-1 items-center">
                    <PostLogo logo="hamburg" color="#fefefe" />
                    <Link
                      href={`/bezirke/${encodeURIComponent(bezirk)}`}
                      id="bezirk"
                      className="block font-semibold italic hover:underline hover:underline-offset-2"
                    >
                      {bezirk}
                    </Link>
                  </div>
                )}
                {!!stadtteil && (
                  <div className="ml-6 flex gap-1 items-center">
                    {/* <PostLogo logo="stadtteil" color="#1F262E" /> */}
                    <p
                      id="stadtteil"
                      className="ml-1 block font-semibold italic"
                    >
                      {stadtteil}
                    </p>
                  </div>
                )}

                <section id="location" className="flex gap-[6px] ml-[2px]">
                  <div className="min-w-5 mt-1">
                    <PostLogo logo="map" color="#fefefe" size="20px" />
                  </div>
                  <Link
                    href={"https://www.google.com/maps/place/" + addressQuery}
                    className="italic hover:underline hover:underline-offset-2 flex flex-col flex-grow"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex flex-wrap gap-1">
                      <span className="block">
                        {spielplatz.address?.street}{" "}
                        {number && parseInt(number) > 0 && number},
                      </span>
                      <span className="block">
                        {spielplatz.address?.PLZ} {spielplatz.address?.city}
                      </span>
                    </span>
                  </Link>
                </section>
              </div>
              <div className="absolute right-4 h-full aspect-square w-32 top-0 flex justify-center items-center">
                <BezirkIcon bezirk={bezirk} />
              </div>
            </div>
          </div>
          <SPBezirkMap currentSP={id} bezirk={bezirk} stadtteil={stadtteil} />
        </section>
        <div
          id="spielplatz-data"
          className="flex flex-col justify-start items-center gap-4 w-full h-fit lg:h-full overflow-hidden flex-grow"
        >
          <SpielplatzgeraeteBackground
            small={false}
            color="#47596b37"
            spList={spielgeraete}
            size="5rem"
          />
          <div className="flex flex-col justify-start w-full h-fit relative overflow-hidden rounded-md bg-hh-50 bg-opacity-25">
            {!!image?.length && (
              <section
                id="image-container"
                className="w-full h-72 bg-hh-950 bg-opacity-10 flex gap-2 p-2 pb-4 justify-center items-center"
              >
                <ImagesModalButton images={image} title={title} />
              </section>
            )}

            {!!text && (
              <section
                id="description-container"
                className="w-full h-fit rounded-md p-4 z-10"
              >
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                  className="block max-w-full font-sans text-hh-950 italic font-semibold"
                >
                  {text}
                </p>
              </section>
            )}
          </div>

          <FlohmaerkteNearby
            title={"Spielplatz " + title}
            bezirk={bezirk}
            stadtteil={stadtteil}
            lat={lat}
            lon={lon}
          />
        </div>
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
