import { getPostsByCategoryBezirkStadtteile } from "@app/api/dbActions";
import ScrollableCardList from "@components/@Cards/ScrollableCardList";
import { categoryName, iBezirk } from "@app/utils/types";
import React from "react";
import PinnedPostsSpielplaetzeNearby from "./PinnedPostsStadtteil";

export default async function CategoryBezirkStadtteileRecommendation({
  planschbecken,
  indoor,
  bezirk,
  stadtteile,
  id,
  lat,
  lon,
}: {
  planschbecken: boolean;
  indoor: boolean;
  bezirk: iBezirk;
  stadtteile: string[];
  id: number;
  lat: number;
  lon: number;
}) {
  const posts = await getPostsByCategoryBezirkStadtteile(bezirk, stadtteile);
  const coldMonths = new Date().getMonth() < 6 || new Date().getMonth() > 8;
  const categoryArray = [
    !indoor && coldMonths ? "Indoor" : planschbecken ? "Badeplatz" : null,
    indoor ? "Indoor" : "Outdoor",
  ].filter(Boolean) as categoryName[];

  if (!posts || posts.length === 0) return null;
  const categoriesPosts = posts.filter(
    ({ categories, id: postID }) =>
      categoryArray.some((cat) => categories.includes(cat)) &&
      postID !== id &&
      (coldMonths && categories.includes("Badeplatz") ? false : true)
  );
  const pinnedPosts = posts;
  return (
    <section className="min-w-full flex justify-center items-stretch max-w-[1000px] gap-4">
      <div className="p-4 pl-12 w-fit max-w-[50%] ml-5rem flex flex-col justify-center items-center">
        <h2
          className={`absolute z-50 bottom-1/2 pt-8 translate-y-1/2 ${
            categoryArray.length === 1 && "translate-x-full"
          } -left-2 text-2xl overflow-hidden w-fit h-full items-stretch font-bold rotate-180 text-hh-800 flex flex-col`}
          style={{ writingMode: "vertical-rl", textOrientation: "revert" }}
        >
          {categoryArray.map((cat, i) => (
            <span className="block leading-none h-fit" key={cat}>
              {i === 1 ? `und ${cat}` : cat}
            </span>
          ))}
        </h2>
        <ScrollableCardList
          posts={categoriesPosts}
          size="small"
          cardType="text-priority"
        />
      </div>
      <div className="p-4 w-fit max-w-[50%] flex flex-col justify-center items-center rounded-md border-2 border-hh-800">
        <h2 className="text-2xl w-fit flex-grow font-bold  text-hh-800 flex flex-col justify-center items-start">
          Highlights{" "}
          <span className="text-sm block font-bold">(in Umkreis von 1 km)</span>
        </h2>
        <PinnedPostsSpielplaetzeNearby
          bezirk={bezirk}
          stadtteile={stadtteile}
          pinnedPosts={pinnedPosts}
          id={id}
          lat={lat}
          lon={lon}
        />
      </div>
    </section>
  );
}
