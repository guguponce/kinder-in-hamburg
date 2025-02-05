import { getPostsWithCat } from "@app/api/dbActions";
import { addLatLongToPost } from "@app/utils/functions";
import { categoryName, iPost } from "@app/utils/types";
import dynamic from "next/dynamic";
import MarkersLists from "./PopUpsMarkers/MarkersLists";

const GeneralMap = dynamic(() => import("./GeneralMap"), { ssr: false });

export default async function DynamicCategoryMap({
  category,
  catPosts,
}: {
  catPosts?: iPost[];
  category: categoryName[];
}) {
  const categoryPosts = catPosts || (await getPostsWithCat(category));

  if (!categoryPosts) return <>No posts from the zone</>;
  const postsWithCoordinates = (
    await Promise.all(categoryPosts.map(async (post) => addLatLongToPost(post)))
  ).filter(Boolean) as iPost[];

  return (
    <GeneralMap>
      <MarkersLists lists={{ posts: postsWithCoordinates }} showPosts={true} />
    </GeneralMap>
  );
}
