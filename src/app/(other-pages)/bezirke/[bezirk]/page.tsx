import {
  getApprovedEventsWithBezirk,
  getSuggestionsWithBezirk,
} from "@app/api/dbActions";
import {
  checkBezirk,
  parseParams,
  sortPostsByDate,
} from "@app/utils/functions";
import { iBezirk } from "@app/utils/types";
import React from "react";
import FilterablePostList from "@app/components/FilterablePostList";
import NotFound from "@components/@NotFound/NotFound";
import WeatherBox from "@app/components/@Weather/WeatherBox";
import BezirkeScrollableEvents from "@app/components/BezirkeScrollableEvents";
import PointsGallery from "@app/components/@PostForm/PointsGallery";
import AdminRoute from "@app/providers/AdminRoute";

export default async function BezirkPage({
  params: { bezirk: bez },
}: {
  params: { bezirk: string };
}) {
  const bezirk = parseParams(bez);
  if (!checkBezirk(bezirk)) return <NotFound type="bezirk" />;
  const bezirkPosts = await getSuggestionsWithBezirk(bezirk as iBezirk);
  if (!bezirkPosts) return <NotFound multiples />;

  const flohmaerkte = await getApprovedEventsWithBezirk(bezirk as iBezirk);
  const pinnedPosts = bezirkPosts.filter((post) => post.pinnedPost);
  return (
    <AdminRoute>
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <h1 className="text-4xl text-white font-bold">{bezirk}</h1>
        <section
          id="bezirk-hero"
          className="flex flex-wrap-reverse gap-4 justify-center w-full h-fit"
        >
          <article className="h-[40dvh] min-h-[425px] aspect-[0.75]">
            <PointsGallery
              horizontal={false}
              posts={
                !!pinnedPosts.length
                  ? pinnedPosts.slice(0, 3)
                  : sortPostsByDate(bezirkPosts).slice(0, 3)
              }
            >
              <h2 className="text-2xl font-semibold text-hh-50 bg-hh-900 bg-opacity-50 rounded p-1  w-fit">
                {!!pinnedPosts.length ? "#BestOf" : "#LatestPosts"}
              </h2>
            </PointsGallery>
          </article>

          <article className="max-h-[40dvh] min-h-[425px] w-[600px] max-w-screen md:aspect-[2.25] aspect-[1.5] bg-black">
            <WeatherBox
              full
              weatherAtRight
              bezirk={bezirk as iBezirk}
              posts={bezirkPosts}
            />
          </article>
        </section>
        {!!flohmaerkte && !!flohmaerkte.length && (
          <section className="w-full flex justify-center items-center bg-gradient-to-b from-hh-600 to-hh-500 bg-opacity-25 rounded">
            <BezirkeScrollableEvents
              events={flohmaerkte.sort((a, b) => a.date - b.date)}
              bezirk={bezirk as iBezirk}
              title="Flohmärkte"
            />
          </section>
        )}

        <section className="w-full max-w-[1000px]">
          <FilterablePostList postsList={bezirkPosts} />
        </section>
      </div>
    </AdminRoute>
  );
}
