import {
  getFlohmaerkteFromBezirkStadtteil,
  getPostsFromBezirkStadtteile,
} from "@app/api/dbActions";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import StandortIcon from "@app/components/@Icons/StandortIcon";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import { filterByDistance, getTodayNexMonday } from "@app/utils/functions";
import { iBezirk } from "@app/utils/types";
import dynamic from "next/dynamic";
import React from "react";

const GeneralMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
});

export default async function PostMap({
  id,
  bezirk,
  stadtteil,
}: {
  id: number;
  bezirk: iBezirk;
  stadtteil: string;
}) {
  const stadtteile = PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil];
  const postsNearby = await getPostsFromBezirkStadtteile(bezirk, stadtteile);
  if (!postsNearby) return null;
  const currentPost = postsNearby.splice(
    postsNearby.findIndex((post) => post.id === id)
  )[0];
  if (!currentPost || !currentPost.lat || !currentPost.lon) return null;
  const { nextMonday } = getTodayNexMonday();
  const flohmaerkteNearby = await getFlohmaerkteFromBezirkStadtteil(
    bezirk,
    stadtteile
  );
  const spielplaetzeNearby = await getSpielplatzFromBezirkStadtteil(
    bezirk,
    stadtteile
  );
  const lists = filterByDistance(
    currentPost.lat,
    currentPost.lon,
    {
      flohmaerkte: flohmaerkteNearby
        ? flohmaerkteNearby.filter(({ date }) => date < nextMonday)
        : [],
      posts: postsNearby || [],
      spielplaetze: spielplaetzeNearby || [],
    },
    1000
  );

  return (
    <article
      id="map"
      className="w-full max-w-[800px] min-h-[400px] rounded-md bg-hh-400 flex flex-col gap-2 p-2 mx-auto text-hh-50"
    >
      <div className="w-full h-[400px] flex-grow">
        <GeneralMap zoom={14} currentTarget={currentPost || undefined}>
          <MarkersLists lists={lists} />
        </GeneralMap>
      </div>
      <div className="flex flex-col w-full gap-2 items-center">
        <div className="lg:w-full flex flex-col sm:flex-row lg:flex-col flex-wrap justify-around items-center lg:items-start gap-2">
          <div className="min-w-fit sm:w-2/5 lg:w-fit flex gap-2 md:bg-hh-800 md:bg-opacity-10 rounded p-1">
            <StandortIcon color="#BC251F" />
            <p>{currentPost.title}</p>
          </div>

          {lists.flohmaerkte && lists.flohmaerkte.length > 0 && (
            <div className="min-w-fit sm:w-2/5 lg:w-fit flex gap-2 md:bg-hh-800 md:bg-opacity-10 rounded p-1">
              <StandortIcon color="#7B3E5E" />
              <p>
                {lists.flohmaerkte.length}{" "}
                {lists.flohmaerkte.length < 2 ? "Flohmarkt" : "Flohmärkte"}{" "}
                dieser Woche
              </p>
            </div>
          )}
          {lists.posts && lists.posts.length > 0 && (
            <div className="min-w-fit sm:w-2/5 lg:w-fit flex gap-2 md:bg-hh-800 md:bg-opacity-10 rounded p-1">
              <StandortIcon color="#33404D" />
              <p>
                {lists.posts.length}{" "}
                {lists.posts.length < 2 ? "Empfohlener Ort" : "Empfohlene Orte"}
              </p>
            </div>
          )}
          {lists.spielplaetze && lists.spielplaetze.length > 0 && (
            <div className="min-w-fit sm:w-2/5 lg:w-fit flex gap-2 md:bg-hh-800 md:bg-opacity-10 rounded p-1">
              <StandortIcon color="#17684D" />
              <p>
                {lists.spielplaetze.length}{" "}
                {lists.spielplaetze.length < 2 ? "Spielplatz" : "Spielplätze"}
              </p>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold lg:self-end">in der Nähe</h3>
      </div>
    </article>
  );
}
