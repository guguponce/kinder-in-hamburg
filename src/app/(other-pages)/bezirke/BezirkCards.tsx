import {
  getPostWithBezirk,
  getSuggestionsWithBezirk,
} from "@app/api/dbActions";
import CardsDisplay from "@app/components/@Cards/CardsDisplay";
import StackedCards from "@app/components/@Cards/StackedCards";
import { iBezirk } from "@app/utils/types";
import Link from "next/link";
import React from "react";

export default async function BezirkCards({ bezirk }: { bezirk: iBezirk }) {
  const bezirkPosts = await getSuggestionsWithBezirk(bezirk);
  if (!bezirkPosts) return <div>There was a problem retrieving posts</div>;
  if (bezirkPosts.length === 0) return <div>There are no posts to display</div>;
  const bezirkURL = `/bezirke/${bezirk.replace(" ", "-")}`;
  return (
    <article className="rounded-md w-[250px] shadow-md p-2 hover:shadow-2xl">
      <Link
        href={bezirkURL}
        className="hover:underline hover:underline-offset-4 text-lg font-semibold"
      >
        {bezirk}
      </Link>
      <StackedCards
        posts={bezirkPosts.slice(0, 3)}
        aspectRatio={0.66}
        link={bezirkURL}
        size="medium"
      />
    </article>
  );
}
