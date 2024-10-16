import {
  getApprovedPostWithCat,
  getFlohmarktWithID,
  getPostWithBezirk,
} from "@app/api/dbActions";
import { addLatLongToPost } from "@app/utils/functions";
import { categoryName, iPost } from "@app/utils/types";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default async function DynamicCategoryMap({
  category,
  catPosts,
}: {
  catPosts?: iPost[];
  category: categoryName;
}) {
  const categoryPosts = catPosts || (await getApprovedPostWithCat(category));

  if (!categoryPosts) return <>No posts from the zone</>;
  const postsWithCoordinates = (
    await Promise.all(categoryPosts.map(async (post) => addLatLongToPost(post)))
  ).filter(Boolean) as iPost[];

  return (
    <Map
      postID={postsWithCoordinates[0].id.toString()}
      postsNearby={postsWithCoordinates}
    />
  );
}
