import { getPostsByCategoryBezirkStadtteile } from "@app/api/dbActions";
import { getSpielplatzFromBezirkStadtteil } from "@app/api/spActions";
import HorizontalCard from "@app/components/@Cards/HorizontalCard";
import ScrollableContainer from "@app/components/ScrollableContainer";
import {
  getPlainText,
  haversineDistance,
  isTypeSpielplatz,
} from "@app/utils/functions";
import { iBezirk, iPost, iSpielplatz } from "@app/utils/types";
import React from "react";

export default async function PinnedPostsSpielplaetzeNearby({
  pinnedPosts,
  stadtteile,
  id,
  bezirk,
  lat,
  lon,
}: {
  bezirk: iBezirk;
  stadtteile: string[];
  pinnedPosts: iPost[];
  id?: number;
  lat: number;
  lon: number;
}) {
  const pinnedSpielplaetzeAround =
    (await getSpielplatzFromBezirkStadtteil(bezirk, stadtteile)) || [];
  const listPostsSpielplaetze = [
    ...pinnedSpielplaetzeAround,
    ...pinnedPosts,
  ].filter(
    ({ id: itemID, lat: itemLat, lon: itemLon }) =>
      itemID !== id &&
      itemLat &&
      itemLon &&
      haversineDistance(lat, lon, itemLat, itemLon) < 1000
  );
  return (
    <ScrollableContainer>
      {listPostsSpielplaetze.map((item) => (
        <article
          key={item.id}
          className="min-w-[300px] max-w-[300px] aspect-[2] sm:min-w-[400px] sm:max-w-[400px] sm:aspect-[2.5] mr-2"
        >
          <HorizontalCard
            spielgeraete={
              isTypeSpielplatz(item) ? (item as iSpielplatz).spielgeraete : []
            }
            id={item.id}
            title={item.title}
            image={
              typeof item.image === "string"
                ? item.image
                : !item.image
                ? ""
                : item.image[0]
            }
            description={
              typeof item.text === "string"
                ? item.text
                : getPlainText(item.text)
            }
            link={
              isTypeSpielplatz(item)
                ? `/spielplaetze/${item.id}`
                : `/posts/${item.id}`
            }
          />
        </article>
      ))}
    </ScrollableContainer>
  );
}
