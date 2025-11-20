import {
  getApprovedPostWithID,
  getEventsFromBezirkStadtteil,
  getEventWithID,
  getPostsFromBezirkStadtteile,
} from "@app/api/dbActions";
import {
  getSpielplatzFromBezirkStadtteil,
  getSpielplatzWithID,
} from "@app/api/spActions";
import StandortIcon from "@components/@Icons/StandortIcon";
import MarkersLists from "@components/@Map/PopUpsMarkers/MarkersLists";
import { PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK } from "@app/utils/constants";
import { cn, filterByDistance, getTodayNexMonday } from "@app/utils/functions";
import {
  iBezirk,
  iFlohmarkt,
  iListsFPS,
  iPost,
  iSpielplatz,
} from "@app/utils/types";
import dynamic from "next/dynamic";
import React from "react";

const GeneralMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
  loading: () => (
    <article
      id="map"
      className="w-full max-w-[800px] min-h-[400px] rounded-md bg-gradient-to-b from-hh-500 to-hh-400 flex flex-col gap-2 p-2 mx-auto text-hh-50"
    >
      <img
        src="/assets/bezirke/hamburg.webp"
        alt="Hamburg"
        className="w-full h-full object-cover"
      />
    </article>
  ),
});
type iItemTypes = "flohmaerkte" | "posts" | "spielplaetze" | "events";
type iGetList = {
  list: iListsFPS;
  currentItem: iPost | iFlohmarkt | iSpielplatz | false;
};
async function getItemsNearby(
  type: iItemTypes,
  bezirk: iBezirk,
  stadtteile: string[]
) {
  switch (type) {
    case "flohmaerkte":
      return (await getEventsFromBezirkStadtteil(bezirk, stadtteile)) || [];
    case "posts":
      return (await getPostsFromBezirkStadtteile(bezirk, stadtteile)) || [];
    case "spielplaetze":
      return (await getSpielplatzFromBezirkStadtteil(bezirk, stadtteile)) || [];
    case "events":
      return (
        (await getEventsFromBezirkStadtteil(bezirk, stadtteile, "events")) || []
      );
    default:
      return [] as Array<iFlohmarkt | iPost | iSpielplatz>;
  }
}
async function getList(
  type: "flohmarkt" | "post" | "spielplatz" | "event",
  id: number,
  bezirk: iBezirk,
  stadtteile: string[],
  recommendationsList: iListsFPS = {},
  avoid?: Array<iItemTypes>
) {
  let acc: iGetList = {
    list: recommendationsList,
    currentItem: false,
  };
  const promises = ["flohmaerkte", "posts", "spielplaetze", "events"]
    .filter((key) => !avoid?.includes(key as (typeof avoid)[number]))
    .map(async (t) => {
      const itemType = t as "flohmaerkte" | "posts" | "spielplaetze" | "events";
      const itemsNearby =
        (recommendationsList[itemType] as iFlohmarkt[] &
          iPost[] &
          iSpielplatz[]) ||
        (await getItemsNearby(itemType, bezirk, stadtteile)) ||
        [];
      acc.list[itemType] = itemsNearby;
      const current =
        acc.currentItem ||
        acc.list[itemType]?.find((post) => post.id === id) ||
        (type === "post"
          ? //  await getSuggestedPostWithID(id.toString())
            await getApprovedPostWithID(id.toString())
          : type === "flohmarkt"
            ? await getEventWithID(id.toString())
            : type === "spielplatz"
              ? await getSpielplatzWithID(id.toString())
              : type === "event"
                ? await getEventWithID(id.toString(), "events")
                : false);

      acc.currentItem = current || false;
    });

  await Promise.all(promises);
  return acc;
}

