import { getFlohmarktWithID, getPostWithBezirk } from "@app/api/dbActions";
import { getAddressQuery, getLatLong } from "@app/utils/functions";
import {
  iAddress,
  iBezirk,
  iFlohmarktWithCoordinates,
  iPostWithCoordinates,
} from "@app/utils/types";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default async function DynamicMap({
  postID,
  bezirk,
}: {
  postID: string;
  bezirk: iBezirk;
}) {
  const bezirkPosts = await getPostWithBezirk(bezirk);
  if (!bezirkPosts) return <>No posts from the zone</>;
  const postsWithCoordinates = (
    await Promise.all(
      bezirkPosts.map(async (post) => {
        if (!post.address) return false;
        const addressQuery = getAddressQuery(post.address);
        const { lat, lon } = await getLatLong(addressQuery);

        return {
          ...post,
          lat: parseInt(lat),
          lon: parseInt(lon),
        } as iPostWithCoordinates;
      })
    )
  ).filter(Boolean) as iPostWithCoordinates[];
  const currentTarget =
    postsWithCoordinates.find((p) => p.id === parseInt(postID)) ||
    (await getFlohmarktWithID(postID).then(async (f) => {
      if (!f) {
        return false;
      } else {
        const addressQuery = f.address
          ? f.address.replace(/[ ,]/g, "+")
          : `${f.stadtteil || ""}+${f.bezirk}+Hamburg`;
        const { lat, lon } = await getLatLong(addressQuery);
        return {
          ...f,
          lat: parseInt(lat),
          lon: parseInt(lon),
        } as iFlohmarktWithCoordinates;
      }
    }));
  if (!currentTarget) return <></>;
  return (
    <Map
      postID={postID}
      currentTarget={currentTarget}
      postsNearbyWithCoordinates={postsWithCoordinates}
    />
  );
}
