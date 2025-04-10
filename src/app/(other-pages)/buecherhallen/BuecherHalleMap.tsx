"use client";
import { iPost } from "@app/utils/types";
import dynamic from "next/dynamic";
import React from "react";
import { buecherhalleDivIcon } from "@app/components/@Map/mapUtils/constants";
import MarkersLists from "@app/components/@Map/PopUpsMarkers/MarkersLists";
import BuecherhalleIcon from "@app/components/@Icons/BuecherhalleIcon";
import { useUserLocation } from "@app/utils/context/UserLocationContext";

const GeneralMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
  loading: () => (
    <article className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh]">
      <img
        src="/assets/bezirke/hamburg.webp"
        alt="Hamburg"
        className="w-full h-full object-cover"
      />
    </article>
  ),
});
const MemoGeneralMap = React.memo(GeneralMap);
export default function BuecherHalleMap({
  buecherhallenPosts,
}: {
  buecherhallenPosts: iPost[];
}) {
  const { userLocation } = useUserLocation();
  return (
    <div className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh] bg-hh-800 rounded-lg p-1 sm:py-2 flex flex-col gap-2 overflow-hidden">
      <MemoGeneralMap centerUserLocation userLocation={userLocation}>
        <MarkersLists
          lists={{ posts: buecherhallenPosts }}
          customIcon={buecherhalleDivIcon}
          popUpIcon={<BuecherhalleIcon />}
        />
      </MemoGeneralMap>
    </div>
  );
}
