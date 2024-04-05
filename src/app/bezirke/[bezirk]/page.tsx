import { getSuggestionsWithBezirk } from "@app/api/dbActions";
import { getHamburgsWeather } from "@app/api/weatherAPI";
import TextPriorityCard from "@app/components/@Cards/Card";
import ScrollableCardList from "@app/components/@Cards/ScrollableCardList";
import WeatherBasedRecommendations from "@app/components/WeatherBasedRecommendations";
import { WEATHER_CODES, bezirke } from "@app/utils/constants";
import { getPlainText, parseParams } from "@app/utils/functions";
import { iBezirk, iParsedRetrievedPost } from "@app/utils/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function BezirkPage({
  params,
}: {
  params: { bezirk: string };
}) {
  const {
    current,
    forecast,
    location: { localtime },
  } = await getHamburgsWeather();
  const { activity, overallCondition } =
    WEATHER_CODES[current.condition.code.toString()];

  const now = new Date(localtime).getHours();
  const willRainRestOfDay = forecast.forecastday[1].hour
    .slice(now, 24)
    .some((h) => h.will_it_rain === 1);

  const activityType = !!willRainRestOfDay
    ? "Indoor"
    : activity === "Both"
    ? ["Indoor", "Outdoor"][Math.floor(Math.random() * 2)]
    : activity;

  const { bezirk } = params;
  const bezirkName = parseParams(bezirk);

  if (!bezirke.includes(bezirkName as iBezirk)) redirect("/bezirke");

  const bezirkPosts = await getSuggestionsWithBezirk(bezirkName as iBezirk);
  if (bezirkPosts.length === 0) redirect("/bezirke");

  const categorizedPosts = bezirkPosts.reduce((acc, post, i) => {
    post.categories.forEach((category) => {
      if (acc[category]) {
        acc[category].push(post);
      } else {
        acc[category] = [post];
      }
    });
    if (i === bezirkPosts.length - 1) {
      Object.keys(acc).forEach((category) => {
        if (!!acc[category]) {
          acc[category] = acc[category].sort(() => Math.random() - 0.5);
        }
      });
    }
    return acc;
  }, {} as { [key: string]: iParsedRetrievedPost[] });

  return (
    <>
      <Link
        href={"/bezirke"}
        className="linkBack block relative text-sm text-hh-700 px-6 hover:underline hover:underline-offset-4 min-w-fit mb-2"
      >
        <span className="absolute linkArrow">←</span>All Bezirke
      </Link>
      <WeatherBasedRecommendations
        overallCondition={overallCondition}
        currentTemp={current.temp_c}
        willRainRestOfDay={willRainRestOfDay}
        forecast={forecast}
      >
        <div>
          <h2 className="text-xl font-semibold capitalize">
            {activity} activities
          </h2>
          <small></small>
          <ScrollableCardList
            posts={[...categorizedPosts[activityType]]}
            cardType="text-priority"
            size="small"
          />
        </div>
      </WeatherBasedRecommendations>

      {Object.entries(categorizedPosts).map(([category, posts]) => (
        <section className="rounded-md shadow-md p-2 w-1/2" key={category}>
          <h2 className="text-lg font-semibold">{category}</h2>
          <ScrollableCardList
            posts={posts}
            size="small"
            cardType="img-priority"
            descriptions={true}
          />
        </section>
      ))}
      <section
        id="all-bezirk-posts"
        className="relative mt-4 rounded from-hh-600 to-hh-300 bg-gradient-to-b flex flex-col items-center p-4 gap-4"
      >
        <h2 className="font-bold text-3xl text-hh-100 p-4 bg-hh-100 bg-opacity-20 rounded-sm">
          All places in Altona
        </h2>
        <div className="filterableList">
          Filters
          <div className="filteredList flex flex-wrap items-stretch justify-center gap-4">
            {bezirkPosts.map(({ id, title, image, text, categories }) => (
              <React.Fragment key={id}>
                <TextPriorityCard
                  id={id}
                  title={title}
                  image={image ? image[0] : ""}
                  description={getPlainText(text)}
                  categories={categories[0]}
                  link={`/posts/${id}`}
                  size="small"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
