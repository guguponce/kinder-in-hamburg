import { getPostsWithCat } from "@app/api/dbActions";
import { iPost } from "@app/utils/types";
import React from "react";
import ToggleListView from "./ToggleListView";
import { cn } from "@app/utils/functions";
import GeneralContainer from "./GeneralContainer";

export default async function IndoorOutdoorTabsList({
  posts,
  className,
}: {
  className?: string;
  posts?: iPost[];
}) {
  const postsList =
    posts || (await getPostsWithCat(["Indoor", "Outdoor"], true));
  if (!postsList) return null;
  const { Indoor, Outdoor } = postsList.reduce(
    (acc, post) => {
      if (post.categories.includes("Indoor")) acc.Indoor.push(post);
      if (post.categories.includes("Outdoor")) acc.Outdoor.push(post);
      return acc;
    },
    { Indoor: [], Outdoor: [] } as { Indoor: iPost[]; Outdoor: iPost[] }
  );
  return (
    <GeneralContainer type="section" classname={className}>
      <ToggleListView
        classname={cn("flex-grow min-w-[300px] max-w-[600px]", className)}
        postsList={{
          Indoor,
          Outdoor,
        }}
        firstDisplayCategory="Indoor"
      />
    </GeneralContainer>
  );
}
