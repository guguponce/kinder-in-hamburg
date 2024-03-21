import React from "react";
import CardsDisplay from "../CardsDisplay";
import { iRetrievedPost } from "@app/utils/types";

export default function RecommendedPosts({
  recommendedPosts,
}: {
  recommendedPosts: iRetrievedPost[];
}) {
  return (
    <section className="w-full lg:w-4/5 max-w-[1000px] p-2 md:p-4 bg-hh-600 shadow-md relative flex flex-col items-center">
      <h2
        className="w-4/5 my-4 text-center text-2xl font-bold"
        id={`recommendation-title`}
      >
        Recommendations of the month
      </h2>
      <CardsDisplay
        id="recommendation"
        cardType="homepage-recomendations"
        cardPosts={recommendedPosts}
      />
    </section>
  );
}