export default async function RecommendationsMap({
  id,
  bezirk,
  stadtteil,
  maxDistance = 2000,
  currentType = "post",
  recommendationsList,
  showFlohmaerkte = true,
  showSpielplaetze = true,
  showPosts = true,
  onlyCurrentRef = false,
  containerClassName,
}: {
  containerClassName?: string;
  showFlohmaerkte?: boolean;
  showPosts?: boolean;
  showSpielplaetze?: boolean;
  onlyCurrentRef?: boolean;
  maxDistance?: number;

  currentType: "flohmarkt" | "post" | "spielplatz" | "event";
  id: number;

  bezirk: iBezirk;
  stadtteil: string;
  recommendationsList?: iListsFPS;
}) {
  const stadtteile = PROXIMATE_STADTTEILE_FROM_OTHER_BEZIRK[stadtteil];
  const {
    currentItem,
    list: {
      flohmaerkte: flohmaerkteNearby,
      posts: postsNearby,
      spielplaetze: spielplaetzeNearby,
      events: eventsNearby,
    },
  } = await getList(
    currentType,
    id,
    bezirk,
    stadtteile,
    {
      flohmaerkte: recommendationsList?.flohmaerkte,
      posts: recommendationsList?.posts,
      spielplaetze: recommendationsList?.spielplaetze,
      events: recommendationsList?.events,
    },
    [
      showFlohmaerkte ? null : "flohmaerkte",
      showPosts ? null : "posts",
      showSpielplaetze ? null : "spielplaetze",
    ].filter((item): item is iItemTypes => item !== null)
  );
  if (
    !currentItem ||
    currentItem.lat === undefined ||
    currentItem.lon === undefined
  ) {
    return null;
  }
  const { nextMonday } = getTodayNexMonday();
  const lists = filterByDistance(
    currentItem.lat,
    currentItem.lon,
    {
      flohmaerkte: flohmaerkteNearby
        ? flohmaerkteNearby.filter(({ date }) => date < nextMonday)
        : [],
      posts: postsNearby || [],
      spielplaetze: spielplaetzeNearby || [],
      events: eventsNearby || [],
    },
    maxDistance
  );
  const defList = !!(
    Object.values(lists).filter((list) => !!list?.length).length > 1
  )
    ? lists
    : filterByDistance(
        currentItem.lat,
        currentItem.lon,
        {
          flohmaerkte: flohmaerkteNearby
            ? flohmaerkteNearby.filter(({ date }) => date < nextMonday)
            : [],
          posts: postsNearby || [],
          spielplaetze: spielplaetzeNearby || [],
        },
        maxDistance
      );
  if (currentType === "flohmarkt")
    defList.flohmaerkte = defList.flohmaerkte?.filter(
      (flohmarkt) => flohmarkt.id !== id
    );
  if (currentType === "post")
    defList.posts = defList.posts?.filter((post) => post.id !== id);
  if (currentType === "spielplatz")
    defList.spielplaetze = defList.spielplaetze?.filter(
      (spielplatz) => spielplatz.id !== id
    );
  if (currentType === "event") {
    defList.events = defList.events?.filter((event) => event.id !== id);
  }
  defList.flohmaerkte =
    currentType === "flohmarkt"
      ? recommendationsList?.flohmaerkte?.filter(
          ({ id: flohID }) => flohID !== id
        )
      : defList.flohmaerkte?.filter((sp) => sp.id !== id);

  const tags = {
    flohmaerkte: {
      color: "#7B3E5E",
      singular: "Flohmarkt",
      plural: "Flohmärkte",
      show: showFlohmaerkte,
    },
    posts: {
      color: "#33404D",
      singular: "Empfohlener Ort",
      plural: "Empfohlene Orte",
      show: showPosts,
    },
    spielplaetze: {
      color: "#405b3a",
      singular: "Spielplatz",
      plural: "Spielplätze",
      show: showSpielplaetze,
    },
    events: {
      color: "#de6c13",
      singular: "Veranstaltung",
      plural: "Veranstaltungen",
      show: true,
    },
  };
  const listsLength = Object.values(defList).filter((l) => !!l?.length).length;
  return (
    <article
      id="map"
      className={cn(
        "w-full max-w-[800px] min-h-[400px] rounded bg-hh-100 bg-opacity-20 flex flex-col gap-2 p-2 mx-auto text-hh-50",
        containerClassName
      )}
    >
      <div className="w-full h-[400px] flex-grow flex flex-col">
        {!onlyCurrentRef && (
          <h3 className="text-xl font-semibold w-fit lg:px-2">in der Nähe</h3>
        )}
        <GeneralMap zoom={14} currentTarget={currentItem || undefined}>
          <MarkersLists
            currentLocation={{ lat: currentItem.lat, lon: currentItem.lon }}
            cluster={false}
            lists={defList}
            showFlohmaerkte={showFlohmaerkte}
            showPosts={showPosts}
            showSpielplaetze={showSpielplaetze}
          />
        </GeneralMap>
      </div>
      <div className="w-full flex flex-col items-center">
        <div
          className={`w-fit max-w-full flex flex-col ${currentItem && listsLength === 3 && "md:flex-row md:gap-2"} flex-wrap items-stretch gap-1`}
        >
          <div className="w-fit flex flex-col gap-1  items-center md:items-start">
            <div className="w-fit max-w-full flex gap-2 bg-hh-800 bg-opacity-20 rounded p-1">
              <StandortIcon color="#b72f1e" />
              <p>{currentItem.title}</p>
            </div>
            {!onlyCurrentRef && !!defList.flohmaerkte?.length && (
              <div className="w-fit max-w-full flex gap-2 bg-hh-800 bg-opacity-20 rounded p-1">
                <StandortIcon color={tags.flohmaerkte.color} />
                <p>
                  {defList.flohmaerkte?.length}{" "}
                  {(defList.flohmaerkte || []).length < 2
                    ? tags.flohmaerkte.singular
                    : tags.flohmaerkte.plural}{" "}
                  {currentType === "flohmarkt" && "dieser Woche in Hamburg"}
                </p>
              </div>
            )}
          </div>

          {!onlyCurrentRef && (
            <div
              className={`flex flex-col items-center ${listsLength === 3 ? (currentType === "post" ? "md:items-start" : "md:items-end") : "md:items-start"} gap-1`}
            >
              {Object.entries(tags).map(
                ([key, { color, singular, plural, show }]) => {
                  const type = key as
                    | "flohmaerkte"
                    | "posts"
                    | "spielplaetze"
                    | "events";
                  const list = defList[type] as iFlohmarkt[] &
                    iPost[] &
                    iSpielplatz[];
                  if (type === "flohmaerkte") return null;
                  return (
                    show &&
                    !!list?.length && (
                      <div
                        key={type}
                        className="flex gap-2 bg-hh-800 bg-opacity-20 rounded p-1"
                      >
                        <StandortIcon color={color} />
                        <p>
                          {list?.length} {list?.length < 2 ? singular : plural}
                        </p>
                      </div>
                    )
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
