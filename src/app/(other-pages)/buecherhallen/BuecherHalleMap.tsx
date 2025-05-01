import { iPost } from "@app/utils/types";
import dynamic from "next/dynamic";
import React from "react";
import BuecherhalleIcon from "@components/@Icons/BuecherhalleIcon";

const GeneralMap = dynamic(() => import("@components/@Map/GeneralMap"), {
  ssr: false,
  loading: () => (
    <article className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh] overflow-hidden">
      <img
        src="/assets/bezirke/hamburg.webp"
        alt="Hamburg"
        className="w-full h-full object-cover"
      />
    </article>
  ),
});
const MarkersLists = dynamic(
  () => import("@components/@Map/PopUpsMarkers/MarkersLists"),
  {
    ssr: false,
  }
);
export default function BuecherhallenMap({
  buecherhallenPosts,
}: {
  buecherhallenPosts: iPost[];
}) {
  return (
    <div
      id="buecherhallenMap"
      className="w-full max-w-[800px] aspect-square sm:aspect-video max-h-[60vh] bg-gradient-to-b from-hh-800 to-hh-700 rounded-lg p-1 sm:p-2 flex flex-col gap-2 overflow-hidden"
    >
      <GeneralMap centerUserLocation>
        <MarkersLists
          cluster={false}
          lists={{ posts: buecherhallenPosts }}
          customIcon={"buecherhalle"}
          popUpIcon={<BuecherhalleIcon />}
        />
      </GeneralMap>
    </div>
  );
}
