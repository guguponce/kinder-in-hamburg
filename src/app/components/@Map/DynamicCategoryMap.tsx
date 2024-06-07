import {
  getApprovedPostWithCat,
  getFlohmarktWithID,
  getPostWithBezirk,
} from "@app/api/dbActions";
import { getAddressQuery, getLatLong } from "@app/utils/functions";
import { categoryName, iPost, iPostWithCoordinates } from "@app/utils/types";
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
    await Promise.all(
      categoryPosts.map(async (post) => {
        if (post.lat && post.lon) return post as iPostWithCoordinates;
        if (!post.address) return false;

        const addressQuery = getAddressQuery(post.address);
        const { lat, lon } = await getLatLong(addressQuery);

        return {
          ...post,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        } as iPostWithCoordinates;
      })
    )
  ).filter(Boolean) as iPostWithCoordinates[];

  return (
    <Map
      postID={postsWithCoordinates[0].id.toString()}
      postsNearbyWithCoordinates={postsWithCoordinates}
    />
  );
}
