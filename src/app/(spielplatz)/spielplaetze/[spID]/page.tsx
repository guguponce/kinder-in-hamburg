import "./style.scss";
import { getSpielplatzWithID } from "@app/api/spActions";
import PostNotFound from "@app/components/@PostForm/PostNotFound";
import React from "react";
import SPBezirkMap from "./SPBezirkMapContainer";
import FlohmaerkteNearby from "../FlohmaerkteNearby";
import dynamic from "next/dynamic";
import ImagesModalButton from "@app/components/ImagesModalGallery";
import Spielgeraete from "./Spielgeraete";
import AdminRoute from "@app/providers/AdminRoute";

const SpielplatzgeraeteBackground = dynamic(
  () => import("@app/components/SpielplatzgeraeteBackground"),
  {
    ssr: false,
  }
);
export const revalidate = 3600 * 4; // 4 hours

export default async function SpielplatzPage({
  params: { spID },
}: {
  params: { spID: string };
}) {
  const spielplatz = await getSpielplatzWithID(spID);
  if (!spielplatz) return <PostNotFound type="spielplatz" />;
  const {
    id,
    lat,
    lon,
    title,
    spielgeraete = [],
    bezirk,
    stadtteil,
    type,
    image,
    text,
  } = spielplatz;
  return (
    <AdminRoute>
      <main
        id="spielplatz-page"
        className="w-full items-center gap-4 p-2 flex flex-col"
      >
        <h1
          id="spielplatz-header"
          className="text-3xl h-16 font-bold text-center text-hh-50 flex justify-center items-center"
        >
          {!title.toLowerCase().includes("spielplatz") && "Spielplatz "}
          {title}
        </h1>
        <div id="spielplatz-grid" className="w-full px-4">
          {spielgeraete && <Spielgeraete spielgeraete={spielgeraete} />}

          <section
            id="spielplatz-map-container"
            className="flex flex-col gap-2 p-2 bg-hh-200 bg-opacity-25 rounded-md w-full lg:h-fit lg:max-w-[400px]"
          >
            <SPBezirkMap currentSP={id} bezirk={bezirk} stadtteil={stadtteil} />
          </section>

          <div
            id="spielplatz-data"
            className="flex flex-col justify-start w-full h-fit relative overflow-hidden rounded-md bg-hh-50 bg-opacity-25"
          >
            <SpielplatzgeraeteBackground
              small={false}
              color="#47596b37"
              spList={spielgeraete}
              size="5rem"
            />

            {!!image?.length && (
              <section
                id="image-container"
                className="w-full h-72 bg-hh-950 bg-opacity-10 flex gap-2 p-2 pb-4 justify-center items-center"
              >
                <ImagesModalButton images={image} title={title} />
              </section>
            )}

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
          </div>
        </div>
        <FlohmaerkteNearby
          title={"Spielplatz " + title}
          bezirk={bezirk}
          stadtteil={stadtteil}
          lat={lat}
          lon={lon}
        />
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
    </AdminRoute>
  );
}
